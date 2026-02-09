import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const filters = [
  "All produce",
  "Cereals",
  "Vegetables",
  "Fruits",
  "Spices",
  "Other",
];
const categoryEmoji = {
  Cereals: "🌾",
  Vegetables: "🍅",
  Fruits: "🥭",
  Spices: "🌿",
  Other: "📦",
};

function BuyerMarketplace() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All produce");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (activeFilter !== "All produce")
          params.set("category", activeFilter);
        const data = await api(`/api/products?${params.toString()}`);
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load marketplace.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, activeFilter]);

  const handleRequestLot = async (productId) => {
    setRequestingId(productId);
    try {
      await api("/api/inquiries", {
        method: "POST",
        body: { productId, message: "I would like to request this lot." },
      });
      alert("Request sent! The farmer will get in touch.");
    } catch (err) {
      alert(err.message || "Failed to send request.");
    } finally {
      setRequestingId(null);
    }
  };

  const stats = [
    {
      label: "Verified farmers",
      value: `${products.length > 0 ? new Set(products.map((p) => p.farmer?._id)).size : 0}+`,
      trend: "Listings from farmers",
    },
    {
      label: "Active listings",
      value: `${products.length}`,
      trend: "Available now",
    },
    {
      label: "Categories",
      value: `${filters.length - 1}`,
      trend: "Cereals, Vegetables, Fruits, Spices",
    },
  ];

  return (
    <Layout>
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="content-card p-8 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-green-600 transition-colors">
                {stat.label}
              </p>
              <p className="mt-4 text-4xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-bold text-green-600/80 uppercase tracking-widest">
                  {stat.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="content-card p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
                LIVE MARKETPLACE
              </p>
              <h2 className="section-heading">
                {t("live_marketplace") || "Live marketplace"}
              </h2>
              <p className="subheading mt-2">
                {t("marketplace_desc") ||
                  "Shortlist lots, request samples, or initiate contracts."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-green-600 text-white shadow-xl shadow-green-600/20"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search crops, farmer, location..."
                className="input-field pl-14"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-100/50 p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-green-100">
                ✨
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 tracking-tight">
                  Need something bespoke?
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  Publish a request for proposal instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[2rem] bg-red-50 p-6 font-bold text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full content-card p-20 text-center border-dashed border-slate-200 shadow-none">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600 mx-auto"></div>
              <p className="mt-6 text-slate-400 font-bold tracking-tight">
                Loading marketplace...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full content-card p-20 text-center border-dashed border-slate-200 shadow-none">
              <div className="mx-auto h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-3xl mb-6">
                🌾
              </div>
              <p className="text-slate-400 font-bold tracking-tight">
                No products match your search. Try a different filter or search
                term.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="content-card p-8 group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="rounded-full bg-slate-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-100">
                    {product.category || "Other"}
                  </span>
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-500">
                    {categoryEmoji[product.category] || "📦"}
                  </span>
                </div>

                {product.imageUrl ? (
                  <div className="relative overflow-hidden rounded-[1.5rem] mb-6 aspect-video">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="h-40 w-full mb-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 text-5xl">
                    🏜️
                  </div>
                )}

                <div className="space-y-1 mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600/80">
                    {product.location}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-green-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-slate-400">
                    By{" "}
                    <span className="text-slate-600">
                      {product.farmer?.name || "Farmer"}
                    </span>
                  </p>
                </div>

                <div className="flex items-baseline justify-between mb-8 border-y border-slate-50 py-4">
                  <div>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      ₹{product.price}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      / {product.unit || "kg"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      Min Order
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {product.quantity}
                      {product.unit || "kg"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    className="btn-primary py-4"
                    onClick={() => handleRequestLot(product._id)}
                    disabled={requestingId === product._id}
                  >
                    {requestingId === product._id ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Request lot"
                    )}
                  </button>
                  <button
                    className="btn-outline py-4 text-xs"
                    onClick={() => navigate("/my-inquiries")}
                  >
                    Message farmer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
}

export default BuyerMarketplace;
