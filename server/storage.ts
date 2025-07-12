import { users, gameProfiles, type User, type InsertUser, type GameProfile, type InsertGameProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameProfile(userId: number): Promise<GameProfile | undefined>;
  createGameProfile(gameProfile: InsertGameProfile): Promise<GameProfile>;
  updateGameProfile(userId: number, gameProfile: Partial<GameProfile>): Promise<GameProfile>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getGameProfile(userId: number): Promise<GameProfile | undefined> {
    const [profile] = await db.select().from(gameProfiles).where(eq(gameProfiles.userId, userId.toString()));
    return profile || undefined;
  }

  async createGameProfile(gameProfile: InsertGameProfile): Promise<GameProfile> {
    const [profile] = await db
      .insert(gameProfiles)
      .values(gameProfile)
      .returning();
    return profile;
  }

  async updateGameProfile(userId: number, gameProfile: Partial<GameProfile>): Promise<GameProfile> {
    const [profile] = await db
      .update(gameProfiles)
      .set(gameProfile)
      .where(eq(gameProfiles.userId, userId.toString()))
      .returning();
    return profile;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameProfile(userId: number): Promise<GameProfile | undefined> {
    return undefined;
  }

  async createGameProfile(gameProfile: InsertGameProfile): Promise<GameProfile> {
    return {} as GameProfile;
  }

  async updateGameProfile(userId: number, gameProfile: Partial<GameProfile>): Promise<GameProfile> {
    return {} as GameProfile;
  }
}

export const storage = new DatabaseStorage();
