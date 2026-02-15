import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    price: {type: Number, required: true},
    currency: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

export const PriceHistory =
  mongoose.models.PriceHistory ||
  mongoose.model("PriceHistory", PriceHistorySchema);
