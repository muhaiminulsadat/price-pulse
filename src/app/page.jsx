import AuthModal from "@/components/AuthModal";
import AddProductForm from "@/components/AddProductForm"; // Import your form
import {TrendingDown, Shield, Bell, Rabbit} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import {getPriceHistory, getProducts} from "@/actions/product.action";
import {getSession} from "@/lib/auth";
import ProductCard from "@/components/ProductCard";
import {test} from "@/actions/test";
import {getCurrentUser} from "@/actions/user.action";

export default async function Home() {
  const session = await getSession();
  const user = session?.user;

  const products = await getProducts();

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "PricePulse extracts prices in seconds from dynamic content.",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description: "Works across major sites with anti-bot protection.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-br from-orange-500/10 via-transparent to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 uppercase tracking-widest">
            {user ? `👋 Welcome ${user.name}` : "🚀 Smart Price Tracking"}
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Start Tracking <br />{" "}
            <span className="text-orange-500">Price Smartly</span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track prices from any e-commerce site. Get instant alerts when
            prices hit your target.
          </p>

          {/* Use your AddProductForm component here */}
          <div className="max-w-2xl mx-auto">
            <AddProductForm user={user} />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
            {FEATURES.map(({icon: Icon, title, description}) => (
              <div
                key={title}
                className="group p-8 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-orange-500/30 transition-all duration-300 text-left"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* If there are no products */}
      {user && products.length === 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-32 text-center">
          <div className="py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
            <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300">
              No products yet
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Paste a link above to start tracking.
            </p>
          </div>
        </section>
      )}

      {/* Have some products */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Tracked Products</h3>
            <span className="text-sm text-base-content/60">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
