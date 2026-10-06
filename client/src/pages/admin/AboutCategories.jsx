import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import API from "../../services/api";
const IMAGE_URL = (
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000"
).replace(/\/$/, "");
const AboutCategories = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // ========================= // TOAST // =========================
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };
  // ========================= // FORM // =========================
  const [form, setForm] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    status: true,
    bgimage: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);
  // ========================= // FETCH CATEGORIES // =========================
  const fetchCategories = async () => {
    try {
      const response = await API.get("/about-categories/");
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load About categories:", error);
      showToast(
        error.response?.data?.message || "Failed to load About categories.",
        "error",
      );
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  // ========================= // RESET FORM // =========================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      displayOrder: 0,
      status: true,
      bgimage: null,
    });

    setImagePreview("");
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      showToast("Only JPG, JPEG, PNG and WEBP images are allowed.", "error");

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB.", "error");

      e.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      bgimage: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };
  // ========================= // HANDLE CHANGE // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // // ========================= // SUBMIT // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast("Category name is required.", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);

      formData.append("description", form.description);

      formData.append("displayOrder", form.displayOrder);

      formData.append("status", form.status);

      // Only append when a new file was selected
      if (form.bgimage instanceof File) {
        formData.append("bgimage", form.bgimage);
      }

      if (editingId) {
        await API.put(`/about-categories/${editingId}`, formData);

        showToast("About category updated successfully.");
      } else {
        await API.post("/about-categories", formData);

        showToast("About category created successfully.");
      }

      setOpen(false);
      resetForm();

      await fetchCategories();
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message || "Operation failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  // ========================= // EDIT // =========================
  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      displayOrder: category.displayOrder ?? 0,
      status: category.status ?? true,
      bgimage: null,
    });

    setImagePreview(category.bgimage ? `${IMAGE_URL}${category.bgimage}` : "");

    setOpen(true);
  };
  // ========================= // DELETE // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this About category?");
    if (!confirmDelete) return;
    try {
      await API.delete(`/about-categories/${id}`);
      showToast("About category deleted successfully.");
      await fetchCategories();
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Delete failed. Please try again.",
        "error",
      );
    }
  };
  return (
    <div className="relative min-h-full">
      {/* ========================= TOAST ========================= */}
      {toast.show && (
        <div className=" fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300 ">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl ${toast.type === "success" ? "border-green-200 bg-white" : "border-red-200 bg-white"}`}
          >
            {/* ICON */}
            {toast.type === "success" ? (
              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-green-600"
              />
            ) : (
              <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />
            )}
            {/* MESSAGE */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${toast.type === "success" ? "text-green-700" : "text-red-700"}`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
            </div>
            {/* CLOSE */}
            <button
              type="button"
              onClick={() =>
                setToast({ show: false, type: "success", message: "" })
              }
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            About Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage categories for About cards.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>
      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">ID</th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Category
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Description
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
  Background
</th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Order
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
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="max-w-sm px-5 py-4 text-slate-500">
                      <p className="line-clamp-2">
                        {category.description || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
  {category.bgimage ? (
    <img
      src={`${IMAGE_URL}${category.bgimage}`}
      alt={category.name}
      className="h-14 w-24 rounded-lg object-cover"
    />
  ) : (
    <span className="text-xs text-slate-400">
      No image
    </span>
  )}
</td>
                    <td className="px-5 py-4 text-slate-600">
                      {category.displayOrder}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${category.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category._id)}
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
                    No About categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit About Category" : "Add About Category"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create a category for About cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Our Mission"
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
                  rows="4"
                  placeholder="Enter category description"
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
              {/* BACKGROUND IMAGE */}

<div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Background Image
  </label>

  <input
    ref={fileInputRef}
    type="file"
    name="bgimage"
    accept="image/jpeg,image/jpg,image/png,image/webp"
    onChange={handleImageChange}
    className="
      w-full
      rounded-lg
      border
      border-slate-300
      bg-white
      px-4
      py-3
      text-sm
      outline-none
      transition
      focus:border-slate-900
    "
  />

  <p className="mt-1 text-xs text-slate-500">
    JPG, JPEG, PNG or WEBP. Maximum 5MB.
  </p>

  {imagePreview && (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
      <img
        src={imagePreview}
        alt="Background preview"
        className="h-40 w-full object-cover"  loading="lazy"
      />
    </div>
  )}
</div>
              {/* ORDER */}
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
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
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
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AboutCategories;
