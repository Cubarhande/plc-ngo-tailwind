import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  name: "",
  website: "",
  displayOrder: 0,
  status: true,
};

const PartnersAdmin = () => {
  const [partners, setPartners] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [logo, setLogo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [form, setForm] = useState(initialForm);

  // =========================
  // TOAST
  // =========================

  const showToast = (type, message) => {
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
    }, 3000);
  };

  // =========================
  // FETCH PARTNERS
  // =========================

  const fetchPartners = async () => {
    try {
      const response = await API.get("/partners");

      setPartners(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load partners:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to load partners.",
      );
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // =========================
  // RESET
  // =========================

  const resetForm = () => {
    setForm(initialForm);
    setLogo(null);
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

    if (!form.name.trim()) {
      showToast("error", "Partner name is required.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("website", form.website);
      data.append("displayOrder", form.displayOrder);
      data.append("status", form.status);

      if (logo) {
        data.append("logo", logo);
      }

      if (editingId) {
        await API.put(`/partners/${editingId}`, data);

        showToast("success", "Partner updated successfully.");
      } else {
        await API.post("/partners", data);

        showToast("success", "Partner created successfully.");
      }

      setOpen(false);

      resetForm();

      await fetchPartners();
    } catch (error) {
      console.error("Partner save error:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to save partner.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (partner) => {
    setEditingId(partner._id);

    setForm({
      name: partner.name || "",
      website: partner.website || "",
      displayOrder: partner.displayOrder ?? 0,
      status: partner.status ?? true,
    });

    setLogo(null);

    setOpen(true);
  };

  // =========================
  // DELETE CONFIRMATION
  // =========================

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    setDeleteLoading(true);

    try {
      await API.delete(`/partners/${deleteId}`);

      setDeleteId(null);

      showToast("success", "Partner deleted successfully.");

      await fetchPartners();
    } catch (error) {
      console.error("Delete partner error:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to delete partner.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* =========================
          TOAST
      ========================= */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm">
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
                <CheckCircle size={22} />
              ) : (
                <AlertCircle size={22} />
              )}
            </div>

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
                setToast((prev) => ({
                  ...prev,
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
          <h1 className="text-2xl font-bold text-slate-900">Partners</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage organisation partners.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Partner
        </button>
      </div>

      {/* =========================
          PARTNERS
      ========================= */}

      {partners.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">No partners found.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* LOGO */}

              {partner.logo ? (
                <div className="flex h-24 items-center justify-center rounded-lg bg-slate-50">
                  <img
                    src={`${IMAGE_URL}${partner.logo}`}
                    alt={partner.name}
                    loading="lazy"
                    className="h-20 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-lg bg-slate-100">
                  <span className="text-xs text-slate-400">No Logo</span>
                </div>
              )}

              {/* NAME */}

              <h3 className="mt-4 truncate font-semibold text-slate-900">
                {partner.name}
              </h3>

              {/* STATUS */}

              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    partner.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {partner.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* ORDER */}

              <p className="mt-2 text-xs text-slate-400">
                Display Order: {partner.displayOrder ?? 0}
              </p>

              {/* ACTIONS */}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(partner)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(partner._id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <Modal
        open={open}
        title={editingId ? "Edit Partner" : "Add Partner"}
        onClose={() => {
          if (loading) return;

          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Partner Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Partner Name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* WEBSITE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
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
              min="0"
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* LOGO */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Partner Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-slate-400">
              JPG, PNG or WebP image.
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

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}

            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Partner"
                : "Create Partner"}
          </button>
        </form>
      </Modal>

      {/* =========================
          DELETE MODAL
      ========================= */}

      <Modal
        open={Boolean(deleteId)}
        title="Delete Partner"
        onClose={() => {
          if (!deleteLoading) {
            setDeleteId(null);
          }
        }}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <p className="font-medium text-red-800">Are you sure?</p>

              <p className="mt-1 text-sm text-red-600">
                This partner will be permanently deleted. This action cannot be
                undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={deleteLoading}
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleteLoading}
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteLoading && <Loader2 size={18} className="animate-spin" />}

              {deleteLoading ? "Deleting..." : "Delete Partner"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PartnersAdmin;
