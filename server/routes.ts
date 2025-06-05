import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

  const httpServer = createServer(app);
  return httpServer;
}
