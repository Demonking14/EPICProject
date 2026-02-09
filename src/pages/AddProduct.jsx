import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const CATEGORIES = ["Cereals", "Vegetables", "Fruits", "Spices", "Other"];
const AVAILABILITY = ["Immediate", "Within 7 days", "Within 30 days"];

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    location: "",
    category: "Other",
    availability: "Immediate",
    image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("quantity", formData.quantity);
      form.append("location", formData.location);
      form.append("category", formData.category);
      form.append("availability", formData.availability);
      if (formData.image) form.append("image", formData.image);

      await api("/api/products", { method: "POST", formData: form });
      navigate("/farmer-dashboard");
    } catch (err) {
      setError(err.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-4xl space-y-8">
        <div className="content-card p-10">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
              {t("new_listing")}
            </p>
            <h2 className="section-heading">{t("publish_lot")}</h2>
            <p className="subheading mt-2">{t("publish_desc")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="content-card space-y-8 p-10">
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 ring-1 ring-red-100">
              {error}
            </div>
          )}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("product_name")}
              </label>
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="e.g., Premium Basmati"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("location")}
              </label>
              <input
                type="text"
                name="location"
                className="input-field"
                placeholder="City, State"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              {t("description")}
            </label>
            <textarea
              name="description"
              className="input-field min-h-[140px] resize-none"
              placeholder="Describe grade, harvest cycle, storage conditions, certifications..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("price_rs")}
              </label>
              <input
                type="number"
                name="price"
                className="input-field"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("quantity_kg")}
              </label>
              <input
                type="number"
                name="quantity"
                className="input-field"
                placeholder="0"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("availability")}
              </label>
              <select
                name="availability"
                className="appearance-none w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all focus:border-green-400 focus:ring-4 focus:ring-green-100/50 outline-none"
                value={formData.availability}
                onChange={handleChange}
              >
                {AVAILABILITY.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              {t("category")}
            </label>
            <select
              name="category"
              className="appearance-none w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all focus:border-green-400 focus:ring-4 focus:ring-green-100/50 outline-none"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">
              {t("upload_photos")}
            </label>
            <div className="mt-3 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center bg-slate-50/30 transition-all hover:bg-white hover:border-green-300 group">
              <input
                type="file"
                id="product-image"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <label htmlFor="product-image" className="cursor-pointer block">
                {formData.image ? (
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </span>
                    <p className="font-black text-slate-900">
                      {formData.image.name}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t("click_to_replace")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-20 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <div>
                      <span className="text-lg font-black text-slate-900 block">
                        {t("drop_files")}
                      </span>
                      <p className="text-sm font-medium text-slate-400 mt-1">
                        PNG, JPG or WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-slate-100 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 max-w-sm">
              Submitting this form notifies matching buyers and activates
              fulfillment workflows.
            </p>
            <button
              type="submit"
              className="btn-primary px-12 py-5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  {t("publishing")}
                </span>
              ) : (
                t("publish_listing")
              )}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default AddProduct;
