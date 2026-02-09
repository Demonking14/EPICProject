import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const POPULAR_STATES = [
  "Maharashtra",
  "Punjab",
  "Karnataka",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Andhra Pradesh",
  "West Bengal",
];
const POPULAR_COMMODITIES = [
  "Tomato",
  "Onion",
  "Potato",
  "Wheat",
  "Rice",
  "Cotton",
  "Soybean",
  "Turmeric",
  "Cabbage",
  "Brinjal",
];

function MandiPrices() {
  const { t } = useTranslation();
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");
  const [pricePerKg, setPricePerKg] = useState(false);
  const [data, setData] = useState({
    records: [],
    count: 0,
    source: "",
    unit: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrices = async () => {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (state.trim()) params.set("state", state.trim());
      if (district.trim()) params.set("district", district.trim());
      if (commodity.trim()) params.set("commodity", commodity.trim());
      params.set("pricePerKg", pricePerKg ? "1" : "0");
      params.set("limit", "100");
      const result = await api(`/api/mandi/prices?${params.toString()}`);
      setData(result);
      if (result.message) setError(result.message);
    } catch (err) {
      setError(err.message || "Failed to load mandi prices.");
      setData((prev) => ({ ...prev, records: [], count: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [pricePerKg]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  const clearFilters = () => {
    setState("");
    setDistrict("");
    setCommodity("");
    setError("");
    setLoading(true);
    api("/api/mandi/prices?limit=100&pricePerKg=" + (pricePerKg ? "1" : "0"))
      .then((result) => {
        setData(result);
        if (result.message) setError(result.message);
      })
      .catch((err) => {
        setError(err.message || "Failed to load mandi prices.");
        setData((prev) => ({ ...prev, records: [], count: 0 }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <section className="space-y-6">
        <div className="content-card p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
                AGMARKNET
              </p>
              <h2 className="section-heading">{t("daily_mandi_prices")}</h2>
              <p className="subheading mt-2">{t("mandi_desc")}</p>
            </div>
          </div>
        </div>

        <div className="content-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {t("filters")}
          </h3>
          <form
            onSubmit={handleFilter}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="text-sm font-medium text-slate-600">
                {t("state_label")}
              </label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="e.g. Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                list="states-list"
              />
              <datalist id="states-list">
                {POPULAR_STATES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">
                {t("district")}
              </label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="e.g. Nashik"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">
                {t("commodity")}
              </label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="e.g. Tomato, Wheat"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                list="commodities-list"
              />
              <datalist id="commodities-list">
                {POPULAR_COMMODITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <button type="submit" className="btn-primary">
                {t("apply")}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="btn-outline"
              >
                {t("clear")}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.checked)}
                className="rounded border-slate-300 text-green-600"
              />
              <span className="text-sm font-medium text-slate-700">
                {t("show_price_per_kg")}
              </span>
            </label>
            {data.source && (
              <span className="text-xs text-slate-500">
                {t("source")}: {data.source}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="content-card overflow-hidden p-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">{t("price_list")}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {data.unit &&
                `Prices in ₹ per ${pricePerKg ? "kg" : "quintal (100 kg)"}. `}
              {data.count} record(s) shown.
            </p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                {t("loading")}
              </div>
            ) : !data.records?.length ? (
              <div className="p-12 text-center text-slate-500">
                No records found. Try different filters or clear filters to load
                recent data.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-semibold text-slate-700">
                      {t("state_label")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("district")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("market")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("commodity")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("variety")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("date")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("min_rs")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {t("max_rs")}
                    </th>
                    <th className="p-3 font-semibold text-slate-700">
                      {pricePerKg ? t("modal_rs_kg") : t("modal_rs_q")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="p-3 text-slate-800">{row.State || "—"}</td>
                      <td className="p-3 text-slate-700">
                        {row.District || "—"}
                      </td>
                      <td className="p-3 text-slate-700">
                        {row.Market || "—"}
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        {row.Commodity || "—"}
                      </td>
                      <td className="p-3 text-slate-600">
                        {row.Variety || "—"}
                      </td>
                      <td className="p-3 text-slate-600">
                        {row.Arrival_Date || "—"}
                      </td>
                      <td className="p-3 text-slate-700">
                        {row.Min_Price != null ? row.Min_Price : "—"}
                      </td>
                      <td className="p-3 text-slate-700">
                        {row.Max_Price != null ? row.Max_Price : "—"}
                      </td>
                      <td className="p-3 font-semibold text-green-700">
                        {pricePerKg
                          ? row.modal_price_per_kg != null
                            ? row.modal_price_per_kg
                            : "—"
                          : row.Modal_Price != null
                            ? row.Modal_Price
                            : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MandiPrices;
