"use client";

import {useState} from "react";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";
import {scrapeProduct} from "@/lib/firecrawl";
import {addProduct} from "@/actions/product.action";
import {da} from "zod/locales";
// import {toast} from "sonner";

export default function AddProductForm({user}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("url", url);

    try {
      const product = await addProduct(url);
      toast.success("Product Added Successfully");
      setUrl("");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 w-full"
      >
        <div className="relative flex-grow">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product link (Daraz, Amazon, etc.)"
            className="input input-bordered w-full h-14 bg-neutral-900 border-white/10 text-white focus:border-orange-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn h-14 px-8 bg-orange-500 hover:bg-orange-600 border-none text-white font-bold transition-all ${
            loading ? "loading loading-spinner" : ""
          }`}
        >
          {loading ? "Searching..." : "Track Price"}
        </button>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
