import { Hono } from "hono";
import { and, desc, eq, lt, max, or } from "drizzle-orm";
import { cells, notebooks } from "@axioma/db/schema";
import {
  CreateCellRequestSchema,
  CreateNotebookRequestSchema,
  ERROR_CODES,
  isValidAccent,
  isValidId,
  ReorderRequestSchema,
  sortCellsByOrderIdx,
  UpdateNotebookRequestSchema,
  type Cell,
  type ID,
  type Notebook,
} from "@axioma/shared";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";
import { requireAuth } from "../middleware/require-auth.ts";

const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 100;

export function createNotebooksRouter(deps: ApiDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  const { db, auth } = deps;
  router.use("*", requireAuth(auth));

  router.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json().catch(() => null);
    const parsed = CreateNotebookRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { title, accent, folderId } = parsed.data;
    if (accent !== undefined && accent !== null && !isValidAccent(accent)) {
      return c.json({ error: "Invalid accent", code: ERROR_CODES.VALIDATION }, 400);
    }
    if (folderId !== undefined && folderId !== null && !isValidId(folderId)) {
      return c.json({ error: "Invalid folderId", code: ERROR_CODES.VALIDATION }, 400);
    }
    const id = crypto.randomUUID();
    const now = new Date();
    const row = {
      id,
      ownerId: user.id,
      title: title ?? "Untitled",
      folderId: folderId ?? null,
      accent: accent ?? null,
      isPublic: false,
      publicSlug: null,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(notebooks).values(row);
    return c.json(row as Notebook, 201);
  });

  router.get("/", async (c) => {
    const user = c.get("user");
    const cursor = c.req.query("cursor");
    const limitRaw = c.req.query("limit");
    let limit = DEFAULT_LIST_LIMIT;
    if (limitRaw !== undefined && limitRaw !== null && limitRaw !== "") {
      const n = Number(limitRaw);
      if (!Number.isFinite(n) || n <= 0) {
        return c.json({ error: "Invalid limit", code: ERROR_CODES.VALIDATION }, 400);
      }
      limit = Math.min(Math.floor(n), MAX_LIST_LIMIT);
    }

    const conditions: ReturnType<typeof eq>[] = [eq(notebooks.ownerId, user.id)];
    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (!decoded) {
        return c.json({ error: "Invalid cursor", code: ERROR_CODES.VALIDATION }, 400);
      }
      const { ts, id: cursorId } = decoded;
      const cursorDate = new Date(ts);
      const cursorCond = or(
        lt(notebooks.updatedAt, cursorDate),
        and(eq(notebooks.updatedAt, cursorDate), lt(notebooks.id, cursorId)),
      );
      if (cursorCond) conditions.push(cursorCond);
    }

    const rows = await db
      .select()
      .from(notebooks)
      .where(and(...conditions))
      .orderBy(desc(notebooks.updatedAt), desc(notebooks.id))
      .limit(limit + 1);

    let items = rows as Notebook[];
    let nextCursor: string | null = null;
    if (items.length > limit) {
      const last = items[limit - 1]!;
      items = items.slice(0, limit);
      nextCursor = encodeCursor(last.updatedAt, last.id);
    }
    return c.json({ items, nextCursor }, 200);
  });

  router.get("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const nbRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)))
      .limit(1);
    const nb = nbRows[0] ?? null;
    if (!nb) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    const cellRows = await db
      .select()
      .from(cells)
      .where(eq(cells.notebookId, id))
      .orderBy(cells.orderIdx);
    return c.json(
      { notebook: nb as Notebook, cells: sortCellsByOrderIdx(cellRows as Cell[]) },
      200,
    );
  });

  router.patch("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = UpdateNotebookRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { title, accent, folderId } = parsed.data;
    if (accent !== undefined && accent !== null && !isValidAccent(accent)) {
      return c.json({ error: "Invalid accent", code: ERROR_CODES.VALIDATION }, 400);
    }
    if (folderId !== undefined && folderId !== null && !isValidId(folderId)) {
      return c.json({ error: "Invalid folderId", code: ERROR_CODES.VALIDATION }, 400);
    }
    const existingRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)))
      .limit(1);
    if (existingRows.length === 0) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    const update: {
      title?: string;
      accent?: string | null;
      folderId?: string | null;
      updatedAt: Date;
    } = { updatedAt: new Date() };
    if (title !== undefined) update.title = title;
    if (accent !== undefined) update.accent = accent;
    if (folderId !== undefined) update.folderId = folderId;
    await db.update(notebooks).set(update).where(eq(notebooks.id, id));
    const updatedRows = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.id, id))
      .limit(1);
    return c.json(updatedRows[0] as Notebook, 200);
  });

  router.delete("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const existingRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)))
      .limit(1);
    if (existingRows.length === 0) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    await db.delete(notebooks).where(eq(notebooks.id, id));
    return c.body(null, 204);
  });

  router.post("/:id/cells", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = CreateCellRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { kind, input, orderIdx } = parsed.data;
    const nbRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)))
      .limit(1);
    if (nbRows.length === 0) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    let nextIdx = orderIdx;
    if (nextIdx === undefined) {
      const maxRows = await db
        .select({ max: max(cells.orderIdx) })
        .from(cells)
        .where(eq(cells.notebookId, id));
      const maxIdx = maxRows[0]?.max ?? null;
      nextIdx = maxIdx === null ? 0 : maxIdx + 1;
    }
    const cellId = crypto.randomUUID();
    const now = new Date();
    const row = {
      id: cellId,
      notebookId: id,
      orderIdx: nextIdx,
      kind,
      input: input ?? "",
      output: null,
      references: null,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(cells).values(row);
    return c.json(row as Cell, 201);
  });

  router.post("/:id/reorder", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = ReorderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const order = parsed.data.order;
    const nbRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)))
      .limit(1);
    if (nbRows.length === 0) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    const ownCells = await db
      .select({ id: cells.id })
      .from(cells)
      .where(eq(cells.notebookId, id));
    const ownIds = new Set<ID>(ownCells.map((r) => r.id));
    for (const cid of order) {
      if (!ownIds.has(cid)) {
        return c.json(
          { error: "Cell does not belong to notebook", code: ERROR_CODES.VALIDATION },
          400,
        );
      }
    }
    await db.transaction(async (tx) => {
      for (let i = 0; i < order.length; i++) {
        const cid = order[i]!;
        await tx.update(cells).set({ orderIdx: i }).where(eq(cells.id, cid));
      }
    });
    return c.json({ ok: true }, 200);
  });

  return router;
}

function encodeCursor(ts: Date | number, id: string): string {
  const t = ts instanceof Date ? ts.getTime() : ts;
  return Buffer.from(`${t}|${id}`, "utf8").toString("base64");
}

function decodeCursor(cursor: string): { ts: number; id: string } | null {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf8");
    const sep = decoded.indexOf("|");
    if (sep <= 0) return null;
    const tsStr = decoded.slice(0, sep);
    const id = decoded.slice(sep + 1);
    if (!id) return null;
    const ts = Number(tsStr);
    if (!Number.isFinite(ts)) return null;
    return { ts, id };
  } catch {
    return null;
  }
}