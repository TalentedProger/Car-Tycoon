import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameProfile = typeof gameProfiles.$inferSelect;
export type InsertGameProfile = z.infer<typeof insertGameProfileSchema>;
