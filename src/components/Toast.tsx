// Accessible toast notification for success and error feedback.
// Auto-dismisses after 4 seconds; the user can also close it manually.
// The parent controls visibility by passing a non-empty `message` string.

import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant: "success" | "error";
  onClose: () => void;
}

function Toast({ message, variant, onClose }: ToastProps) {
  // Auto-dismiss after 4 s. The timer resets whenever the message changes so
  // each new toast gets its own window.
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`toast toast--${variant}`}
    >
      <span className="toast__icon">{variant === "success" ? "✓" : "✕"}</span>
      <p className="toast__message">{message}</p>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
