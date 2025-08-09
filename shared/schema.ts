import { pgTable, text, serial, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameProfiles = pgTable("game_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  coins: integer("coins").notNull().default(0),
  totalClicks: integer("total_clicks").notNull().default(0),
  introShown: boolean("intro_shown").notNull().default(false),
  hourlyIncome: integer("hourly_income").notNull().default(0),
  lastSeenAt: integer("last_seen_at").notNull().$default(() => Math.floor(Date.now() / 1000)),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameProfileSchema = createInsertSchema(gameProfiles).pick({
  userId: true,
  coins: true,
  totalClicks: true,
  introShown: true,
  hourlyIncome: true,
  lastSeenAt: true,
});

// New tables for upgrade cards system
export const upgradeCards = pgTable("upgrade_cards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  rarity: varchar("rarity", { length: 50 }).notNull(), // common, rare, epic, legendary, mythic
  incomeBoost: integer("income_boost").notNull(),
  price: integer("price").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  purchasedAt: integer("purchased_at").notNull().$default(() => Math.floor(Date.now() / 1000)),
});

// Relations
export const gameProfilesRelations = relations(gameProfiles, ({ many }) => ({
  userCards: many(userCards),
}));

export const upgradeCardsRelations = relations(upgradeCards, ({ many }) => ({
  userCards: many(userCards),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  gameProfile: one(gameProfiles, { fields: [userCards.userId], references: [gameProfiles.userId] }),
  card: one(upgradeCards, { fields: [userCards.cardId], references: [upgradeCards.id] }),
}));

// Additional schemas
export const insertUpgradeCardSchema = createInsertSchema(upgradeCards).pick({
  name: true,
  description: true,
  rarity: true,
  incomeBoost: true,
  price: true,
  imageUrl: true,
});

export const insertUserCardSchema = createInsertSchema(userCards).pick({
  userId: true,
  cardId: true,
  quantity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameProfile = typeof gameProfiles.$inferSelect;
export type InsertGameProfile = z.infer<typeof insertGameProfileSchema>;
export type UpgradeCard = typeof upgradeCards.$inferSelect;
export type InsertUpgradeCard = z.infer<typeof insertUpgradeCardSchema>;
export type UserCard = typeof userCards.$inferSelect;
export type InsertUserCard = z.infer<typeof insertUserCardSchema>;
