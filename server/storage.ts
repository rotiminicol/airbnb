import { properties, users, wishlist, type Property, type InsertProperty, type User, type InsertUser, type WishlistItem, type InsertWishlistItem } from "@shared/schema";
import { xanoAPI } from "./xano";

export interface IStorage {
  // Properties
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  searchProperties(query: string): Promise<Property[]>;
  getPropertiesByCategory(category: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wishlist
  getWishlistByUserId(userId: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, propertyId: number): Promise<boolean>;
  isInWishlist(userId: number, propertyId: number): Promise<boolean>;

  // Amenities
  getAllAmenities(): Promise<Amenity[]>;
  getAmenityById(id: number): Promise<Amenity | undefined>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;

  // Bookings
  getAllBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBookingsByPropertyId(propertyId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Reviews
  getAllReviews(): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewsByPropertyId(propertyId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class XanoStorage implements IStorage {
  // Properties
  async getAllProperties(): Promise<Property[]> {
    try {
      return await xanoAPI.getAllProperties();
    } catch (error) {
      console.error('Failed to fetch properties from Xano:', error);
      return [];
    }
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    try {
      return await xanoAPI.getPropertyById(id);
    } catch (error) {
      console.error(`Failed to fetch property ${id} from Xano:`, error);
      return undefined;
    }
  }

  async searchProperties(query: string): Promise<Property[]> {
    try {
      return await xanoAPI.searchProperties(query);
    } catch (error) {
      console.error('Failed to search properties in Xano:', error);
      return [];
    }
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    try {
      return await xanoAPI.getPropertiesByCategory(category);
    } catch (error) {
      console.error(`Failed to fetch properties by category ${category} from Xano:`, error);
      return [];
    }
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return await xanoAPI.createProperty(property);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      return await xanoAPI.getUser(id);
    } catch (error) {
      console.error(`Failed to fetch user ${id} from Xano:`, error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await xanoAPI.getUserByUsername(username);
      return user || undefined;
    } catch (error) {
      console.error(`Failed to fetch user by username ${username} from Xano:`, error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await xanoAPI.getUserByEmail(email);
      return user || undefined;
    } catch (error) {
      console.error(`Failed to fetch user by email ${email} from Xano:`, error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    return await xanoAPI.createUser(user);
  }

  // Wishlist
  async getWishlistByUserId(userId: number): Promise<WishlistItem[]> {
    try {
      return await xanoAPI.getWishlistByUserId(userId);
    } catch (error) {
      console.error(`Failed to fetch wishlist for user ${userId} from Xano:`, error);
      return [];
    }
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    return await xanoAPI.addToWishlist(item);
  }

  async removeFromWishlist(userId: number, propertyId: number): Promise<boolean> {
    try {
      return await xanoAPI.removeFromWishlist(userId, propertyId);
    } catch (error) {
      console.error(`Failed to remove from wishlist in Xano:`, error);
      return false;
    }
  }

  async isInWishlist(userId: number, propertyId: number): Promise<boolean> {
    try {
      return await xanoAPI.isInWishlist(userId, propertyId);
    } catch (error) {
      console.error(`Failed to check wishlist status in Xano:`, error);
      return false;
    }
  }
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private users: Map<number, User>;
  private wishlistItems: Map<number, WishlistItem>;
  private currentPropertyId: number;
  private currentUserId: number;
  private currentWishlistId: number;

  constructor() {
    this.properties = new Map();
    this.users = new Map();
    this.wishlistItems = new Map();
    this.currentPropertyId = 1;
    this.currentUserId = 1;
    this.currentWishlistId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    const sampleProperties: InsertProperty[] = [
      {
        title: "Luxury Beachfront Villa",
        description: "Beautiful beachfront villa with infinity pool overlooking the ocean. Perfect for a romantic getaway or family vacation.",
        location: "Malibu, California",
        pricePerNight: "1200.00",
        rating: "4.98",
        reviewCount: 124,
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Pool", "Free parking", "Kitchen", "Air conditioning", "Ocean view"],
        propertyType: "Villa",
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        hostName: "Sarah",
        hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: true,
        latitude: "34.0259",
        longitude: "-118.7798",
        category: "Amazing views",
        isGuestFavorite: true,
        hasUniqueStay: false,
      },
      {
        title: "Mountain Cabin Retreat",
        description: "Rustic mountain cabin surrounded by pine trees and forest. Perfect for hiking and outdoor adventures.",
        location: "Aspen, Colorado",
        pricePerNight: "450.00",
        rating: "4.87",
        reviewCount: 89,
        images: [
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Fireplace", "Kitchen", "Mountain view", "Hiking trails"],
        propertyType: "Cabin",
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        hostName: "Mike",
        hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: false,
        latitude: "39.1911",
        longitude: "-106.8175",
        category: "Cabins",
        isGuestFavorite: false,
        hasUniqueStay: false,
      },
      {
        title: "Urban Loft Downtown",
        description: "Modern urban loft with exposed brick walls and large windows in the heart of the city.",
        location: "Brooklyn, New York",
        pricePerNight: "320.00",
        rating: "4.92",
        reviewCount: 67,
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Kitchen", "City view", "Workspace", "Near subway"],
        propertyType: "Loft",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        hostName: "Emma",
        hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: true,
        latitude: "40.6782",
        longitude: "-73.9442",
        category: "Trending",
        isGuestFavorite: false,
        hasUniqueStay: false,
      },
      {
        title: "Tropical Resort Bungalow",
        description: "Overwater bungalow with direct access to crystal clear lagoon and pristine coral reefs.",
        location: "Bora Bora, French Polynesia",
        pricePerNight: "2500.00",
        rating: "5.00",
        reviewCount: 43,
        images: [
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Private beach", "Snorkeling gear", "Room service", "Spa access"],
        propertyType: "Bungalow",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        hostName: "Jean-Pierre",
        hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: true,
        latitude: "-16.5004",
        longitude: "-151.7415",
        category: "Beachfront",
        isGuestFavorite: false,
        hasUniqueStay: true,
      },
      {
        title: "Desert Modern Villa",
        description: "Contemporary desert villa with infinity pool and panoramic mountain views.",
        location: "Scottsdale, Arizona",
        pricePerNight: "680.00",
        rating: "4.89",
        reviewCount: 92,
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Pool", "Desert view", "Hot tub", "Golf course access"],
        propertyType: "Villa",
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
        hostName: "Carlos",
        hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: false,
        latitude: "33.4942",
        longitude: "-111.9261",
        category: "Amazing pools",
        isGuestFavorite: false,
        hasUniqueStay: false,
      },
      {
        title: "Lakeside Cottage",
        description: "Charming lakeside cottage with wooden dock and scenic lake views. Perfect for fishing and boating.",
        location: "Lake Tahoe, California",
        pricePerNight: "280.00",
        rating: "4.76",
        reviewCount: 156,
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Lake access", "Kayaks", "Fireplace", "Kitchen"],
        propertyType: "Cottage",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        hostName: "Jennifer",
        hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: false,
        latitude: "39.0968",
        longitude: "-120.0324",
        category: "Amazing views",
        isGuestFavorite: false,
        hasUniqueStay: false,
      },
      {
        title: "Historic Edinburgh Townhouse",
        description: "Beautiful historic townhouse in the heart of Edinburgh's Old Town with classic architecture.",
        location: "Edinburgh, Scotland",
        pricePerNight: "195.00",
        rating: "4.94",
        reviewCount: 78,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Historic charm", "City center", "Garden", "Kitchen"],
        propertyType: "Townhouse",
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        hostName: "Duncan",
        hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: true,
        latitude: "55.9533",
        longitude: "-3.1883",
        category: "Design",
        isGuestFavorite: false,
        hasUniqueStay: false,
      },
      {
        title: "Forest Treehouse",
        description: "Unique treehouse accommodation nestled high in the forest canopy with breathtaking views.",
        location: "Olympic Peninsula, Washington",
        pricePerNight: "175.00",
        rating: "4.83",
        reviewCount: 234,
        images: [
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        amenities: ["WiFi", "Forest views", "Hiking trails", "Unique experience", "Kitchen"],
        propertyType: "Treehouse",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        hostName: "Rachel",
        hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        hostIsSuperhost: false,
        latitude: "47.8021",
        longitude: "-123.6044",
        category: "Treehouses",
        isGuestFavorite: false,
        hasUniqueStay: true,
      }
    ];

    sampleProperties.forEach(property => {
      this.createProperty(property);
    });
  }

  // Properties
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async searchProperties(query: string): Promise<Property[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.properties.values()).filter(property =>
      property.location.toLowerCase().includes(lowerQuery) ||
      property.title.toLowerCase().includes(lowerQuery) ||
      property.description.toLowerCase().includes(lowerQuery)
    );
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property =>
      property.category === category
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Wishlist
  async getWishlistByUserId(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = this.currentWishlistId++;
    const item: WishlistItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.wishlistItems.set(id, item);
    return item;
  }

  async removeFromWishlist(userId: number, propertyId: number): Promise<boolean> {
    const itemToRemove = Array.from(this.wishlistItems.entries()).find(
      ([_, item]) => item.userId === userId && item.propertyId === propertyId
    );
    
    if (itemToRemove) {
      this.wishlistItems.delete(itemToRemove[0]);
      return true;
    }
    return false;
  }

  async isInWishlist(userId: number, propertyId: number): Promise<boolean> {
    return Array.from(this.wishlistItems.values()).some(
      item => item.userId === userId && item.propertyId === propertyId
    );
  }
}

// Use Xano storage for production, fallback to memory storage for development
export const storage = process.env.NODE_ENV === 'development' && !process.env.XANO_API_ENDPOINT 
  ? new MemStorage() 
  : new XanoStorage();
