"use server";
import connectDB from "@/lib/db";
import {auth, getSession} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {Product} from "@/models/product.model";
import {scrapeProduct} from "@/lib/firecrawl";
import {PriceHistory} from "@/models/priceHistory.model";
import {convertToObject} from "@/utils/utility";
import mongoose from "mongoose";

export const addProduct = async (url) => {
  const productData = await scrapeProduct(url);

  const {productName, currentPrice, currencyCode, productImageUrl} =
    productData;
  if (!productData) return {error: "Could not find product details"};

  const session = await getSession();

  const res = await Product.create({
    userId: session.user.id,
    url,
    name: productName,
    imageUrl: productImageUrl,
    currentPrice,
    currency: currencyCode,
  });

  revalidatePath("/");

  return convertToObject(res);
};

export async function deleteProduct(productId) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return {error: "Product not found or unauthorized"};
    }

    revalidatePath("/");
    return {success: true, message: "Product deleted successfully"};
  } catch (error) {
    console.error("Delete error:", error);
    return {error: "Failed to delete product"};
  }
}

export async function getProducts() {
  try {
    const session = await getSession();
    if (!session) return [];

    const products = await Product.find({userId: session.user.id})
      .sort({createdAt: -1})
      .lean();

    return convertToObject(products);
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export const getPriceHistory = async (id) => {
  try {
    await connectDB();

    const queryId = new mongoose.Types.ObjectId(id);

    const price_history = await PriceHistory.find({productId: queryId}).sort({
      createdAt: 1,
    });
    if (!price_history || price_history.length === 0) {
      console.log("No product history found for ID:", id);
      return [];
    }

    return convertToObject(price_history);
  } catch (error) {
    console.log("Get price history error: ", error);
    return [];
  }
};
