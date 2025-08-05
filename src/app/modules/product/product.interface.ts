import { ObjectId } from "mongoose";

export interface IProduct {
  title: string; 
  shortTitle?: string;
  description: string;
  shortDescription?: string;

  // Pricing
  price: number; 
  originalPrice?: number; 
  discountPercentage?: number; 
  costPrice?: number; 

  // Inventory
  stock: number; 
  lowStockThreshold?: number; 
  weight?: number; 
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  category: ObjectId; 

  // Media
  images: string[];
  thumbnail?: string; 
  videoUrl?: string
  attributes?: {
    // Key-value pairs (e.g., {color: "Red", size: "XL"})
    [key: string]: string;
  };

  featured?: boolean; 
  rating?: {
    average: number;
    count: number;
  };
  shipping?: {
    free: boolean;
    processingTime: string; 
  };
  isDeleted?: boolean;
  isActive?: boolean; 
  seller:ObjectId
}
