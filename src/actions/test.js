"use server";
import {auth} from "@/lib/auth";
import connectDB from "@/lib/db";
import {Product} from "@/models/product.model";
import mongoose from "mongoose";

export const test = async () => {
  await connectDB();

  const product = await Product.findById("698f3570490e89ffeb1c0b0a").lean();
  if (!product) {
    console.log("Product not found");
    return null;
  }

  const user = await mongoose.connection.db.collection("user").findOne({
    _id: new mongoose.Types.ObjectId(product.userId),
  });

  console.log("User found:", user);
};
