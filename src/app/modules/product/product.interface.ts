import { ObjectId } from "mongoose";

export interface IProduct {
  title: string; // Full product name (e.g., "Men's Cotton T-Shirt")
  shortTitle?: string; // Short name for displays (e.g., "Cotton T-Shirt")
  description: string; // Detailed HTML/text description
  shortDescription?: string; // Brief summary for cards/listing

  // Pricing
  price: number; // Base price (always required)
  originalPrice?: number; // Strikethrough price for discounts
  discountPercentage?: number; // Calculated discount (0-100)
  costPrice?: number; // Wholesale/manufacturing cost

  // Inventory
  stock: number; // Available quantity
  lowStockThreshold?: number; // Alert when stock ≤ this value
  weight?: number; // In grams/kg for shipping
  dimensions?: {
    // Product size (L×W×H)
    length: number;
    width: number;
    height: number;
  };

  // Categorization
  category: ObjectId; // Main category (should be a Mongoose ObjectId reference)
  subCategory?: ObjectId; // Sub-category (should be a Mongoose ObjectId reference)
  tags?: ObjectId[]; // Searchable keywords (should be an array of Mongoose ObjectId references)

  // Media
  images: string[]; // Array of image URLs
  thumbnail?: string; // Primary image URL
  videoUrl?: string; // Product demo video

  // Variants
  attributes?: {
    // Key-value pairs (e.g., {color: "Red", size: "XL"})
    [key: string]: string;
  };

  // Marketing
  featured?: boolean; // Show in featured section
  rating?: {
    // Aggregate reviews
    average: number;
    count: number;
  };

  // Logistics
  shipping?: {
    free: boolean;
    processingTime: string; // e.g., "1-2 business days"
  };

  // Status/Dates
  isDeleted?: boolean;
  isActive?: boolean; // Temporary hide without deleting
}
