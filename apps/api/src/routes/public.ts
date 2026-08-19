import { Hono } from "hono";
import { and, asc, eq } from "drizzle-orm";
import { cells, notebooks } from "@axioma/db/schema";
import type { Cell } from "@axioma/shared";
import { ERROR_CODES, isValidPublicSlug } from "@axioma/shared";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";

export function createPublicRouter(deps: ApiDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  const { db } = deps;

  router.get("/notebooks/:slug", async (c) => {
    const slug = c.req.param("slug");
    if (!isValidPublicSlug(slug)) {
      return c.json({ error: "Not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }

    const nbRows = await db
      .select({
        id: notebooks.id,
        title: notebooks.title,
        accent: notebooks.accent,
      })
      .from(notebooks)
      .where(and(eq(notebooks.publicSlug, slug), eq(notebooks.isPublic, true)));
    if (nbRows.length === 0) {
      return c.json({ error: "Not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    const nb = nbRows[0]!;

    const cellRows = await db
      .select()
      .from(cells)
      .where(eq(cells.notebookId, nb.id))
      .orderBy(asc(cells.orderIdx));

    return c.json({ notebook: nb, cells: cellRows as Cell[] }, 200);
  });

  return router;
}