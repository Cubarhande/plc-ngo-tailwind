 
import { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const ContactsAdmin = () => {
  const [contacts, setContacts] = useState([]);

  const [selected, setSelected] = useState(null);

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
  // FETCH CONTACTS
  // =========================

  const fetchContacts = async () => {
    try {
      const response = await API.get("/contacts");

      setContacts(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load contact messages:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to load contact messages.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================
  // DELETE
  // =========================

  const remove = async () => {
    if (!deleteId) return;

    setLoading(true);

    try {
      const response = await API.delete(`/contacts/${deleteId}`);

      showToast(
        response.data?.message ||
          "Message deleted successfully.",
        "success",
      );

      setDeleteId(null);

      await fetchContacts();
    } catch (error) {
      console.error("Delete contact error:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to delete message.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MARK AS READ
  // =========================

  const markRead = async (contact) => {
    try {
      await API.put(`/contacts/${contact._id}`, {
        status: "read",
      });

      setSelected({
        ...contact,
        status: "read",
      });

      setContacts((previous) =>
        previous.map((item) =>
          item._id === contact._id
            ? {
                ...item,
                status: "read",
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to mark message as read:",
        error,
      );

      showToast(
        error.response?.data?.message ||
          "Failed to mark message as read.",
        "error",
      );
    }
  };

  // =========================
  // OPEN MESSAGE
  // =========================

  const handleView = (contact) => {
    setSelected(contact);

    if (contact.status === "new") {
      markRead(contact);
    }
  };

  return (
    <div className="relative">
      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-green-500"
              />
            ) : (
              <AlertCircle
                size={22}
                className="mt-0.5 shrink-0 text-red-500"
              />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {toast.type === "success"
                  ? "Success"
                  : "Error"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {toast.message}
              </p>
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
              aria-label="Close notification"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Contact Messages
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View messages submitted through the website.
        </p>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  ID
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Name
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Subject
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
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <tr
                    key={contact._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    {/* ID */}

                    <td className="px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    {/* NAME */}

                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-900">
                        {contact.name}
                      </span>
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-slate-600">
                      {contact.email}
                    </td>

                    {/* SUBJECT */}

                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-slate-600">
                        {contact.subject || "—"}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          contact.status === "new"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.status || "new"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            handleView(contact)
                          }
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="View message"
                        >
                          <Eye size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteId(contact._id)
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          title="Delete message"
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
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          VIEW MESSAGE MODAL
      ===================================================== */}

      <Modal
        open={Boolean(selected)}
        title="Contact Message"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-5">
            {/* NAME */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {selected.name}
              </p>
            </div>

            {/* EMAIL */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-slate-700">
                {selected.email}
              </p>
            </div>

            {/* PHONE */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-slate-700">
                {selected.phone || "Not provided"}
              </p>
            </div>

            {/* SUBJECT */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subject
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {selected.subject || "No subject"}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  selected.status === "new"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selected.status || "new"}
              </span>
            </div>

            {/* MESSAGE */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Message
              </p>

              <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <p className="whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            {/* ICON */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2
                size={22}
                className="text-red-600"
              />
            </div>

            {/* TITLE */}

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Delete Message?
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this contact
              message? This action cannot be undone.
            </p>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={remove}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsAdmin;
 
