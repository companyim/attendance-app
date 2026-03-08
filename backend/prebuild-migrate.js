const { Client } = require('pg');

async function migrate() {
  const url = process.env.DATABASE_URL;
  if (!url || url.startsWith('file:')) {
    console.log('[PreBuild] SQLite or no DB - skip migration');
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    const { rows } = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'department_id'
    `);

    if (rows.length === 0) {
      console.log('[PreBuild] department_id already removed - nothing to do');
      await client.end();
      return;
    }

    console.log('[PreBuild] Migrating department_id -> student_departments...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "student_departments" (
        "id" TEXT NOT NULL,
        "student_id" TEXT NOT NULL,
        "department_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "student_departments_pkey" PRIMARY KEY ("id")
      )
    `);

    await client.query(`
      INSERT INTO "student_departments" ("id", "student_id", "department_id")
      SELECT gen_random_uuid()::text, "id", "department_id" 
      FROM "students" 
      WHERE "department_id" IS NOT NULL
      ON CONFLICT DO NOTHING
    `);

    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "student_departments_student_id_department_id_key" ON "student_departments"("student_id", "department_id")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "student_departments_student_id_idx" ON "student_departments"("student_id")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "student_departments_department_id_idx" ON "student_departments"("department_id")`);

    try { await client.query(`ALTER TABLE "student_departments" ADD CONSTRAINT "student_departments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`); } catch (_) {}
    try { await client.query(`ALTER TABLE "student_departments" ADD CONSTRAINT "student_departments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE`); } catch (_) {}

    const count = await client.query(`SELECT count(*) as cnt FROM "student_departments"`);
    console.log(`[PreBuild] Migrated ${count.rows[0].cnt} department records`);
    console.log('[PreBuild] Migration complete - safe to drop department_id');
  } catch (err) {
    console.error('[PreBuild] Migration error:', err.message);
  } finally {
    await client.end();
  }
}

migrate().catch(e => { console.error(e); process.exit(1); });
