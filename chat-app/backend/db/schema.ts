import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const Chats = sqliteTable("chats", {
  id: integer("id").primaryKey(),
  message: text("message").notNull(),
  date: text("date").notNull(),
  username: text("username").notNull().default("anonymous")
});

export type Chat  = InferSelectModel<typeof Chats>