import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../services/api";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";
const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", form);

      // Save authentication data
      localStorage.setItem("token", response.data.token);

      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      // Success popup
      toast.success("Login successful!");

      // Small delay so user can see toast
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get("/settings");

        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center">
          {settings?.logo ? (
            <Link
              to="/"
              className="mb-4 flex justify-center"
              aria-label={`Go to ${settings?.siteName || "PLC Organisation"} home`}
            >
              <img
                src={`${IMAGE_URL}${settings.logo}`}
                alt={settings?.siteName || "PLC Organisation"}
                width={180}
                height={64}
                loading="eager"
                decoding="async"
                className="block h-20 w-auto max-w-[180px] object-contain"
              />
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-block text-xl font-bold text-slate-900 dark:text-white"
            >
              {settings?.siteName || "PLC Organisation"}
            </Link>
          )}

          {/* <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
    Login to manage website content
  </p> */}
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-3
                text-slate-900
                outline-none
                transition
                focus:border-slate-900
                focus:ring-2
                focus:ring-slate-900/10
              "
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-4
                  py-3
                  pr-12
                  text-slate-900
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-2
                  focus:ring-slate-900/10
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                  transition
                  hover:text-slate-900
                "
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-slate-900
              py-3
              font-semibold
              text-white
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* REGISTER */}

          <a
            href="/admin/register"
            className="
              block
              text-center
              text-sm
              text-slate-500
              transition
              hover:text-slate-900
            "
          >
            Don't have an account? Register
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
