import { Property, InsertProperty, User, InsertUser, WishlistItem, InsertWishlistItem } from "@shared/schema";

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

  // Properties
  async getAllProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties');
  }

  async getPropertyById(id: number): Promise<Property> {
    return this.request<Property>(`/properties/${id}`);
  }

  async searchProperties(query: string): Promise<Property[]> {
    return this.request<Property[]>(`/properties/search?q=${encodeURIComponent(query)}`);
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    return this.request<Property[]>(`/properties/category/${encodeURIComponent(category)}`);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  // Users
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      return await this.request<User>(`/users/username/${encodeURIComponent(username)}`);
    } catch (error) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.request<User>(`/users/email/${encodeURIComponent(email)}`);
    } catch (error) {
      return null;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.request<User>('/users', {
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