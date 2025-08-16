import { pgTableCreator, serial, text, timestamp } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `cosmos_strategy_${name}`);

export const contactFormTable = createTable("contact_form", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
