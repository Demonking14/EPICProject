import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const statCards = [
  { key_label: "active_contracts", value: "—", key_detail: "contracts_detail" },
  { key_label: "projected_revenue", value: "—", key_detail: "revenue_detail" },
  {
    key_label: "fulfillment_score",
    value: "—",
    key_detail: "fulfillment_detail",
  },
];

const statusStyle = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function FarmerDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [productsData, inquiriesData] = await Promise.all([
          api("/api/products/my"),
          api("/api/inquiries/my").catch(() => []),
        ]);
        if (!cancelled) {
          setProducts(productsData);
          setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this lot?")) return;
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || "Failed to remove product.");
    }
  };

  const handleAcceptReject = async (inquiryId, status) => {
    setUpdatingId(inquiryId);
    try {
      const updated = await api(`/api/inquiries/${inquiryId}`, {
        method: "PUT",
        body: { status },
      });
      setInquiries((prev) =>
        prev.map((i) =>
          i._id === inquiryId ? { ...i, status: updated.status } : i,
        ),
      );
    } catch (err) {
      alert(err.message || "Failed to update.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Layout>
      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {statCards.map((card, index) => (
            <div
              key={card.key_label}
              className="content-card p-8 group cursor-pointer"
            >
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-green-600 transition-colors">
                {t(card.key_label)}
              </p>
              <p className="mt-4 text-4xl font-black text-slate-900 tracking-tight">
                {card.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-green-600/80">
                {t(card.key_detail)}
              </p>
            </div>
          ))}
        </div>

        <div className="content-card p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-heading">{t("inventory_overview")}</h2>
              <p className="subheading">{t("inventory_desc")}</p>
            </div>
            <div className="flex gap-3">
              <button
                className="btn-outline"
                onClick={() => navigate("/add-product")}
              >
                {t("add_new_lot")}
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate("/add-product")}
              >
                {t("quick_listing")}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="mt-8 space-y-4">
            {loading ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-400 font-medium">
                  {t("loading_listings")}
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-400 font-medium">{t("no_listings")}</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-6 shadow-sm transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-600/80">
                        {t("lot_number")}
                        {String(product._id).slice(-6)}
                      </p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500">
                        {t("target_price")}{" "}
                        <span className="text-slate-900">₹{product.price}</span>{" "}
                        / {product.unit || "kg"}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                        {t("status")}
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {product.status || "Listed"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm border-t border-slate-100/50 pt-5">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                        product.status === "Negotiating"
                          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                          : product.status === "Sample sent"
                            ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                            : "bg-slate-200 text-slate-600 ring-1 ring-slate-300"
                      }`}
                    >
                      {product.status || "Listed"}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      {t("availability")}:{" "}
                      <span className="text-slate-900">
                        {product.availability}
                      </span>
                    </span>
                    <div className="ml-auto flex gap-3">
                      <button
                        className="btn-outline text-xs px-5 py-2"
                        onClick={() => navigate("/add-product")}
                      >
                        {t("add_another")}
                      </button>
                      <button
                        className="rounded-2xl bg-red-50 px-5 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
                        onClick={() => handleDelete(product._id)}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="content-card p-10">
          <h2 className="section-heading">{t("buyer_requests")}</h2>
          <p className="subheading mt-2">{t("buyer_requests_desc")}</p>
          <div className="mt-8 space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-400 font-medium">
                  {t("no_buyer_requests")}
                </p>
              </div>
            ) : (
              inquiries.map((inv) => (
                <div
                  key={inv._id}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-wrap items-center justify-between gap-6 transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">
                      {inv.product?.name}
                    </p>
                    <p className="text-sm font-semibold text-slate-500">
                      {t("from")}:{" "}
                      <span className="text-slate-900">{inv.buyer?.name}</span>
                    </p>
                    {inv.message && (
                      <p className="text-sm text-slate-600 italic bg-white/80 p-3 rounded-xl border border-slate-100 mt-3">
                        “{inv.message}”
                      </p>
                    )}
                    <div className="pt-2">
                      <span
                        className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${statusStyle[inv.status] || "bg-slate-100 text-slate-600"}`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="btn-outline text-sm py-2 px-5"
                      onClick={() => navigate(`/inquiry/${inv._id}/chat`)}
                    >
                      {t("message_buyer")}
                    </button>
                    {inv.status === "pending" && (
                      <>
                        <button
                          className="btn-primary py-2 px-6 text-sm"
                          onClick={() =>
                            handleAcceptReject(inv._id, "accepted")
                          }
                          disabled={updatingId === inv._id}
                        >
                          {t("accept")}
                        </button>
                        <button
                          className="rounded-2xl bg-red-50 px-6 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
                          onClick={() =>
                            handleAcceptReject(inv._id, "rejected")
                          }
                          disabled={updatingId === inv._id}
                        >
                          {t("reject")}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default FarmerDashboard;
