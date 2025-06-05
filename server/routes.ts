import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { xanoAPI } from "./xano";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let properties;
      if (search && typeof search === 'string') {
        properties = await storage.searchProperties(search);
      } else if (category && typeof category === 'string') {
        properties = await storage.getPropertiesByCategory(category);
      } else {
        properties = await storage.getAllProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // Wishlist routes (simplified for demo - in real app would need authentication)
  app.get("/api/wishlist", async (req, res) => {
    try {
      // For demo purposes, using a default user ID
      const userId = 1;
      const wishlist = await storage.getWishlistByUserId(userId);
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const schema = z.object({
        propertyId: z.number(),
        userId: z.number().default(1), // Default user for demo
      });
      
      const data = schema.parse(req.body);
      const item = await storage.addToWishlist(data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:propertyId", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      
      // For demo purposes, using a default user ID
      const userId = 1;
      const success = await storage.removeFromWishlist(userId, propertyId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Wishlist item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });
      
      const data = schema.parse(req.body);
      const result = await xanoAPI.login(data.email, data.password);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      });
      
      const data = schema.parse(req.body);
      const result = await xanoAPI.signup(data.name, data.email, data.password);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to create account" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
      
      const user = await xanoAPI.getMe(token);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const schema = z.object({
        check_in_date: z.string(),
        check_out_date: z.string(),
        total_price: z.number(),
        property_id: z.number(),
        user_id: z.number(),
      });
      
      const data = schema.parse(req.body);
      const booking = await xanoAPI.createBooking(data);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const bookings = await xanoAPI.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
