import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")),
  );

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const userRole = user?.role ?? "buyer";

  return (
    <div className="app-shell">
      <div className="flex min-h-screen">
        <Sidebar userRole={userRole} />
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] px-6 py-8 md:px-12 lg:ml-64">
          <header className="flex flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-600/80">
                {t("today")}
              </p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {t("welcome")}
                {user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="text-sm font-medium text-slate-500">
                {userRole === "farmer"
                  ? t("farmer_workspace")
                  : t("buyer_workspace")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group">
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  defaultValue={i18n.language}
                  className="appearance-none p-3 pl-4 pr-10 border border-slate-200 rounded-2xl bg-slate-50/50 text-sm font-bold text-slate-700 transition-all hover:border-green-300 focus:ring-4 focus:ring-green-100 outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <button className="btn-outline text-sm shadow-sm">
                {t("download_report")}
              </button>
              <button className="btn-primary text-sm">
                {t("create_alert")}
              </button>
            </div>
          </header>
          <div className="mt-12">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
