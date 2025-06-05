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

  private getPropertyImages(property: XanoProperty): string[] {
    const imageMap: { [key: string]: string[] } = {
      'malibu': [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      'aspen': [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      'brooklyn': [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      'miami': [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      'boston': [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      'mendocino': [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ]
    };
    
    const cityKey = property.city.toLowerCase().replace(/\s+/g, '').replace('beach', '');
    return imageMap[cityKey] || imageMap['malibu'];
  }

  private getPropertyAmenities(property: XanoProperty): string[] {
    const baseAmenities = ["WiFi", "Kitchen"];
    
    if (property.city.toLowerCase().includes('beach') || property.city.toLowerCase().includes('miami')) {
      return [...baseAmenities, "Ocean view", "Beach access", "Pool", "Air conditioning"];
    }
    if (property.city.toLowerCase().includes('aspen') || property.city.toLowerCase().includes('mountain')) {
      return [...baseAmenities, "Fireplace", "Mountain view", "Hot tub", "Heating"];
    }
    if (property.city.toLowerCase().includes('brooklyn') || property.city.toLowerCase().includes('boston')) {
      return [...baseAmenities, "Workspace", "Near subway", "City view", "Heating"];
    }
    if (property.title.toLowerCase().includes('treehouse')) {
      return [...baseAmenities, "Forest view", "Unique experience", "Deck", "Nature sounds"];
    }
    
    return [...baseAmenities, "Free parking", "Air conditioning"];
  }

  private transformXanoProperty(xanoProperty: XanoProperty): Property {
    const ratings = [4.72, 4.85, 4.91, 4.96, 4.88, 4.79, 4.83];
    const reviewCounts = [89, 127, 156, 203, 91, 134, 167];
    const randomIndex = xanoProperty.id % ratings.length;

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
      rating: ratings[randomIndex].toString(),
      reviewCount: reviewCounts[randomIndex],
      images: this.getPropertyImages(xanoProperty),
      amenities: this.getPropertyAmenities(xanoProperty),
      propertyType: xanoProperty.title.toLowerCase().includes('villa') ? "Villa" :
                   xanoProperty.title.toLowerCase().includes('cabin') ? "Cabin" :
                   xanoProperty.title.toLowerCase().includes('loft') ? "Loft" :
                   xanoProperty.title.toLowerCase().includes('treehouse') ? "Treehouse" :
                   xanoProperty.number_of_bedrooms > 2 ? "House" : "Apartment",
      maxGuests: xanoProperty.number_of_guests,
      bedrooms: xanoProperty.number_of_bedrooms,
      bathrooms: Math.floor(xanoProperty.number_of_bathrooms),
      hostName: ["Sarah", "Mike", "Emma", "Carlos", "Jennifer", "Duncan"][randomIndex],
      hostAvatar: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
      ][randomIndex],
      hostIsSuperhost: randomIndex % 2 === 0,
      category: xanoProperty.city.toLowerCase().includes('beach') || xanoProperty.city.toLowerCase().includes('miami') ? "Beachfront" :
                xanoProperty.city.toLowerCase().includes('aspen') || xanoProperty.title.toLowerCase().includes('cabin') ? "Cabins" :
                xanoProperty.title.toLowerCase().includes('treehouse') ? "Treehouses" :
                xanoProperty.city.toLowerCase().includes('boston') || xanoProperty.title.toLowerCase().includes('historic') ? "Design" :
                xanoProperty.price_per_night > 800 ? "Amazing pools" : "Trending",
      isGuestFavorite: randomIndex % 3 === 0,
      hasUniqueStay: xanoProperty.price_per_night > 1000 || xanoProperty.title.toLowerCase().includes('treehouse'),
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
    const xanoProperty = await this.request<XanoProperty>(`/property/${id}`);
    return this.transformXanoProperty(xanoProperty);
  }

  async searchProperties(query: string): Promise<Property[]> {
    const allProperties = await this.getAllProperties();
    return allProperties.filter(property => 
      property.title?.toLowerCase().includes(query.toLowerCase()) ||
      property.city?.toLowerCase().includes(query.toLowerCase()) ||
      property.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
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

  // Authentication
  async login(email: string, password: string): Promise<{ user: XanoUser; token: string }> {
    return this.request<{ user: XanoUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string): Promise<{ user: XanoUser; token: string }> {
    return this.request<{ user: XanoUser; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getMe(token: string): Promise<XanoUser> {
    return this.request<XanoUser>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Bookings
  async createBooking(booking: {
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    property_id: number;
    user_id: number;
  }): Promise<any> {
    return this.request('/booking', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getUserBookings(userId: number): Promise<any[]> {
    // Get all bookings and filter by user - since no specific endpoint exists
    const allBookings = await this.request<any[]>('/booking');
    return allBookings.filter(booking => booking.user_id === userId);
  }

  // Wishlist (simplified for now)
  async getWishlistByUserId(userId: number): Promise<WishlistItem[]> {
    // Return empty array for now since wishlist table doesn't exist in your Xano
    return [];
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    // Mock implementation - could be implemented when wishlist table is added to Xano
    throw new Error('Wishlist functionality not implemented in Xano yet');
  }

  async removeFromWishlist(userId: number, propertyId: number): Promise<boolean> {
    return false;
  }

  async isInWishlist(userId: number, propertyId: number): Promise<boolean> {
    return false;
  }
}

export const xanoAPI = new XanoAPI();