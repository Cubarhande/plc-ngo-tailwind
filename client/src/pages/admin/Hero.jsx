import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, CheckCircle, XCircle, X } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";
import FormInput from "../../components/admin/FormInput";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  heading: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  status: true,
};

const Hero = () => {
  const [heroes, setHeroes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [form, setForm] = useState(initialForm);

  // =========================
  // TOAST
  // =========================

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  // =========================
  // FETCH HEROES
  // =========================

  const fetchHeroes = async () => {
    try {
      const response = await API.get("/hero");

      setHeroes(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load heroes:", error);

      showToast(
        error.response?.data?.message || "Failed to load hero content.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setEditingId(null);
  };

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
      const formData = new FormData();

      formData.append("heading", form.heading);
      formData.append("description", form.description);
      formData.append("buttonText", form.buttonText);
      formData.append("buttonLink", form.buttonLink);
      formData.append("status", form.status);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (editingId) {
        response = await API.put(`/hero/${editingId}`, formData);
      } else {
        response = await API.post("/hero", formData);
      }

      showToast(
        response.data?.message ||
          (editingId
            ? "Hero updated successfully."
            : "Hero created successfully."),
        "success",
      );

      setOpen(false);
      resetForm();

      await fetchHeroes();
    } catch (error) {
      console.error("Hero save error:", error);

      showToast(
        error.response?.data?.message || "Failed to save hero.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (hero) => {
    setEditingId(hero._id);

    setForm({
      heading: hero.heading || "",
      description: hero.description || "",
      buttonText: hero.buttonText || "",
      buttonLink: hero.buttonLink || "",
      status: hero.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero?",
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(id);

    try {
      const response = await API.delete(`/hero/${id}`);

      showToast(
        response.data?.message || "Hero deleted successfully.",
        "success",
      );

      await fetchHeroes();
    } catch (error) {
      console.error("Hero delete error:", error);

      showToast(
        error.response?.data?.message || "Failed to delete hero.",
        "error",
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (loading) {
      return;
    }

    setOpen(false);
    resetForm();
  };

  return (
    <div className="relative">
      {/* =========================
          TOAST
      ========================= */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${
              toast.type === "success" ? "border-green-200" : "border-red-200"
            }`}
          >
            <div
              className={`mt-0.5 shrink-0 ${
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={21} />
              ) : (
                <XCircle size={21} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={closeToast}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Section</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage homepage hero content.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Hero
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">ID</th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Image
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Heading
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {heroes.length > 0 ? (
                heroes.map((hero, index) => (
                  <tr
                    key={hero._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      {hero.image ? (
                        <img
                          src={`${IMAGE_URL}${hero.image}`}
                          alt={hero.heading || "Hero"}
                          loading="lazy"
                          className="h-14 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate font-medium text-slate-900">
                        {hero.heading || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          hero.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {hero.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(hero)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(hero._id)}
                          disabled={deleteLoading === hero._id}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No hero content found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          MODAL
      ========================= */}

      <Modal
        open={open}
        title={editingId ? "Edit Hero" : "Add Hero"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* HEADING */}

          <FormInput
            label="Heading"
            name="heading"
            required
            value={form.heading}
            onChange={handleChange}
            placeholder="Enter heading"
          />

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter hero description"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* BUTTON TEXT */}

          <FormInput
            label="Button Text"
            name="buttonText"
            value={form.buttonText}
            onChange={handleChange}
            placeholder="Enter button text"
          />

          {/* BUTTON LINK */}

          <FormInput
            label="Button Link"
            name="buttonLink"
            value={form.buttonLink}
            onChange={handleChange}
            placeholder="Enter button link"
          />

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-slate-400">
              Upload JPG, PNG or WebP image.
            </p>
          </div>

          {/* STATUS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />

            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </span>
            ) : editingId ? (
              "Update Hero"
            ) : (
              "Create Hero"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Hero;
