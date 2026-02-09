import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const SubsidyTracker = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: "",
    landSize: "",
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(currentFilters).toString();
      const data = await api(`/api/schemes?${query}`);
      setSchemes(data);
    } catch (err) {
      console.error("Failed to fetch schemes");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchSchemes(newFilters);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="content-card p-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80 mb-2">
            SUBSIDY & SCHEMES
          </p>
          <h2 className="section-heading">{t("schemes_title")}</h2>
          <p className="subheading mt-2">{t("schemes_desc")}</p>
        </div>

        <div className="content-card p-8 flex flex-wrap gap-6 items-end bg-slate-50/50 border-dashed border-slate-200 shadow-none">
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              {t("state_optional")}
            </label>
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="appearance-none w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium transition-all focus:border-green-400 focus:ring-4 focus:ring-green-100/50 outline-none"
            >
              <option value="">{t("select_state_placeholder")}</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Telangana">Telangana</option>
              <option value="Odisha">Odisha</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              {t("land_size_acres")}
            </label>
            <input
              type="number"
              name="landSize"
              value={filters.landSize}
              onChange={handleFilterChange}
              placeholder="e.g. 5"
              className="input-field"
            />
          </div>
          <button
            onClick={() => fetchSchemes()}
            className="btn-primary py-4 px-8"
          >
            {t("refine_results")}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {schemes.length > 0 ? (
              schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="content-card p-10 group hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        scheme.state === "All"
                          ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                          : "bg-green-50 text-green-600 ring-1 ring-green-100"
                      }`}
                    >
                      {scheme.state === "All"
                        ? t("central_scheme")
                        : `${scheme.state} ${t("state_scheme")}`}
                    </span>
                    <div className="h-2 w-2 rounded-full bg-green-400 group-hover:animate-ping" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-green-700 transition-colors">
                    {scheme.name}
                  </h3>

                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    {scheme.description}
                  </p>

                  <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {t("eligibility")}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {t("max_land")}: {scheme.maxLandSize} acres
                      </p>
                    </div>
                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-2 px-5 text-xs inline-flex items-center gap-2 group/btn"
                    >
                      {t("view_details")}
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 content-card p-20 text-center border-dashed border-slate-200 shadow-none">
                <p className="text-slate-400 font-bold tracking-tight">
                  {t("no_schemes_found")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubsidyTracker;
