import { createDbFromEnv } from "../src/server.ts";

async function main() {
  const { db, client } = createDbFromEnv();

  try {
    const rows = await db.run("SELECT 1 AS ok");
    console.log("[db:ping] conexión OK:", rows.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("[db:ping] error de conexión:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
