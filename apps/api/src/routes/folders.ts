import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { folders, notebooks } from "@axioma/db/schema";
import {
  CreateFolderRequestSchema,
  UpdateFolderRequestSchema,
  ERROR_CODES,
  isFolderDescendant,
  isValidId,
  validateFolderName,
  type Folder,
} from "@axioma/shared";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";
import { requireAuth } from "../middleware/require-auth.ts";

export function createFoldersRouter(deps: ApiDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  const { db, auth } = deps;
  router.use("*", requireAuth(auth));

  router.get("/", async (c) => {
    const user = c.get("user");
    const rows = await db.select().from(folders).where(eq(folders.ownerId, user.id));
    return c.json({ items: rows as Folder[] });
  });

  router.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json().catch(() => null);
    const parsed = CreateFolderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { name, parentId } = parsed.data;
    const nameCheck = validateFolderName(name);
    if (!nameCheck.ok) {
      return c.json({ error: nameCheck.error ?? "Invalid name", code: ERROR_CODES.VALIDATION }, 400);
    }

    if (parentId !== null) {
      if (!isValidId(parentId)) {
        return c.json({ error: "Invalid parentId", code: ERROR_CODES.VALIDATION }, 400);
      }
      const parentRows = await db
        .select()
        .from(folders)
        .where(and(eq(folders.id, parentId), eq(folders.ownerId, user.id)));
      if (parentRows.length === 0) {
        return c.json({ error: "Parent folder not found", code: ERROR_CODES.NOT_FOUND }, 404);
      }
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const row = {
      id,
      ownerId: user.id,
      name: name.trim(),
      parentId,
      createdAt: now,
    };
    await db.insert(folders).values(row);
    return c.json(row as Folder, 201);
  });

  router.patch("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const parsed = UpdateFolderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "ValidationError", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { name, parentId } = parsed.data;

    const existingRows = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.ownerId, user.id)));
    if (existingRows.length === 0) {
      return c.json({ error: "Folder not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }

    if (parentId !== undefined) {
      if (parentId === id) {
        return c.json(
          { error: "A folder cannot be its own parent", code: ERROR_CODES.VALIDATION },
          400,
        );
      }
      if (parentId !== null) {
        if (!isValidId(parentId)) {
          return c.json({ error: "Invalid parentId", code: ERROR_CODES.VALIDATION }, 400);
        }
        const parentRows = await db
          .select()
          .from(folders)
          .where(and(eq(folders.id, parentId), eq(folders.ownerId, user.id)));
        if (parentRows.length === 0) {
          return c.json({ error: "Parent folder not found", code: ERROR_CODES.NOT_FOUND }, 404);
        }
        const allRows = await db.select().from(folders).where(eq(folders.ownerId, user.id));
        if (isFolderDescendant(allRows, parentId, id)) {
          return c.json(
            { error: "Cannot move folder into its own descendant", code: ERROR_CODES.CONFLICT },
            409,
          );
        }
      }
    }

    const update: { name?: string; parentId?: string | null } = {};
    if (name !== undefined) {
      const nameCheck = validateFolderName(name);
      if (!nameCheck.ok) {
        return c.json(
          { error: nameCheck.error ?? "Invalid name", code: ERROR_CODES.VALIDATION },
          400,
        );
      }
      update.name = name.trim();
    }
    if (parentId !== undefined) {
      update.parentId = parentId;
    }

    if (Object.keys(update).length > 0) {
      await db.update(folders).set(update).where(eq(folders.id, id));
    }

    const updatedRows = await db.select().from(folders).where(eq(folders.id, id));
    return c.json(updatedRows[0] as Folder, 200);
  });

  router.delete("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!isValidId(id)) {
      return c.json({ error: "Invalid id", code: ERROR_CODES.VALIDATION }, 400);
    }
    const existingRows = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.ownerId, user.id)));
    if (existingRows.length === 0) {
      return c.json({ error: "Folder not found", code: ERROR_CODES.NOT_FOUND }, 404);
    }

    await db.delete(folders).where(eq(folders.id, id));
    await db
      .update(notebooks)
      .set({ folderId: null })
      .where(and(eq(notebooks.folderId, id), eq(notebooks.ownerId, user.id)));

    return c.body(null, 204);
  });

  return router;
}