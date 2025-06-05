import { Property, InsertProperty, User, InsertUser, WishlistItem, InsertWishlistItem } from "@shared/schema";

// Xano data types based on your actual schema
interface XanoProperty {
  id: number;
  created_at: string;
  title: string;
  description: string;
  price_per_night: number;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  number_of_guests: number;
  number_of_bedrooms: number;
  number_of_beds: number;
  number_of_bathrooms: number;
  user_id: number;
  amenity: number;
}

interface XanoUser {
  id: number;
  created_at: string;
  name: string;
  email: string;
  password: string;
  profile_picture?: string;
  bio?: string;
}

interface XanoReview {
  id: number;
  created_at: string;
  rating: number;
  comment: string;
  property_id: number;
  user_id: number;
  booking_id: number;
}

export class XanoAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.XANO_API_ENDPOINT || '';
    this.apiKey = process.env.XANO_API_KEY || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Xano API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  private transformXanoProperty(xanoProperty: XanoProperty): Property {
    return {
      id: xanoProperty.id,
      title: xanoProperty.title,
      description: xanoProperty.description,
      pricePerNight: xanoProperty.price_per_night.toString(),
      address: xanoProperty.address,
      city: xanoProperty.city,
      state: xanoProperty.state,
      country: xanoProperty.country,
      latitude: xanoProperty.latitude?.toString() || null,
      longitude: xanoProperty.longitude?.toString() || null,
      numberOfGuests: xanoProperty.number_of_guests,
      numberOfBedrooms: xanoProperty.number_of_bedrooms,
      numberOfBeds: xanoProperty.number_of_beds,
      numberOfBathrooms: xanoProperty.number_of_bathrooms.toString(),
      userId: xanoProperty.user_id,
      amenity: xanoProperty.amenity,
      createdAt: new Date(xanoProperty.created_at),
      
      // Computed fields for frontend compatibility
      location: `${xanoProperty.city}, ${xanoProperty.state}`,
      rating: "4.85", // Default rating - could be computed from reviews
      reviewCount: 127, // Default review count - could be computed from reviews
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      amenities: ["WiFi", "Kitchen", "Free parking", "Air conditioning"], // Default amenities
      propertyType: xanoProperty.number_of_bedrooms > 3 ? "Villa" : xanoProperty.number_of_bedrooms > 1 ? "House" : "Apartment",
      maxGuests: xanoProperty.number_of_guests,
      bedrooms: xanoProperty.number_of_bedrooms,
      bathrooms: Math.floor(xanoProperty.number_of_bathrooms),
      hostName: "Sarah", // Default host - could be fetched from user table
      hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      hostIsSuperhost: true,
      category: xanoProperty.city.toLowerCase().includes('beach') || xanoProperty.city.toLowerCase().includes('ocean') ? "Beachfront" : 
                xanoProperty.city.toLowerCase().includes('mountain') || xanoProperty.city.toLowerCase().includes('aspen') ? "Cabins" : "Trending",
      isGuestFavorite: Math.random() > 0.7,
      hasUniqueStay: xanoProperty.price_per_night > 1000,
      cancellationPolicy: "flexible",
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
    };
  }

  // Properties
  async getAllProperties(): Promise<Property[]> {
    const xanoProperties = await this.request<XanoProperty[]>('/property');
    return xanoProperties.map(property => this.transformXanoProperty(property));
  }

  async getPropertyById(id: number): Promise<Property> {
    return this.request<Property>(`/property/${id}`);
  }

  async searchProperties(query: string): Promise<Property[]> {
    // For now, get all properties and filter client-side since no search endpoint exists
    const allProperties = await this.getAllProperties();
    return allProperties.filter(property => 
      property.title?.toLowerCase().includes(query.toLowerCase()) ||
      property.city?.toLowerCase().includes(query.toLowerCase()) ||
      property.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    // For now, get all properties and filter client-side since no category endpoint exists
    const allProperties = await this.getAllProperties();
    return allProperties.filter(property => 
      property.category?.toLowerCase() === category.toLowerCase()
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return this.request<Property>('/property', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  // Users
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/user/${id}`);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      // Get all users and filter by username since no specific endpoint exists
      const users = await this.request<User[]>('/user');
      return users.find(user => user.username === username) || null;
    } catch (error) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Get all users and filter by email since no specific endpoint exists
      const users = await this.request<User[]>('/user');
      return users.find(user => user.email === email) || null;
    } catch (error) {
      return null;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.request<User>('/user', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Wishlist
  async getWishlistByUserId(userId: number): Promise<WishlistItem[]> {
    return this.request<WishlistItem[]>(`/wishlist/user/${userId}`);
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    return this.request<WishlistItem>('/wishlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeFromWishlist(userId: number, propertyId: number): Promise<boolean> {
    try {
      await this.request(`/wishlist/user/${userId}/property/${propertyId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isInWishlist(userId: number, propertyId: number): Promise<boolean> {
    try {
      await this.request(`/wishlist/user/${userId}/property/${propertyId}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const xanoAPI = new XanoAPI();