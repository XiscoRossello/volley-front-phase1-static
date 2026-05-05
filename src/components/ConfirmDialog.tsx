// Inline confirmation dialog for destructive actions (delete).
// Rendered in-place next to the trigger element rather than as a modal overlay,
// which avoids focus-trap complexity while still being clearly confirmatory.

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  message,
  confirmLabel = "Yes, delete",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog" role="alertdialog" aria-label="Confirm action">
      <p className="confirm-dialog__message">{message}</p>
      <div className="action-row">
        <button
          type="button"
          className="btn-danger"
          onClick={onConfirm}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Deleting…" : confirmLabel}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}

export default ConfirmDialog;
