import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const highlights = [
  {
    title: "Farm-to-Table",
    description:
      "Digitally manage your farm portfolio, pricing, and buyer relationships in one place.",
    icon: "🌱",
  },
  {
    title: "Predictive Demand",
    description:
      "Discover what buyers are searching for with near real-time demand signals.",
    icon: "📈",
  },
  {
    title: "Trusted Network",
    description:
      "Verified farmers and buyers with transparent logistics and payment workflows.",
    icon: "🤝",
  },
];

const stats = [
  { value: "4.8/5", label: "Average buyer rating" },
  { value: "12k+", label: "Monthly transactions" },
  { value: "92%", label: "Repeat partners" },
];

function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#022c22] text-white selection:bg-green-500 selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-24 md:py-32">
        <header className="grid gap-16 lg:grid-cols-[1.4fr,1fr] lg:items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t("agri_intelligence")}
            </div>

            <h1 className="hero-title leading-tight md:max-w-3xl">
              {t("hero_title")}
            </h1>

            <p className="hero-description max-w-2xl text-white/70">
              {t("hero_desc")}
            </p>

            <div className="flex flex-col gap-6 sm:flex-row pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-emerald-500/40 transition-all hover:bg-emerald-400 hover:-translate-y-1 active:scale-95"
              >
                {t("get_started")}
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white/20 px-10 py-5 text-lg font-black text-white transition-all hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 active:scale-95"
              >
                {t("login_workspace")}
              </Link>
            </div>

            <div className="grid gap-10 pt-10 border-t border-white/10 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-4xl font-black tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-50 transition-opacity duration-700" />
            <div className="relative rounded-[3rem] p-10 border border-white/10 shadow-2xl bg-white/[0.03] backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  {t("live_market_pulse")}
                </p>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter text-white">
                  ₹42.30
                </p>
                <p className="text-sm font-bold text-white/40 italic">/ kg</p>
              </div>
              <p className="mt-2 text-sm font-bold text-white/60 tracking-tight">
                {t("avg_price_label")}
              </p>

              <div className="mt-10 space-y-4">
                {["Tomatoes", "Leafy greens", "Turmeric roots"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl bg-white/5 p-5 border border-white/10 transition-all hover:bg-white/10 hover:translate-x-1"
                    >
                      <div>
                        <p className="text-sm font-black text-white">{item}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
                          Demand spike{" "}
                          <span className="text-emerald-400">
                            {index === 0
                              ? "↑ 8%"
                              : index === 1
                                ? "↑ 5%"
                                : "↑ 3%"}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${index === 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-white/50 border-white/10"}`}
                      >
                        {index === 0 ? "High" : "Medium"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-32 space-y-16">
          <div className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">
              {t("why_teams_switch")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              {t("built_for_growth")}
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="feature-card group">
                <span className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 border border-white/10 text-3xl group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-white/60 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
