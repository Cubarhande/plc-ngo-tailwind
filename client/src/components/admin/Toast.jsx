import { useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const config = {
    success: {
      icon: CheckCircle,
      title: "Success",
      className: "border-green-200 bg-green-50 text-green-700",
      iconClass: "text-green-600",
    },

    error: {
      icon: AlertCircle,
      title: "Error",
      className: "border-red-200 bg-red-50 text-red-700",
      iconClass: "text-red-600",
    },

    warning: {
      icon: AlertTriangle,
      title: "Warning",
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
      iconClass: "text-yellow-600",
    },
  };

  const current = config[toast.type] || config.success;

  const Icon = current.icon;

  return (
    <div className="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${current.className}`}
      >
        <Icon size={21} className={`mt-0.5 shrink-0 ${current.iconClass}`} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{current.title}</p>

          <p className="mt-1 text-sm leading-5">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
