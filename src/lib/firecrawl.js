"use server";
import Firecrawl from "@mendable/firecrawl-js";

const app = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const properties = {
  productName: {
    type: "string",
  },
  currentPrice: {
    type: "number",
  },
  currencyCode: {
    type: "string",
  },
  productImageUrl: {
    type: "string",
  },
};

const prompt =
  "Extract the product name as 'productName', current price as a number as 'currentPrice', " +
  "currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available.";

export const scrapeProduct = async (url) => {
  try {
    const result = await app.scrape(url, {
      formats: [
        "markdown",
        {
          type: "json",
          schema: {
            type: "object",
            required: [],
            properties,
          },
          prompt,
        },
      ],
    });

    // if (!result.success) return null;

    return result.json;
  } catch (error) {
    console.error("Firecrawl Error:", error.message);
    return null;
  }
};
