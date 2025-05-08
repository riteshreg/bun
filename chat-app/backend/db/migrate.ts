import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

console.log("migration started...")
migrate(db, { migrationsFolder: "./drizzle" })
console.log("migration completed...")
