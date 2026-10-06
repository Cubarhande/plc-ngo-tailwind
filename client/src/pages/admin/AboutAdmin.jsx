import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  status: true,
};

const AboutAdmin = () => {
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // TOAST MESSAGE
  // =========================

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const closeToast = () => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  };

  // =========================
  // FETCH ABOUT
  // =========================

  const fetchAbout = async () => {
    try {
      const response = await API.get("/about");

      const data = response.data?.data;

      if (data) {
        setAbout(data);

        setForm({
          title: data.title || "",
          description: data.description || "",
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
          status: data.status ?? true,
        });
      }
    } catch (error) {
      console.error("Failed to load About:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to load About content.",
      );
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("buttonText", form.buttonText);
      data.append("buttonLink", form.buttonLink);
      data.append("status", form.status);

      if (image) {
        data.append("image", image);
      }

      if (about?._id) {
        await API.put(`/about/${about._id}`, data);

        showToast("success", "About section updated successfully.");
      } else {
        await API.post("/about", data);

        showToast("success", "About section created successfully.");
      }

      setImage(null);

      await fetchAbout();
    } catch (error) {
      console.error("Failed to save About:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to save About section.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // IMAGE PREVIEW
  // =========================

  const previewImage = image
    ? URL.createObjectURL(image)
    : about?.image
      ? `${IMAGE_URL}${about.image}`
      : null;

  return (
    <div className="relative">
      {/* =========================
          TOAST POPUP
      ========================= */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-40px)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl ${
              toast.type === "success" ? "border-green-200" : "border-red-200"
            }`}
          >
            {/* ICON */}

            {toast.type === "success" ? (
              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-green-600"
              />
            ) : (
              <XCircle size={22} className="mt-0.5 shrink-0 text-red-600" />
            )}

            {/* MESSAGE */}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-600">
                {toast.message}
              </p>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeToast}
              className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close notification"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">About Section</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your organisation's About content.
        </p>
      </div>

      {/* =========================
          FORM
      ========================= */}

      <div className="w-full rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter About title"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              placeholder="Enter About description"
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* BUTTON */}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Read More"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Button Link
              </label>

              <input
                type="text"
                name="buttonLink"
                value={form.buttonLink}
                onChange={handleChange}
                placeholder="/about"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>
          </div>

          {/* IMAGE */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                About Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-slate-200 p-3"
              />

              <p className="mt-2 text-xs text-slate-400">
                Upload JPG, PNG or WebP image.
              </p>
            </div>

            {/* PREVIEW */}

            <div>
              {previewImage ? (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Image Preview
                  </p>

                  <img
                    src={previewImage}
                    alt="About preview"
                    loading="lazy"
                    className="h-48 rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                  <p className="text-sm text-slate-400">No image selected</p>
                </div>
              )}
            </div>
          </div>

          {/* STATUS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>

          {/* SAVE */}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : about ? "Update About" : "Save About"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutAdmin;
