"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./confirmation.module.css";

export default function ConfirmBox({
  isOpen,
  onClose,
  onConfirm,
  onCancel,

  icon,
  title = "Are you sure?",
  description = "This action cannot be undone.",

  confirmText = "Yes",
  cancelText = "No",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  });

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${
        isOpen ? styles.overlayOpen : styles.overlayClose
      }`}
      onClick={handleCancel}
    >
      <div
        className={`${styles.modal} ${
          isOpen ? styles.modalOpen : styles.modalClose
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className={styles.closeBtn} onClick={handleCancel}>
          <FiX />
        </button>

        {/* Icon */}
        {icon && <div className={styles.iconBox}>{icon}</div>}

        {/* Content */}
        <h2>{title}</h2>

        <p>{description}</p>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            {cancelText}
          </button>

          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// how to use it ?

    //      <button onClick={() => setOpen(true)}>
    //     Delete Item
    //   </button>

    //   <ConfirmBox
    //     isOpen={open}
    //     onClose={() => setOpen(false)}
    //     onConfirm={handleLogout}
    //     onCancel={handleCancelLogout}
    //     icon={<FiTrash2 />}
    //     title="Delete this item?"
    //     description="This action cannot be undone and the data will be permanently removed."
    //     confirmText="Delete"
    //     cancelText="Cancel"
    //   />