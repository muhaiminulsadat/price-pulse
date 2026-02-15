import {NextResponse} from "next/server";
import {PriceHistory} from "@/models/priceHistory.model";
import {Resend} from "resend";
import connectDB from "@/lib/db";
import {Product} from "@/models/product.model";
import {scrapeProduct} from "@/lib/firecrawl";
import {getCurrentUser} from "@/actions/user.action";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    const session = await getCurrentUser();
    const userEmail = session.user.email;

    // Security Check
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    await connectDB();

    // 1. Fetch all products from MongoDB
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
        // 2. Scrape the current website price
        const scrapedData = await scrapeProduct(product.url);

        if (!scrapedData || !scrapedData.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = parseFloat(scrapedData.currentPrice);
        const oldPrice = parseFloat(product.currentPrice);

        // 3. Update the Product in MongoDB
        product.currentPrice = newPrice;
        product.name = scrapedData.name || product.name;
        product.imageUrl = scrapedData.imageUrl || product.imageUrl;
        await product.save();

        // 4. If price changed, save history
        if (oldPrice !== newPrice) {
          await PriceHistory.create({
            productId: product._id,
            price: newPrice,
            currency: scrapedData.currency || product.currency,
          });

          results.priceChanges++;

          // 5. If price dropped, send email via Resend
          if (newPrice < oldPrice && userEmail) {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL,
              to: userEmail,
              subject: `📉 Price Drop Alert: ${product.name}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #f97316;">Great News, ${session.user.name}!</h2>
                  <p>The price for <strong>${product.name}</strong> just dropped.</p>
                  <p>Was: <strike>${product.currency} ${oldPrice}</strike></p>
                  <p style="font-size: 1.2rem; color: #16a34a;"><strong>Now: ${product.currency} ${newPrice}</strong></p>
                  <br />
                  <a href="${product.url}" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Buy it Now</a>
                </div>
              `,
            });
            results.alertsSent++;
          }
        }

        results.updated++;
      } catch (error) {
        console.error(`Error with product ${product._id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({success: true, results});
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
