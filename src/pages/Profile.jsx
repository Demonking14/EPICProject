import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import api from "../utils/api";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Male",
    address: "",
    role: "",
    rating: 0,
    ratingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api("/api/auth/me");
      setUser({
        ...data.user,
        phone: data.user.phone || "",
        age: data.user.age || "",
        gender: data.user.gender || "Male",
        address: data.user.address || "",
      });
    } catch (err) {
      if (err.message.includes("401")) navigate("/login");
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await api("/api/auth/profile", {
        method: "PUT",
        body: {
          name: user.name,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
        },
      });
      setSuccess(t("profile_updated"));
      setUser({ ...user, ...data.user });
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600"></div>
      </div>
    );

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="content-card p-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-8">
              <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center text-5xl shadow-sm text-green-700 font-black">
                {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="stat-pill capitalize px-4 py-1.5">
                    {user.role}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full ring-1 ring-amber-100">
                    <span>★</span>
                    <span>{user.rating}</span>
                    <span className="text-slate-400 font-medium">
                      ({user.ratingCount} {t("reviews")})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`p-6 rounded-[2rem] font-bold text-sm tracking-tight ${
              error
                ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                : "bg-green-50 text-green-600 ring-1 ring-green-100"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="content-card p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("full_name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("email_readonly")}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field bg-slate-100/50 cursor-not-allowed border-dashed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("phone_number")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("age")}
                </label>
                <input
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {t("gender")}
                </label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setUser({ ...user, gender: g })}
                      className={`flex-1 p-4 rounded-2xl text-sm font-bold transition-all ${
                        user.gender === g
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                          : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-green-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t("address")}
              </label>
              <textarea
                name="address"
                value={user.address}
                onChange={handleChange}
                className="input-field min-h-[120px] resize-none"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full py-5 text-lg">
              {t("update_profile")}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
