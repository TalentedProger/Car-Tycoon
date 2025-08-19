import { users, gameProfiles, upgradeCards, userCards, licensePlates, type User, type InsertUser, type GameProfile, type InsertGameProfile, type UpgradeCard, type InsertUpgradeCard, type UserCard, type InsertUserCard, type LicensePlate, type InsertLicensePlate } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, isNull } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameProfile(userId: number): Promise<GameProfile | undefined>;
  createGameProfile(gameProfile: InsertGameProfile): Promise<GameProfile>;
  updateGameProfile(userId: number, gameProfile: Partial<GameProfile>): Promise<GameProfile>;
  getAllUpgradeCards(): Promise<UpgradeCard[]>;
  getUserCards(userId: string): Promise<Array<UserCard & { card: UpgradeCard }>>;
  purchaseCard(userId: string, cardId: number): Promise<UserCard>;
  createUpgradeCard(card: InsertUpgradeCard): Promise<UpgradeCard>;
  calculateOfflineIncome(userId: string): Promise<{ hours: number; income: number } | null>;
  updateUserHourlyIncome(userId: string, carPrice: number, upgradeCardBonus?: number): Promise<void>;
  // License plate operations
  generateLicensePlate(regionCode: string, regionName: string, userId: string): Promise<LicensePlate>;
  getUserLicensePlates(userId: string): Promise<LicensePlate[]>;
  checkPlateAvailability(plateNumber: string): Promise<boolean>;
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

  async getAllUpgradeCards(): Promise<UpgradeCard[]> {
    return await db.select().from(upgradeCards).orderBy(upgradeCards.price);
  }

  async getUserCards(userId: string): Promise<Array<UserCard & { card: UpgradeCard }>> {
    const result = await db
      .select({
        id: userCards.id,
        userId: userCards.userId,
        cardId: userCards.cardId,
        quantity: userCards.quantity,
        purchasedAt: userCards.purchasedAt,
        card: {
          id: upgradeCards.id,
          name: upgradeCards.name,
          description: upgradeCards.description,
          rarity: upgradeCards.rarity,
          incomeBoost: upgradeCards.incomeBoost,
          price: upgradeCards.price,
          imageUrl: upgradeCards.imageUrl,
        }
      })
      .from(userCards)
      .innerJoin(upgradeCards, eq(userCards.cardId, upgradeCards.id))
      .where(eq(userCards.userId, userId));
    
    return result as Array<UserCard & { card: UpgradeCard }>;
  }

  async purchaseCard(userId: string, cardId: number): Promise<UserCard> {
    const [userCard] = await db
      .insert(userCards)
      .values({
        userId,
        cardId,
        quantity: 1,
        purchasedAt: Math.floor(Date.now() / 1000),
      })
      .returning();
    return userCard;
  }

  async createUpgradeCard(card: InsertUpgradeCard): Promise<UpgradeCard> {
    const [upgradeCard] = await db
      .insert(upgradeCards)
      .values(card)
      .returning();
    return upgradeCard;
  }

  async calculateOfflineIncome(userId: string): Promise<{ hours: number; income: number } | null> {
    const profile = await db.select().from(gameProfiles).where(eq(gameProfiles.userId, userId)).limit(1);
    if (!profile.length) return null;
    
    const now = Math.floor(Date.now() / 1000);
    const lastSeen = profile[0].lastSeenAt;
    const hourlyIncome = profile[0].hourlyIncome;
    
    const secondsDiff = now - lastSeen;
    const hoursDiff = secondsDiff / 3600;
    
    // Only calculate if user was away for at least 1 hour
    if (hoursDiff < 1) return null;
    
    // Calculate income for up to 24 hours maximum (to prevent inflation)
    const cappedHours = Math.min(Math.floor(hoursDiff), 24);
    const offlineIncome = cappedHours * hourlyIncome;
    
    return { hours: cappedHours, income: offlineIncome };
  }

  async updateUserHourlyIncome(userId: string, carPrice: number, upgradeCardBonus: number = 0): Promise<void> {
    // Calculate hourly income: 0.25% (0.0025) of car price + upgrade cards bonus
    const baseHourlyIncome = Math.ceil(carPrice * 0.0025);
    const totalHourlyIncome = baseHourlyIncome + upgradeCardBonus;
    
    await db
      .update(gameProfiles)
      .set({ hourlyIncome: totalHourlyIncome })
      .where(eq(gameProfiles.userId, userId));
  }

  // License plate operations
  async generateLicensePlate(regionCode: string, regionName: string, userId: string): Promise<LicensePlate> {
    const allowedLetters = ["А", "В", "Е", "К", "М", "Н", "О", "Р", "С", "Т", "У", "Х", "D"];
    let plateNumber = "";
    let isUnique = false;
    
    // Generate unique plate number
    while (!isUnique) {
      // Generate format: БББ-ЦЦЦ where Б = letter, Ц = digit
      const letter1 = allowedLetters[Math.floor(Math.random() * allowedLetters.length)];
      const letter2 = allowedLetters[Math.floor(Math.random() * allowedLetters.length)];
      const letter3 = allowedLetters[Math.floor(Math.random() * allowedLetters.length)];
      const digit1 = Math.floor(Math.random() * 10);
      const digit2 = Math.floor(Math.random() * 10);
      const digit3 = Math.floor(Math.random() * 10);
      
      plateNumber = `${letter1}${digit1}${digit2}${digit3}${letter2}${letter3} ${regionCode}`;
      isUnique = await this.checkPlateAvailability(plateNumber);
    }
    
    const [licensePlate] = await db
      .insert(licensePlates)
      .values({
        plateNumber,
        regionCode,
        regionName,
        userId,
        purchasedAt: Math.floor(Date.now() / 1000),
        price: 2500,
      })
      .returning();
    
    return licensePlate;
  }

  async getUserLicensePlates(userId: string): Promise<LicensePlate[]> {
    return await db
      .select()
      .from(licensePlates)
      .where(eq(licensePlates.userId, userId));
  }

  async checkPlateAvailability(plateNumber: string): Promise<boolean> {
    const existing = await db
      .select()
      .from(licensePlates)
      .where(eq(licensePlates.plateNumber, plateNumber))
      .limit(1);
    
    return existing.length === 0; // true if available
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

  async getAllUpgradeCards(): Promise<UpgradeCard[]> {
    return [];
  }

  async getUserCards(userId: string): Promise<Array<UserCard & { card: UpgradeCard }>> {
    return [];
  }

  async purchaseCard(userId: string, cardId: number): Promise<UserCard> {
    return {} as UserCard;
  }

  async createUpgradeCard(card: InsertUpgradeCard): Promise<UpgradeCard> {
    return {} as UpgradeCard;
  }

  async calculateOfflineIncome(userId: string): Promise<{ hours: number; income: number } | null> {
    return null;
  }

  async updateUserHourlyIncome(userId: string, carPrice: number, upgradeCardBonus: number = 0): Promise<void> {
    // In-memory storage implementation - would need to store this data somewhere
    // For now this is just a stub implementation
    return;
  }

  async generateLicensePlate(regionCode: string, regionName: string, userId: string): Promise<LicensePlate> {
    return {} as LicensePlate;
  }

  async getUserLicensePlates(userId: string): Promise<LicensePlate[]> {
    return [];
  }

  async checkPlateAvailability(plateNumber: string): Promise<boolean> {
    return true;
  }
}

export const storage = new DatabaseStorage();
