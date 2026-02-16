import {NextResponse} from "next/server";
import {PriceHistory} from "@/models/priceHistory.model";
import connectDB from "@/lib/db";
import {Product} from "@/models/product.model";
import {scrapeProduct} from "@/lib/firecrawl";
import mongoose from "mongoose";
import {sendEmail} from "@/lib/email"; // Your nodemailer function
import {success} from "zod";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    await connectDB();

    const products = await Product.find({});
    console.log(`Checking ${products.length} products...`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        // --- 1. Validate userId before using it ---
        if (!mongoose.Types.ObjectId.isValid(product.userId)) {
          console.warn(
            `Invalid userId for product ${product._id}: ${product.userId}`,
          );
          results.failed++;
          continue;
        }

        // --- 2. Scrape current data ---
        const scrapedData = await scrapeProduct(product.url);
        if (!scrapedData || !scrapedData.currentPrice) {
          console.warn(
            `No price data for product ${product._id} (${product.url})`,
          );
          results.failed++;
          NextResponse.json({success: false, message: "Failed to scrap data."});
          continue;
        }

        // --- 3. Fetch the user who owns this product ---
        // Collection name is likely "users" (plural) if your model is named "User"
        const user = await mongoose.connection.db.collection("users").findOne({
          _id: new mongoose.Types.ObjectId(product.userId),
        });

        const userEmail = user?.email;
        console.log(`Product ${product._id} – user email:`, userEmail);

        // --- 4. Sanitise and parse prices ---
        const cleanPrice = scrapedData.currentPrice.replace(/[^0-9.-]/g, "");
        const newPrice = parseFloat(cleanPrice);
        if (isNaN(newPrice)) {
          console.warn(
            `Invalid price for product ${product._id}: ${scrapedData.currentPrice}`,
          );
          results.failed++;
          continue;
        }
        const oldPrice = parseFloat(product.currentPrice);

        // --- 5. Update product ---
        product.currentPrice = newPrice;
        product.name = scrapedData.name || product.name;
        product.imageUrl = scrapedData.imageUrl || product.imageUrl;
        await product.save();

        // --- 6. If price changed, record history ---
        if (oldPrice !== newPrice) {
          await PriceHistory.create({
            productId: product._id,
            price: newPrice,
            currency: scrapedData.currency || product.currency,
          });

          results.priceChanges++;

          // --- 7. If price dropped and we have an email, send alert ---
          if (newPrice < oldPrice && userEmail) {
            try {
              const html = `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #f97316;">Great News, ${user?.name || "Customer"}!</h2>
                  <p>The price for <strong>${product.name}</strong> just dropped.</p>
                  <p>Was: <strike>${product.currency} ${oldPrice}</strike></p>
                  <p style="font-size: 1.2rem; color: #16a34a;"><strong>Now: ${product.currency} ${newPrice}</strong></p>
                  <br />
                  <a href="${product.url}" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Buy it Now</a>
                </div>
              `;

              const result = await sendEmail(
                userEmail,
                `📉 Price Drop Alert: ${product.name}`,
                html,
              );

              if (result.success) {
                results.alertsSent++;
                console.log(
                  `Alert sent for product ${product._id} to ${userEmail}`,
                );
              } else {
                console.error(
                  `Failed to send email for product ${product._id}:`,
                  result.error,
                );
              }
            } catch (emailError) {
              console.error(
                `Email error for product ${product._id}:`,
                emailError,
              );
            }
          }
        }

        results.updated++;
      } catch (error) {
        console.error(
          `Unhandled error with product ${product._id}:`,
          error.message,
        );
        results.failed++;
      }
    }

    return NextResponse.json({success: true, results});
  } catch (error) {
    console.error("Cron job fatal error:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
