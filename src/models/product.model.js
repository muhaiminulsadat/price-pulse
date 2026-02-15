import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    userId: {type: String, required: true},
    url: {type: String, required: true},
    name: {type: String, required: true}, // Changed from title to match function
    imageUrl: {type: String}, // Changed from image to match function
    currentPrice: {type: Number, required: true},
    currency: {type: String, default: "USD"}, // Added currency
    lowestPrice: {type: Number},
    highestPrice: {type: Number},
  },
  {timestamps: true},
);

// This prevents the same user from adding the same URL twice
ProductSchema.index({userId: 1, url: 1}, {unique: true});

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
