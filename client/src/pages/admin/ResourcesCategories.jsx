import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  bgimage: null,
  displayOrder: 0,
  status: true,
};

const ResourcesCategories = () => {
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState("");

  // =========================
  // FETCH
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await API.get("/resource-categories/");

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to load Resources categories:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load Resources categories."
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // RESET
  // =========================

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setImagePreview("");
  };

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // New local preview
    if (image.startsWith("blob:")) {
      return image;
    }

    // Full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Get API base URL
    const baseURL = API.defaults?.baseURL || "";

    // Remove /api from the end
    const serverURL = baseURL.replace(/\/api\/?$/, "");

    if (image.startsWith("/")) {
      return `${serverURL}${image}`;
    }

    return `${serverURL}/${image}`;
  };

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    // =========================
    // FILE
    // =========================

    if (type === "file") {
      const file = files?.[0];

      if (!file) {
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        );

        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          "Image size must be less than 5MB."
        );

        e.target.value = "";
        return;
      }

      setForm((previous) => ({
        ...previous,
        bgimage: file,
      }));

      // Preview selected image
      const previewUrl = URL.createObjectURL(file);

      setImagePreview(previewUrl);

      return;
    }

    // =========================
    // CHECKBOX
    // =========================

    if (type === "checkbox") {
      setForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    // =========================
    // NORMAL INPUT
    // =========================

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // REMOVE SELECTED IMAGE
  // =========================

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      bgimage: null,
    }));

    setImagePreview("");
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    // New category requires image
    if (
      !editingId &&
      !(form.bgimage instanceof File)
    ) {
      toast.error(
        "Please select a background image."
      );
      return;
    }

    try {
      setLoading(true);

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description || ""
      );

      formData.append(
        "displayOrder",
        String(
          Number(form.displayOrder) || 0
        )
      );

      formData.append(
        "status",
        String(form.status)
      );

      // Add image only when a new file is selected
      if (form.bgimage instanceof File) {
        formData.append(
          "bgimage",
          form.bgimage
        );
      }

      // =========================
      // UPDATE
      // =========================

      if (editingId) {
        const response = await API.put(
          `/resource-categories/${editingId}`,
          formData
        );

        console.log(
          "Update category response:",
          response.data
        );

        toast.success(
          "Resources category updated successfully."
        );
      }

      // =========================
      // CREATE
      // =========================

      else {
        const response = await API.post(
          "/resource-categories",
          formData
        );

        console.log(
          "Create category response:",
          response.data
        );

        toast.success(
          "Resources category created successfully."
        );
      }

      // =========================
      // CLOSE
      // =========================

      setOpen(false);

      resetForm();

      // =========================
      // REFRESH
      // =========================

      await fetchCategories();
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      console.error(
        "Backend status:",
        error.response?.status
      );

      toast.error(
        error.response?.data?.message ||
          "Operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",

      description:
        category.description || "",

      displayOrder:
        category.displayOrder ?? 0,

      status:
        category.status ?? true,

      // Existing image URL
      bgimage:
        category.bgimage || null,
    });

    // Existing image preview
    setImagePreview(
      category.bgimage
        ? getImageUrl(category.bgimage)
        : ""
    );

    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this Resources category?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(
        `/resource-categories/${id}`
      );

      toast.success(
        "Resources category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Category delete error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Delete failed."
      );
    } finally {
      setLoading(false);
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

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-full">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Resources Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage categories for Resources cards.
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
          <Plus size={18} />

          Add Category
        </button>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="border-b bg-slate-50">

              <tr>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  ID
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Description
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Background Image
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

                categories.map(
                  (category, index) => (

                    <tr
                      key={category._id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >

                      {/* ID */}

                      <td className="px-5 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {category.name}
                      </td>

                      {/* DESCRIPTION */}

                      <td className="max-w-sm px-5 py-4 text-slate-500">

                        <p className="line-clamp-2">
                          {category.description ||
                            "—"}
                        </p>

                      </td>

                      {/* BACKGROUND IMAGE */}

                      <td className="px-5 py-4">

                        {category.bgimage ? (

                          <img  loading="lazy"
                            src={getImageUrl(
                              category.bgimage
                            )}
                            alt={
                              category.name
                            }
                            className="h-16 w-16 rounded object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="h-16 w-16 rounded bg-slate-200" />

                        )}

                      </td>

                      {/* ORDER */}

                      <td className="px-5 py-4 text-slate-600">
                        {category.displayOrder}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            category.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.status
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No Resources categories found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">

                  {editingId
                    ? "Edit Resources Category"
                    : "Add Resources Category"}

                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a category for Resource cards.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

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
                  placeholder="e.g. Career Resources"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
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
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />

              </div>

              {/* BACKGROUND IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Background Image
                </label>

                {/* EXISTING / SELECTED IMAGE */}

                {imagePreview && (

                  <div className="relative mb-3">

                    <img
                      src={getImageUrl(
                        imagePreview
                      )}
                      alt="Background preview"
                      className="h-32 w-full rounded-lg object-cover"  loading="lazy"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={loading}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700 disabled:opacity-50"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>

                  </div>

                )}

                {/* FILE INPUT */}

                <input
                  type="file"
                  name="bgimage"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  JPG, JPEG, PNG or WEBP. Maximum 5MB.
                </p>

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
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />

              </div>

              {/* STATUS */}

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  disabled={loading}
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
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading
                    ? "Saving..."
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

export default ResourcesCategories;