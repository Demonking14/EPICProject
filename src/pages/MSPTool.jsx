import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const MSPTool = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    crop: "",
    state: "",
    price: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMSPList();
  }, []);

  const fetchMSPList = async () => {
    try {
      const data = await api("/api/mandi/msp");
      setCrops(data);
    } catch (err) {
      console.error("Failed to fetch MSP list");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await api("/api/mandi/compare-price", {
        method: "POST",
        body: formData,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="content-card p-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
            PRICE COMPARISON
          </p>
          <h2 className="section-heading">{t("msp_calculator_title")}</h2>
          <p className="subheading mt-2">{t("msp_calculator_desc")}</p>
        </div>

        <div className="content-card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("select_crop")}
                </label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="appearance-none w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all focus:border-green-400 focus:ring-4 focus:ring-green-100/50 focus:bg-white outline-none"
                  required
                >
                  <option value="">{t("select_crop_placeholder")}</option>
                  {crops.map((c) => (
                    <option key={c.crop} value={c.crop}>
                      {c.crop} ({c.year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("state_optional")}
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="appearance-none w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all focus:border-green-400 focus:ring-4 focus:ring-green-100/50 focus:bg-white outline-none"
                >
                  <option value="">{t("select_state_placeholder")}</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("offered_price")}
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 2100"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
                  {t("calculating")}
                </span>
              ) : (
                t("check_deal")
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-600 ring-1 ring-red-100">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="content-card p-10 border-t-4 border-green-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">
                {t("verdict")}:
              </span>
              {result.isGoodDeal ? (
                <span className="text-green-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {t("good_deal")}
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {t("below_fair_price")}
                </span>
              )}
            </h3>

            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {t("your_offer")}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  ₹{result.offeredPrice}
                  <span className="text-xs text-slate-400 font-bold">/q</span>
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                  {t("govt_msp")}
                </p>
                <p className="text-2xl font-black text-blue-700">
                  ₹{result.msp}
                  <span className="text-xs text-blue-400 font-bold">/q</span>
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">
                  {t("est_market_rate")}
                </p>
                <p className="text-2xl font-black text-orange-700">
                  ₹{result.marketRate}
                  <span className="text-xs text-orange-400 font-bold">/q</span>
                </p>
              </div>
            </div>

            <div
              className={`p-6 rounded-[1.5rem] text-sm font-bold tracking-tight leading-relaxed ${
                result.isGoodDeal
                  ? "bg-green-50 text-green-800 ring-1 ring-green-100"
                  : "bg-red-50 text-red-800 ring-1 ring-red-100"
              }`}
            >
              {result.isGoodDeal
                ? `Great! Your offer is ₹${result.difference} higher than the MSP. This is a solid deal for your produce.`
                : `Caution! This offer is ₹${result.difference} lower than the Government MSP. We recommend checking other Mandis before closing.`}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MSPTool;
