import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const getInitialForm = () => ({
  category: "",
  title: "",
  listType: "number",
  listItems: [""],
  description: "",
  displayOrder: 0,
  status: true,
});

const ResourcesCards = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(getInitialForm());

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await API.get("/resource-categories");

      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // =========================
  // FETCH CARDS
  // =========================

  const fetchCards = async () => {
    try {
      setFetching(true);

      const response = await API.get("/resource-cards");

      const data = response.data?.data || [];

      setCards(
        [...data].sort(
          (a, b) =>
            Number(a.displayOrder || 0) -
            Number(b.displayOrder || 0),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch resource cards:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCards();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(getInitialForm());
    setEditingId(null);
  };

  // =========================
  // OPEN ADD
  // =========================

  const openAddModal = () => {
    resetForm();
    setOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // LIST TYPE
  // =========================

  const handleListTypeChange = (e) => {
    const listType = e.target.value;

    setForm((previous) => ({
      ...previous,
      listType,
      listItems:
        listType === "none"
          ? []
          : previous.listItems?.length
            ? previous.listItems
            : [""],
    }));
  };

  // =========================
  // LIST ITEM CHANGE
  // =========================

  const handleListChange = (index, value) => {
    setForm((previous) => ({
      ...previous,
      listItems: previous.listItems.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  // =========================
  // ADD LIST ITEM
  // =========================

  const addListItem = () => {
    setForm((previous) => ({
      ...previous,
      listItems: [...previous.listItems, ""],
    }));
  };

  // =========================
  // REMOVE LIST ITEM
  // =========================

  const removeListItem = (index) => {
    setForm((previous) => ({
      ...previous,
      listItems: previous.listItems.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    if (!form.title.trim()) {
      alert("Card title is required.");
      return;
    }

    if (
      form.listType !== "none" &&
      !form.listItems.some((item) => item.trim())
    ) {
      alert("Please add at least one list item.");
      return;
    }

    try {
      setLoading(true);

      const data = {
        category: form.category,
        title: form.title.trim(),
        listType: form.listType,

        listItems:
          form.listType === "none"
            ? []
            : form.listItems
                .map((item) => item.trim())
                .filter(Boolean),

        description:
          form.listType === "none"
            ? form.description.trim()
            : "",

        displayOrder: Number(form.displayOrder) || 0,

        status: Boolean(form.status),
      };

      if (editingId) {
        await API.put(`/resource-cards/${editingId}`, data);
      } else {
        await API.post("/resource-cards", data);
      }

      closeModal();

      await fetchCards();
    } catch (error) {
      console.error("Resource card save error:", error);

      alert(
        error.response?.data?.message ||
          "Operation failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (card) => {
    setEditingId(card._id);

    setForm({
      category: card.category?._id || card.category || "",

      title: card.title || "",

      listType: card.listType || "none",

      listItems:
        card.listItems?.length > 0
          ? [...card.listItems]
          : card.listType === "none"
            ? []
            : [""],

      description: card.description || "",

      displayOrder: card.displayOrder ?? 0,

      status: card.status ?? true,
    });

    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Resource card?")) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(`/resource-cards/${id}`);

      await fetchCards();
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
          "Delete failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LIST TYPE LABEL
  // =========================

  const getListTypeLabel = (type) => {
    switch (type) {
      case "number":
        return "Number List";

      case "bullet":
        return "Bullet List";

      default:
        return "List None";
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Resource Cards
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage cards under Resource categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Add Card
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  ID
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Title
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  List Type
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
              {fetching ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading Resource cards...
                  </td>
                </tr>
              ) : cards.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No Resource cards found.
                  </td>
                </tr>
              ) : (
                cards.map((card, index) => (
                  <tr
                    key={card._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    {/* ID */}

                    <td className="px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {card.category?.name || "No Category"}
                      </span>
                    </td>

                    {/* TITLE */}

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {card.title}
                    </td>

                    {/* LIST TYPE */}

                    <td className="px-5 py-4 text-slate-600">
                      {getListTypeLabel(card.listType)}
                    </td>

                    {/* ORDER */}

                    <td className="px-5 py-4 text-slate-600">
                      {card.displayOrder ?? 0}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          card.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
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
                          onClick={() =>
                            handleDelete(card._id)
                          }
                          disabled={loading}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
            ? "Edit Resource Card"
            : "Add Resource Card"
        }
        onClose={closeModal}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Resource Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            >
              <option value="">
                Select Category
              </option>

              {categories
                .filter((category) => category.status)
                .map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Card Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Interview Preparation"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* LIST TYPE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              List Type
            </label>

            <select
              value={form.listType}
              onChange={handleListTypeChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="number">
                Number List (1, 2, 3)
              </option>

              <option value="bullet">
                Bullet / List Point (•)
              </option>

              <option value="none">
                List None
              </option>
            </select>
          </div>

          {/* LIST */}

          {form.listType !== "none" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {form.listType === "number"
                      ? "Number List"
                      : "Bullet / Point List"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Add list items below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addListItem}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {form.listItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <span className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg bg-white font-semibold text-slate-700">
                      {form.listType === "number"
                        ? `${index + 1}.`
                        : "•"}
                    </span>

                    <input
                      value={item}
                      onChange={(e) =>
                        handleListChange(
                          index,
                          e.target.value,
                        )
                      }
                      placeholder={
                        form.listType === "number"
                          ? `Number item ${index + 1}`
                          : "Bullet point"
                      }
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                    />

                    {form.listItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeListItem(index)
                        }
                        className="rounded-lg bg-red-50 px-4 text-red-600 hover:bg-red-100"
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}

          {form.listType === "none" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Enter normal paragraph content..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          )}

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

          {/* STATUS */}

          <label className="flex items-center gap-3">
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
              onClick={closeModal}
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
                ? "Saving..."
                : editingId
                  ? "Update Card"
                  : "Create Card"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourcesCards;