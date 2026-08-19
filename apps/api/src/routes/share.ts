import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { notebooks } from "@axioma/db/schema";
import {
  ERROR_CODES,
  buildPublicNotebookUrl,
  generatePublicSlug,
  isValidId,
} from "@axioma/shared";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";
import { requireAuth } from "../middleware/require-auth.ts";

const ShareToggleSchema = z.object({
  enabled: z.boolean(),
});

const MAX_SLUG_REGENERATIONS = 10;

export interface ShareRouterOptions {
  webUrl: string;
}

export function createShareRouter(deps: ApiDeps, opts: ShareRouterOptions): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  const { db, auth } = deps;
  const webUrl = opts.webUrl;
  router.use("*", requireAuth(auth));

  router.post("/notebooks/:id/share", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = ShareToggleSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { enabled } = parsed.data;

    const existingRows = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.ownerId, user.id)));
    if (existingRows.length === 0) {
      return c.json({ error: "Notebook not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }

    if (enabled) {
      let slug: string = generatePublicSlug();
      for (let attempt = 0; attempt < MAX_SLUG_REGENERATIONS; attempt++) {
        const clashes = await db
          .select({ id: notebooks.id })
          .from(notebooks)
          .where(eq(notebooks.publicSlug, slug));
        if (clashes.length === 0) break;
        slug = generatePublicSlug();
      }
      await db
        .update(notebooks)
        .set({ isPublic: true, publicSlug: slug, updatedAt: new Date() })
        .where(eq(notebooks.id, id));
      return c.json(
        {
          isPublic: true,
          publicSlug: slug,
          publicUrl: buildPublicNotebookUrl(slug, webUrl),
        },
        200,
      );
    }

    await db
      .update(notebooks)
      .set({ isPublic: false, publicSlug: null, updatedAt: new Date() })
      .where(eq(notebooks.id, id));
    return c.json({ isPublic: false, publicSlug: null, publicUrl: null }, 200);
  });

  return router;
}