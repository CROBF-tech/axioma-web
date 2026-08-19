import { and, eq } from "drizzle-orm";
import { folders } from "@axioma/db/schema";
import type { DbClient } from "@axioma/db";
import type { Folder, ID } from "@axioma/shared";

export async function validateFolderOwnership(
  db: DbClient,
  userId: string,
  folderId: ID,
): Promise<Folder | null> {
  const rows = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)));
  return rows[0] ?? null;
}