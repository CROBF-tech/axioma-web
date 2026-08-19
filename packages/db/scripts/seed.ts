import { createDb } from "../src/index.ts";
import { folders, notebooks, cells, subscriptions } from "../src/schema/index.ts";
import { eq } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL ?? "file:./local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const DEMO_OWNER_ID = "demo-owner";
const DEMO_FOLDER_ID = "demo-folder";
const DEMO_NOTEBOOK_ID = "demo-notebook";
const DEMO_SUBSCRIPTION_ID = "demo-subscription";

async function seed() {
  const { db, client } = createDb({ url: databaseUrl, authToken });

  try {
    const [existingFolder] = await db
      .select({ id: folders.id })
      .from(folders)
      .where(eq(folders.id, DEMO_FOLDER_ID));

    if (!existingFolder) {
      await db.insert(folders).values({
        id: DEMO_FOLDER_ID,
        ownerId: DEMO_OWNER_ID,
        name: "Raíz demo",
        parentId: null,
        createdAt: new Date(),
      });
      console.log("[seed] folder creado:", DEMO_FOLDER_ID);
    } else {
      console.log("[seed] folder ya existe:", existingFolder.id);
    }

    const [existingNotebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(eq(notebooks.id, DEMO_NOTEBOOK_ID));

    if (!existingNotebook) {
      const now = new Date();
      await db.insert(notebooks).values({
        id: DEMO_NOTEBOOK_ID,
        ownerId: DEMO_OWNER_ID,
        title: "Notebook de bienvenida",
        folderId: DEMO_FOLDER_ID,
        accent: "violet",
        isPublic: false,
        publicSlug: null,
        createdAt: now,
        updatedAt: now,
      });
      console.log("[seed] notebook creado:", DEMO_NOTEBOOK_ID);

      const cellRows: (typeof cells.$inferInsert)[] = [
        {
          id: "demo-cell-math",
          notebookId: DEMO_NOTEBOOK_ID,
          orderIdx: 0,
          kind: "math",
          input: "x^2 + 2*x + 1",
          output: "(x + 1)^2",
          references: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "demo-cell-text",
          notebookId: DEMO_NOTEBOOK_ID,
          orderIdx: 1,
          kind: "text",
          input: "Esta es una celda de texto de ejemplo.",
          output: null,
          references: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "demo-cell-plot",
          notebookId: DEMO_NOTEBOOK_ID,
          orderIdx: 2,
          kind: "plot",
          input: "sin(x)",
          output: null,
          references: ["demo-cell-math"],
          createdAt: now,
          updatedAt: now,
        },
      ];

      await db.insert(cells).values(cellRows);
      console.log("[seed] celdas creadas:", cellRows.map((c) => c.id));
    } else {
      console.log("[seed] notebook ya existe:", existingNotebook.id);
    }

    const [existingSubscription] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.id, DEMO_SUBSCRIPTION_ID));

    if (!existingSubscription) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      await db.insert(subscriptions).values({
        id: DEMO_SUBSCRIPTION_ID,
        userId: DEMO_OWNER_ID,
        plan: "monthly",
        status: "active",
        mpPreapprovalId: null,
        currentPeriodEnd: periodEnd,
        createdAt: now,
        updatedAt: now,
      });
      console.log("[seed] subscription creada:", DEMO_SUBSCRIPTION_ID);
    } else {
      console.log("[seed] subscription ya existe:", existingSubscription.id);
    }
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("[seed] error:", err);
  process.exit(1);
});
