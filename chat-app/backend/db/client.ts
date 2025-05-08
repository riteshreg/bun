import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { desc } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

export const insertMessage = async ({
  message,
}: Pick<schema.Chat, "message">) => {
  await db.insert(schema.Chats).values({
    date: new Date().toISOString(),
    message,
  });
};

export const listAllMessage = async () => {
  return (await db.query.Chats.findMany({ limit: 10 })).reverse();
};
