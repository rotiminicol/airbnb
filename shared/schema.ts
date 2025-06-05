import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  numberOfGuests: integer("number_of_guests").notNull(),
  numberOfBedrooms: integer("number_of_bedrooms").notNull(),
  numberOfBeds: integer("number_of_beds").notNull(),
  numberOfBathrooms: decimal("number_of_bathrooms", { precision: 3, scale: 1 }).notNull(),
  userId: integer("user_id").notNull(),
  amenity: integer("amenity"),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Computed fields for compatibility
  location: text("location"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  images: jsonb("images").$type<string[]>(),
  amenities: jsonb("amenities").$type<string[]>(),
  propertyType: text("property_type"),
  maxGuests: integer("max_guests"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  hostName: text("host_name"),
  hostAvatar: text("host_avatar"),
  hostIsSuperhost: boolean("host_is_superhost").default(false),
  category: text("category"),
  isGuestFavorite: boolean("is_guest_favorite").default(false),
  hasUniqueStay: boolean("has_unique_stay").default(false),
  cancellationPolicy: text("cancellation_policy").default("flexible"),
  checkInTime: text("check_in_time").default("3:00 PM"),
  checkOutTime: text("check_out_time").default("11:00 AM"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: text("session_id").notNull(),
  customerId: text("customer_id").notNull(),
  amountSubtotal: integer("amount_subtotal").notNull(),
  amountTotal: integer("amount_total").notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
  paymentStatus: text("payment_status").notNull(),
});

export const twitterOauthSessions = pgTable("twitter_oauth_sessions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  oauthToken: text("oauth_token").notNull(),
  oauthTokenSecret: text("oauth_token_secret").notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export const insertAmenitySchema = createInsertSchema(amenities).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WishlistItem = typeof wishlist.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistSchema>;
export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
