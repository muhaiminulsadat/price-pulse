"use client";
import {useState} from "react";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {deleteProduct, getPriceHistory} from "@/actions/product.action";
import PriceChart from "./PriceChart";
import {test} from "@/actions/test";

export default function ProductCard({product}) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;
    setDeleting(true);
    try {
      await deleteProduct(product._id);
      toast.success("Product deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete product.");
      setDeleting(false);
    }
  };

  return (
    <div className="card bg-neutral-900 border border-white/5 shadow-xl hover:border-orange-500/30 transition-all duration-300">
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex gap-4">
          {product.imageUrl && (
            <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1">
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="object-contain w-full h-full"
                height={100}
                width={100}
                unoptimized // Useful for external store images
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-100 line-clamp-2 mb-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-orange-500">
                {product.currency} {product.currentPrice}
              </span>
              <div className="badge badge-orange-500/10 border-orange-500/20 text-orange-500 text-[10px] gap-1 px-2 font-bold uppercase">
                <TrendingDown className="w-3 h-3" />
                Live
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/5 my-3" />

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              className={`btn btn-xs h-9 px-3 gap-1 border-white/10 hover:bg-neutral-800 ${
                showChart
                  ? "bg-orange-500 text-white border-none"
                  : "bg-transparent text-gray-400"
              }`}
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Chart
            </button>

            <Link
              href={product.url}
              target="_blank"
              className="btn btn-xs h-9 px-3 gap-1 bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-neutral-800"
            >
              <ExternalLink size={14} />
              Store
            </Link>
          </div>

          <button
            className="btn btn-xs h-9 px-3 bg-transparent border-none text-gray-500 hover:text-error hover:bg-error/10 transition-colors"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={14} />
            {deleting ? "..." : ""}
          </button>
        </div>

        {showChart && (
          <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
            <div className="h-[120px] w-full overflow-hidden">
              <PriceChart id={product._id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
