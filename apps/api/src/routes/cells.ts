import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { cells, notebooks } from "@axioma/db/schema";
import {
  ERROR_CODES,
  isValidId,
  UpdateCellRequestSchema,
  type Cell,
} from "@axioma/shared";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";
import { requireAuth } from "../middleware/require-auth.ts";

export function createCellsRouter(deps: ApiDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  const { db, auth } = deps;
  router.use("*", requireAuth(auth));

  router.patch("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = UpdateCellRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { input, output, references, orderIdx } = parsed.data;

    const owned = await fetchOwnedCell(db, user.id, id);
    if (!owned) {
      return c.json({ error: "Cell not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }

    const update: {
      input?: string;
      output?: string | null;
      references?: string[];
      orderIdx?: number;
      updatedAt: Date;
    } = { updatedAt: new Date() };
    if (input !== undefined) update.input = input;
    if (output !== undefined) update.output = (output as string | null) ?? null;
    if (references !== undefined) update.references = references;
    if (orderIdx !== undefined) update.orderIdx = orderIdx;

    await db.update(cells).set(update).where(eq(cells.id, id));
    const updatedRows = await db
      .select()
      .from(cells)
      .where(eq(cells.id, id))
      .limit(1);
    return c.json(updatedRows[0] as Cell, 200);
  });

  router.delete("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const owned = await fetchOwnedCell(db, user.id, id);
    if (!owned) {
      return c.json({ error: "Cell not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    await db.delete(cells).where(eq(cells.id, id));
    return c.body(null, 204);
  });

  return router;
}

async function fetchOwnedCell(
  db: ApiDeps["db"],
  userId: string,
  cellId: string,
): Promise<{ id: string; notebookId: string } | null> {
  const cellRows = await db
    .select({ id: cells.id, notebookId: cells.notebookId })
    .from(cells)
    .where(eq(cells.id, cellId))
    .limit(1);
  const cellRow = cellRows[0] ?? null;
  if (!cellRow) return null;
  const nbRows = await db
    .select({ id: notebooks.id })
    .from(notebooks)
    .where(and(eq(notebooks.id, cellRow.notebookId), eq(notebooks.ownerId, userId)))
    .limit(1);
  if (nbRows.length === 0) return null;
  return cellRow;
}