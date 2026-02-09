import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const statusStyle = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function MyInquiries() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api("/api/inquiries/my")
      .then((data) => {
        if (!cancelled) setInquiries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load requests.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="content-card p-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
            MESSAGES & OFFERS
          </p>
          <h2 className="section-heading">
            {t("my_requests") || "My requests"}
          </h2>
          <p className="subheading mt-2">
            {t("my_requests_desc") ||
              "Your lot requests and chats with farmers."}
          </p>
        </div>

        {error && (
          <div className="rounded-[2rem] bg-red-50 p-6 font-bold text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="content-card p-20 text-center border-dashed border-slate-200 shadow-none">
            <div className="mx-auto h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-3xl mb-6">
              ✉️
            </div>
            <p className="text-slate-400 font-bold tracking-tight">
              {t("no_inquiries_yet") ||
                "You haven’t requested any lots yet. Use “Request lot” on the Marketplace to start."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((inv) => (
              <div
                key={inv._id}
                className="content-card p-8 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center text-2xl border border-green-100">
                      {inv.product?.category === "Cereals"
                        ? "🌾"
                        : inv.product?.category === "Vegetables"
                          ? "🥦"
                          : "📦"}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {inv.product?.name}
                      </h3>
                      <p className="text-sm font-bold text-slate-400 mt-1">
                        Farmer:{" "}
                        <span className="text-slate-600">
                          {inv.product?.farmer?.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span
                      className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest ring-1 ${
                        inv.status === "pending"
                          ? "bg-amber-50 text-amber-600 ring-amber-100"
                          : inv.status === "accepted"
                            ? "bg-green-50 text-green-600 ring-green-100"
                            : "bg-slate-50 text-slate-500 ring-slate-100"
                      }`}
                    >
                      {inv.status}
                    </span>

                    <button
                      className="btn-primary py-3 px-8 text-sm"
                      onClick={() => navigate(`/inquiry/${inv._id}/chat`)}
                    >
                      {t("message") || "Message"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default MyInquiries;
