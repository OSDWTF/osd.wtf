import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  osdNo: integer("osd_no"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 128 }).notNull().unique(),
  pubkey: varchar("pubkey", { length: 256 }),
  verified: boolean("verified").default(false).notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  xUserId: varchar("x_user_id", { length: 64 }).unique(),
  handle: varchar("handle", { length: 64 }),
  name: varchar("name", { length: 128 }),
  image: varchar("image", { length: 512 }),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const counters = pgTable("counters", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: integer("value").notNull().default(0),
});
