"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./Modal.module.css";

export default function ReusableModal({
  isModalOpen,
  onClose,
  icon,
  title,
  description,
  children,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${
        isModalOpen ? styles.overlayOpen : styles.overlayClose
      }`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${
          isModalOpen ? styles.modalOpen : styles.modalClose
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <IoClose />
        </button>

        <div className={styles.header}>
          <div className={styles.iconBox}>{icon}</div>

          <div className={styles.textContent}>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}


// HOW TO USE IT ?
//   const [open, setOpen] = useState(false);

//  <div>
//       <button onClick={() => setOpen(true)}>
//         Show Modal
//       </button>

//       <ReusableModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         icon={<FiBarChart2 />}
//         title="Analytics Dashboard"
//         description="View your latest analytics and performance metrics."
//       >
//         <div>
//           <h3>Your Custom Content</h3>

//           <p>
//             You can pass any section, component, chart,
//             form, table, or content here.
//           </p>
//         </div>
//       </ReusableModal>
//     </div>