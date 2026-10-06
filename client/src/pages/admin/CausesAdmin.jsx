import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, CheckCircle, AlertCircle } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  goalAmount: 0,
  raisedAmount: 0,
  buttonText: "Donate",
  buttonLink: "",
  displayOrder: 0,
  status: true,
};

const CausesAdmin = () => {
  const [causes, setCauses] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  // =========================
  // TOAST
  // =========================

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // =========================
  // DELETE MODAL
  // =========================

  const [deleteId, setDeleteId] = useState(null);

  // =========================
  // SHOW TOAST
  // =========================

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((previous) => ({
        ...previous,
        show: false,
      }));
    }, 3000);
  };

  // =========================
  // FETCH CAUSES
  // =========================

  const fetchCauses = async () => {
    try {
      const response = await API.get("/causes");

      setCauses(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load causes:", error);

      showToast(
        error.response?.data?.message || "Failed to load causes.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const reset = () => {
    setForm(initialForm);
    setImage(null);
    setEditingId(null);
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const submit = async (e) => {
    e.preventDefault();

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
        const response = await API.put(`/causes/${editingId}`, data);

        showToast(
          response.data?.message || "Cause updated successfully.",
          "success",
        );
      } else {
        const response = await API.post("/causes", data);

        showToast(
          response.data?.message || "Cause created successfully.",
          "success",
        );
      }

      setOpen(false);
      reset();

      await fetchCauses();
    } catch (error) {
      console.error("Cause save error:", error);

      showToast(
        error.response?.data?.message || "Failed to save cause.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const edit = (cause) => {
    setEditingId(cause._id);

    setForm({
      title: cause.title || "",
      description: cause.description || "",
      goalAmount: cause.goalAmount ?? 0,
      raisedAmount: cause.raisedAmount ?? 0,
      buttonText: cause.buttonText || "Donate",
      buttonLink: cause.buttonLink || "",
      displayOrder: cause.displayOrder ?? 0,
      status: cause.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const remove = async () => {
    if (!deleteId) return;

    try {
      const response = await API.delete(`/causes/${deleteId}`);

      showToast(
        response.data?.message || "Cause deleted successfully.",
        "success",
      );

      setDeleteId(null);

      await fetchCauses();
    } catch (error) {
      console.error("Delete cause error:", error);

      showToast(
        error.response?.data?.message || "Failed to delete cause.",
        "error",
      );
    }
  };

  return (
    <div className="relative">
      {/* =========================
          TOAST
      ========================= */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-green-200 bg-white"
                : "border-red-200 bg-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-green-500"
              />
            ) : (
              <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-500" />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                setToast((previous) => ({
                  ...previous,
                  show: false,
                }))
              }
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
          <h1 className="text-2xl font-bold text-slate-900">Causes</h1>

          <p className="mt-1 text-sm text-slate-500">Manage donation causes.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Add Cause
        </button>
      </div>

      {/* =========================
          CAUSES GRID
      ========================= */}

      {causes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {causes.map((cause) => (
            <div
              key={cause._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* IMAGE */}

              {cause.image ? (
                <img
                  src={`${IMAGE_URL}${cause.image}`}
                  alt={cause.title || "Cause"}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-slate-100">
                  <span className="text-sm text-slate-400">No Image</span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">
                    {cause.title}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cause.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cause.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                  {cause.description || "No description available."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Goal</p>

                    <p className="mt-1 font-semibold text-slate-900">
                      ₹{Number(cause.goalAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Raised</p>

                    <p className="mt-1 font-semibold text-slate-900">
                      ₹{Number(cause.raisedAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => edit(cause)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteId(cause._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-slate-500">No causes found.</p>
        </div>
      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <Modal
        open={open}
        title={editingId ? "Edit Cause" : "Add Cause"}
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >
        <form onSubmit={submit} className="space-y-5">
          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Cause title"
              value={form.title}
              onChange={handleChange}
              required
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
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* AMOUNTS */}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Goal Amount
              </label>

              <input
                type="number"
                name="goalAmount"
                min="0"
                value={form.goalAmount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Raised Amount
              </label>

              <input
                type="number"
                name="raisedAmount"
                min="0"
                value={form.raisedAmount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cause Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm"
            />

            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG or WebP image.
            </p>
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
                placeholder="Donate"
                value={form.buttonText}
                onChange={handleChange}
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
                placeholder="/donate"
                value={form.buttonLink}
                onChange={handleChange}
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
              min="0"
              value={form.displayOrder}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
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

            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>

          {/* SAVE */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Cause" : "Save Cause"}
          </button>
        </form>
      </Modal>

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      {deleteId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Delete Cause?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this cause? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={remove}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CausesAdmin;
