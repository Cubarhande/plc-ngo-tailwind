import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../services/api";

const Profile = () => {
  const admin = JSON.parse(
    localStorage.getItem("admin") || "null",
  );

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (
      form.password.trim() &&
      form.password.trim().length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      // Don't send empty password
      const data = {
        name: form.name.trim(),
        email: form.email.trim(),
      };

      if (form.password.trim()) {
        data.password = form.password.trim();
      }

      const response = await API.put(
        "/auth/profile",
        data,
      );

      /* =================================================
         UPDATE LOCAL STORAGE
      ================================================= */

      const updatedAdmin =
        response.data?.admin || {
          ...admin,
          name: form.name.trim(),
          email: form.email.trim(),
        };

      localStorage.setItem(
        "admin",
        JSON.stringify(updatedAdmin),
      );

      /* =================================================
         CLEAR PASSWORD
      ================================================= */

      setForm((prev) => ({
        ...prev,
        name: updatedAdmin.name || prev.name,
        email: updatedAdmin.email || prev.email,
        password: "",
      }));

      setShowPassword(false);

      /* =================================================
         SUCCESS TOAST
      ================================================= */

      toast.success(
        response.data?.message ||
          "Profile updated successfully!",
      );

      /*
       * Refresh after toast is displayed so the
       * Topbar gets the latest admin information.
       */
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(
        "Profile update error:",
        err,
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your administrator profile.
        </p>
      </div>

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">

        {/* PROFILE HEADER */}

        <div className="mb-8 flex items-center gap-4 border-b pb-6">
          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-900
              text-xl
              font-bold
              text-white
            "
          >
            {form.name?.charAt(0)?.toUpperCase() ||
              "A"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {form.name || "Admin"}
            </h2>

            <p className="truncate text-sm text-slate-500">
              {form.email || "Administrator"}
            </p>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  py-3
                  pl-10
                  pr-4
                  text-slate-900
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-1
                  focus:ring-slate-900
                "
                placeholder="Admin Name"
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  py-3
                  pl-10
                  pr-4
                  text-slate-900
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-1
                  focus:ring-slate-900
                "
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                strokeWidth={2}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                autoComplete="new-password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  py-3
                  pl-10
                  pr-12
                  text-slate-900
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-1
                  focus:ring-slate-900
                "
                placeholder="Leave blank to keep current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-400
                  transition
                  hover:text-slate-900
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Leave blank if you don't want to change
              your password.
            </p>
          </div>

          {/* =================================================
              BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-slate-900
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Save size={17} />

            {loading
              ? "Updating..."
              : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 