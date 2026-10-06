import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";
import FormInput from "../../components/admin/FormInput";

const IMAGE_URL = (
  import.meta.env.VITE_IMAGE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const emptyForm = {
  name: "",
  description: "",
  bgimage: null,
  displayOrder: 0,
  status: true,
};

const WhatwedoCategories = () => {
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  /* ================= IMAGE URL ================= */

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    return `${IMAGE_URL}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      const response =
        await API.get(
          "/WhatwedoCategories"
        );

      setCategories(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load What We Do categories."
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= RESET ================= */

  const reset = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setImagePreview("");
  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

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

    setForm((prev) => ({
      ...prev,
      bgimage: file,
    }));

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Category name is required."
      );
      return;
    }

    // Image required when creating
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

      // Only send file when a new image is selected
      if (form.bgimage instanceof File) {
        formData.append(
          "bgimage",
          form.bgimage
        );
      }

      /* ================= UPDATE ================= */

      if (editingId) {
        await API.put(
          `/WhatwedoCategories/${editingId}`,
          formData
        );

        toast.success(
          "Category updated successfully!"
        );
      }

      /* ================= CREATE ================= */

      else {
        await API.post(
          "/WhatwedoCategories",
          formData
        );

        toast.success(
          "Category created successfully!"
        );
      }

      setOpen(false);

      reset();

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

      toast.error(
        error.response?.data?.message ||
          "Operation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */

  const editCategory = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",

      description:
        category.description || "",

      bgimage:
        category.bgimage || null,

      displayOrder:
        category.displayOrder ?? 0,

      status:
        category.status ?? true,
    });

    setImagePreview(
      category.bgimage
        ? getImageUrl(category.bgimage)
        : ""
    );

    setOpen(true);
  };

  /* ================= DELETE ================= */

  const deleteCategory = (id) => {
    toast.custom(
      (t) => (
        <div className="w-[360px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
          <div>
            <h3 className="font-semibold text-slate-900">
              Delete this category?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              All related cards may also be affected.
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                deletingId === id
              }
              onClick={async () => {
                try {
                  setDeletingId(id);

                  toast.dismiss(t.id);

                  await API.delete(
                    `/WhatwedoCategories/${id}`
                  );

                  toast.success(
                    "Category deleted successfully!"
                  );

                  await fetchCategories();
                } catch (error) {
                  console.error(
                    "Delete category error:",
                    error
                  );

                  toast.error(
                    error.response?.data?.message ||
                      "Delete failed. Please try again."
                  );
                } finally {
                  setDeletingId(null);
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingId === id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      }
    );
  };

  /* ================= CLOSE MODAL ================= */

  const closeModal = () => {
    if (loading) return;

    setOpen(false);

    reset();
  };

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            What We Do Categories
          </h1>

          <p className="text-sm text-slate-500">
            Create and manage categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />

          Add Category
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">
                  ID
                </th>

                <th className="px-5 py-4">
                  Name
                </th>

                <th className="px-5 py-4">
                  Description
                </th>

                <th className="px-5 py-4">
                  Background Image
                </th>

                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
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
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      {/* ID */}

                      <td className="px-5 py-4 font-medium text-slate-500">
                        {index + 1}
                      </td>

                      {/* NAME */}

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

                      {/* IMAGE */}

                      <td className="px-5 py-4">
                        {category.bgimage ? (
                          <img
                            src={getImageUrl(
                              category.bgimage
                            )}
                            alt={
                              category.name
                            }
                            className="h-16 w-24 rounded-lg object-cover"  loading="lazy"
                          />
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
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
                              editCategory(
                                category
                              )
                            }
                            disabled={loading}
                            className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteCategory(
                                category._id
                              )
                            }
                            disabled={
                              deletingId ===
                              category._id
                            }
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No What We Do categories
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <Modal
        open={open}
        title={
          editingId
            ? "Edit Category"
            : "Add Category"
        }
        onClose={closeModal}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* CATEGORY NAME */}

          <FormInput
            label="Category Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                }))
              }
              rows="4"
              placeholder="Enter category description"
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* BACKGROUND IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Background Image
            </label>

            {/* IMAGE PREVIEW */}

            {imagePreview && (
              <div className="relative mb-3">
                <img
                  src={imagePreview}
                  alt="Background preview"
                  className="h-32 w-full rounded-lg object-cover"  loading="lazy"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");

                    setForm((prev) => ({
                      ...prev,
                      bgimage: null,
                    }));
                  }}
                  disabled={loading}
                  className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <input
              type="file"
              name="bgimage"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              JPG, JPEG, PNG or WEBP. Maximum
              5MB.
            </p>
          </div>

          {/* DISPLAY ORDER */}

          <FormInput
            label="Display Order"
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                displayOrder: Number(
                  e.target.value
                ),
              }))
            }
          />

          {/* STATUS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status:
                    e.target.checked,
                }))
              }
              className="h-4 w-4"
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
                ? "Update Category"
                : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default WhatwedoCategories;