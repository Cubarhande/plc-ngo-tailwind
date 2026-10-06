import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/register",
        formData,
      );

      // Success popup
      toast.success(
        response.data?.message ||
          "Registration successful!",
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/admin/login");
      }, 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            PLC Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create your administrator account
          </p>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              autoComplete="name"
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

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                minLength={6}
                autoComplete="new-password"
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
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
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
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* REGISTER */}

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
            {loading
              ? "Creating..."
              : "Register"}
          </button>

          {/* LOGIN */}

          <a
            href="/admin/login"
            className="
              block
              text-center
              text-sm
              text-slate-500
              transition
              hover:text-slate-900
            "
          >
            Already have an account? Login
          </a>
        </form>
      </div>
    </div>
  );
};

export default Register; 