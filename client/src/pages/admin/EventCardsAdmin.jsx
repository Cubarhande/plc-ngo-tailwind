 
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";
import Toast from "../../components/admin/Toast";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  displayOrder: 0,
  backgroundColor: "#ffffff",
  status: true,
};

const EventCardsAdmin = () => {
  const [cards, setCards] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [toast, setToast] = useState(null);

  /* =====================================================
     TOAST
  ===================================================== */

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  /* =====================================================
     FETCH CARDS
  ===================================================== */

  const fetchCards = async () => {
    try {
      const response = await API.get("/event-cards");

      const data = response.data?.data || [];

      const sortedCards = [...data].sort(
        (a, b) =>
          Number(a.displayOrder || 0) -
          Number(b.displayOrder || 0),
      );

      setCards(sortedCards);
    } catch (error) {
      console.error("Failed to load event cards:", error);

      showToast(
        "error",
        error.response?.data?.message ||
          "Failed to load event cards.",
      );
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setForm({
      ...initialForm,
    });

    setImage(null);
    setEditingId(null);
  };

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const handleAdd = () => {
    resetForm();
    setOpen(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    if (loading) return;

    setOpen(false);
    resetForm();
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast(
        "warning",
        "Event card title is required.",
      );
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        const response = await API.put(
          `/event-cards/${editingId}`,
          data,
        );

        showToast(
          "success",
          response.data?.message ||
            "Event card updated successfully.",
        );
      } else {
        const response = await API.post(
          "/event-cards",
          data,
        );

        showToast(
          "success",
          response.data?.message ||
            "Event card created successfully.",
        );
      }

      setOpen(false);
      resetForm();

      await fetchCards();
    } catch (error) {
      console.error("Event card save error:", error);

      showToast(
        "error",
        error.response?.data?.message ||
          "Failed to save event card.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (card) => {
    setEditingId(card._id);

    setForm({
      title: card.title || "",
      description: card.description || "",
      buttonText: card.buttonText || "",
      buttonLink: card.buttonLink || "",
      displayOrder: card.displayOrder ?? 0,
      backgroundColor:
        card.backgroundColor || "#ffffff",
      status: card.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event card?",
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await API.delete(
        `/event-cards/${id}`,
      );

      showToast(
        "success",
        response.data?.message ||
          "Event card deleted successfully.",
      );

      await fetchCards();
    } catch (error) {
      console.error(
        "Delete event card error:",
        error,
      );

      showToast(
        "error",
        error.response?.data?.message ||
          "Failed to delete event card.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* =====================================================
          TOAST
      ===================================================== */}

      <Toast
        toast={toast}
        onClose={closeToast}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Event Cards
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage reusable event cards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Event Card
        </button>
      </div>

      {/* =====================================================
          CARDS
      ===================================================== */}

      {cards.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            No event cards found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card._id}
              className="overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md"
              style={{
                backgroundColor:
                  card.backgroundColor || "#ffffff",
              }}
            >
              {/* IMAGE */}

              {card.image ? (
                <img
                  src={`${IMAGE_URL}${card.image}`}
                  alt={card.title || "Event card"}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-slate-100 text-sm text-slate-400">
                  No image
                </div>
              )}

              {/* CONTENT */}

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                    {card.title}
                  </h2>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      card.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {card.status
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                  {card.description ||
                    "No description available."}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Order: {card.displayOrder || 0}
                  </span>

                  {card.buttonText && (
                    <span className="truncate">
                      Button: {card.buttonText}
                    </span>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(card)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(card._id)
                    }
                    disabled={
                      deletingId === card._id
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deletingId === card._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          MODAL
      ===================================================== */}

      <Modal
        open={open}
        title={
          editingId
            ? "Edit Event Card"
            : "Add Event Card"
        }
        onClose={handleCloseModal}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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
              required
              placeholder="Card title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
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
              rows={4}
              placeholder="Card description"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] || null,
                )
              }
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-3 text-sm"
            />

            {image && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: {image.name}
              </p>
            )}

            {editingId && !image && (
              <p className="mt-2 text-xs text-slate-400">
                Leave empty to keep the current image.
              </p>
            )}
          </div>

          {/* BUTTON */}

          <div className="grid gap-4 md:grid-cols-2">
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
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
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
                placeholder="/contact"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* DISPLAY ORDER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Display Order
            </label>

            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* BACKGROUND COLOR */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Background Color
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={
                  form.backgroundColor ||
                  "#ffffff"
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    backgroundColor:
                      e.target.value,
                  }))
                }
                className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                type="text"
                name="backgroundColor"
                value={form.backgroundColor}
                onChange={handleChange}
                placeholder="#ffffff"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-slate-900"
              />
            </div>

            <div
              className="mt-3 h-12 rounded-lg border border-slate-200"
              style={{
                backgroundColor:
                  form.backgroundColor ||
                  "#ffffff",
              }}
            />
          </div>

          {/* STATUS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4 rounded"
            />

            <span className="text-sm font-medium text-slate-700">
              Active
            </span>
          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Event Card"
                : "Create Event Card"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EventCardsAdmin;
 
