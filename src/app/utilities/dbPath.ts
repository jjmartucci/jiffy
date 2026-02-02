import path from "path";

/**
 * Returns the absolute path to the SQLite database file.
 *
 * Uses DB_PATH environment variable if set (for Render persistent disk),
 * otherwise defaults to db/jiffy.db in the project root.
 *
 * Local: DB_PATH not set, uses ./db/jiffy.db
 * Render: DB_PATH=/var/data/jiffy.db
 */
export function getDbPath(): string {
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }
  return path.join(process.cwd(), "db", "jiffy.db");
}

export function getDbBackupPath(): string {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  return path.join(dir, "jiffy-backup.db");
}

export function getDbTempPath(): string {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  return path.join(dir, "jiffy-temp.db");
}
