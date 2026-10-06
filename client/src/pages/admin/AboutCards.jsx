import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  category: "",
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  displayOrder: 0,
  backgroundColor: "#ffffff",
  status: true,
};

const AboutCards = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // TOAST
  // =====================================================

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
      setToast({
        show: false,
        type: "success",
        message: "",
      });
    }, 3500);
  };

  const closeToast = () => {
    setToast({
      show: false,
      type: "success",
      message: "",
    });
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    try {
      const [categoryResponse, cardResponse] = await Promise.all([
        API.get("/about-categories/"),
        API.get("/about-cards/"),
      ]);

      setCategories(categoryResponse.data?.data || []);
      setCards(cardResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to load About cards:", error);

      showToast(
        error.response?.data?.message || "Failed to load About cards.",
        "error",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setEditingId(null);
  };

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation

    if (!form.category) {
      showToast("Please select a category.", "warning");
      return;
    }

    if (!form.title.trim()) {
      showToast("Card title is required.", "warning");
      return;
    }

    setLoading(true);

    const data = new FormData();

    data.append("category", form.category);
    data.append("title", form.title.trim());
    data.append("description", form.description);
    data.append("buttonText", form.buttonText);
    data.append("buttonLink", form.buttonLink);
    data.append("displayOrder", form.displayOrder);
    data.append("backgroundColor", form.backgroundColor);
    data.append("status", form.status);

    if (image) {
      data.append("image", image);
    }

    try {
      if (editingId) {
        await API.put(`/about-cards/${editingId}`, data);

        showToast("About card updated successfully.", "success");
      } else {
        await API.post("/about-cards", data);

        showToast("About card created successfully.", "success");
      }

      setOpen(false);
      resetForm();

      await loadData();
    } catch (error) {
      console.error("About card save error:", error);

      showToast(
        error.response?.data?.message || "Failed to save About card.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (card) => {
    setEditingId(card._id);

    setForm({
      category: card.category?._id || card.category || "",
      title: card.title || "",
      description: card.description || "",
      buttonText: card.buttonText || "",
      buttonLink: card.buttonLink || "",
      displayOrder: card.displayOrder ?? 0,
      backgroundColor: card.backgroundColor || "#ffffff",
      status: card.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this About card?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/about-cards/${id}`);

      showToast("About card deleted successfully.", "success");

      await loadData();
    } catch (error) {
      console.error("Delete error:", error);

      showToast(
        error.response?.data?.message || "Failed to delete About card.",
        "error",
      );
    }
  };

  // =====================================================
  // TOAST UI
  // =====================================================

  const renderToastIcon = () => {
    if (toast.type === "error") {
      return <AlertCircle size={21} />;
    }

    if (toast.type === "warning") {
      return <Info size={21} />;
    }

    return <CheckCircle size={21} />;
  };

  const toastStyles = {
    success: "border-green-200 bg-white text-green-700 shadow-xl",
    error: "border-red-200 bg-white text-red-700 shadow-xl",
    warning: "border-yellow-200 bg-white text-yellow-700 shadow-xl",
  };

  return (
    <div className="relative">
      {/* =====================================================
          TOAST POPUP
      ===================================================== */}

      {toast.show && (
        <div
          className={`
            fixed
            right-4
            top-4
            z-[100]
            flex
            w-[calc(100%-2rem)]
            max-w-sm
            items-start
            gap-3
            rounded-xl
            border
            px-4
            py-4
            transition-all
            duration-300
            sm:right-6
            sm:top-6
            ${toastStyles[toast.type]}
          `}
          role="alert"
        >
          <div className="mt-0.5 shrink-0">{renderToastIcon()}</div>

          <p className="flex-1 text-sm font-medium leading-6">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={closeToast}
            className="shrink-0 rounded-md p-1 opacity-60 transition hover:bg-slate-100 hover:opacity-100"
            aria-label="Close notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">About Cards</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage cards under About categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-slate-900
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-slate-700
          "
        >
          <Plus size={18} />
          Add About Card
        </button>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cards.length > 0 ? (
                cards.map((card, index) => (
                  <tr
                    key={card._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    {/* ID */}

                    <td className="px-5 py-4">{index + 1}</td>

                    {/* IMAGE */}

                    <td className="px-5 py-4">
                      {card.image ? (
                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={card.title}
                          loading="lazy"
                          className="h-14 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {card.category?.name || "No Category"}
                      </span>
                    </td>

                    {/* TITLE */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {card.title}
                      </p>

                      {card.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {card.description}
                        </p>
                      )}
                    </td>

                    {/* ORDER */}

                    <td className="px-5 py-4 text-slate-600">
                      {card.displayOrder}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            card.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {card.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(card)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(card._id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No About cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit About Card" : "Add About Card"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add content to an About category.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  About Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    Create an About category first.
                  </p>
                )}
              </div>

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
                  placeholder="Enter card title"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                  rows="5"
                  placeholder="Enter card description"
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-slate-300 p-3"
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
                    placeholder="Learn More"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  />
                </div>
              </div>

              {/* ORDER + COLOR */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="displayOrder"
                    min="0"
                    value={form.displayOrder}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Background Color
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.backgroundColor}
                      onChange={(e) =>
                        setForm((previous) => ({
                          ...previous,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="h-12 w-14 cursor-pointer rounded border"
                    />

                    <input
                      type="text"
                      name="backgroundColor"
                      value={form.backgroundColor}
                      onChange={handleChange}
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    />
                  </div>
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

                <span className="text-sm font-medium text-slate-700">
                  Active
                </span>
              </label>

              {/* BUTTONS */}

              <div className="flex gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Card"
                      : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutCards;
