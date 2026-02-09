import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../utils/auth";

function Sidebar({ userRole }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const farmerLinks = [
    { label: t("dashboard"), path: "/farmer-dashboard", icon: "📊" },
    { label: t("add_product"), path: "/add-product", icon: "➕" },
    { label: t("mandi_prices"), path: "/mandi-prices", icon: "📈" },
    { label: t("msp_calculator"), path: "/msp-tool", icon: "⚖️" },
    { label: t("govt_schemes"), path: "/schemes", icon: "🏛️" },
    { label: t("profile"), path: "/profile", icon: "👤" },
  ];

  const buyerLinks = [
    { label: t("marketplace"), path: "/buyer-marketplace", icon: "🛒" },
    { label: t("my_requests"), path: "/my-inquiries", icon: "📋" },
    { label: t("mandi_prices"), path: "/mandi-prices", icon: "📈" },
    { label: t("msp_calculator"), path: "/msp-tool", icon: "⚖️" },
    { label: t("profile"), path: "/profile", icon: "👤" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const links = userRole === "farmer" ? farmerLinks : buyerLinks;
  const panelTitle =
    userRole === "farmer" ? t("farmer_workspace") : t("buyer_workspace");

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col border-r border-slate-200 bg-white/80 backdrop-blur-xl">
        {/* Logo Area */}
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <span className="font-bold">A</span>
          </div>
          <span className="ml-3 text-lg font-bold text-slate-800">
            AgriMarket
          </span>
        </div>

        <nav className="flex-1 space-y-2 p-6">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`sidebar-link w-full ${isActive(link.path) ? "active" : ""}`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold mb-2">{t("need_help")}</p>
            <p className="text-slate-500 text-xs">{t("contact_support")}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <span>🚪</span>
            {t("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
