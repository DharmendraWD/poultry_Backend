"use client";

import { FiBarChart2 } from "react-icons/fi";
import styles from "./header.module.css";
import { useState } from "react";
import ReusableModal from "../Modal/ReusableModal";

export default function AdminHeader({
    title, 
    description,
    icon
}) {

  const [open, setOpen] = useState(false);


  return (
    <>
    <div className={styles.sectionHeader}>
      <div className={styles.iconBox}>
        {icon || <FiBarChart2 />}
      </div>

      <div className={styles.content}>
        <h1>{title}</h1>

        <p>
          {description}
        </p>
      </div>
    </div>
       <div>


    </div>
    </>
  );
}