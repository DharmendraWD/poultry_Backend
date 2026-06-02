
"use client";
export const dynamic = 'force-dynamic';
import img1 from "../../../../public/owned/hens3.png";
import img2 from "../../../../public/owned/hens4.png";
import img3 from "../../../../public/owned/hens5.png";
import img4 from "../../../../public/owned/hens6.png";
import img5 from "../../../../public/owned/hens7.png";
import img6 from "../../../../public/owned/hens8.png";
import img7 from "../../../../public/owned/hens9.png";
import img8 from "../../../../public/owned/LittleChicks.png";
import img9 from "../../../../public/owned/adultHen.png";
import img10 from "../../../../public/owned/cuteChicken.jpg";

import { FiMapPin } from "react-icons/fi";
import Image from "next/image";

import styles from "../../../css/customGallery.module.css";
import { useState } from "react";

function GalleryCard() {
  const projects = [
    {
      id: 1,
      title: "",
      location: "",
      capacity: "",
      year: "2018",
      image: img1,
      // span: styles.span2,
    },
    {
      id: 2,
      title: "",
      location: "",
      capacity: "",
      year: "2020",
      image: img2,
      // span: styles.span1,
    },
    {
      id: 3,
      title: "",
      location: "",
      capacity: "",
      year: "2021",
      image: img3,
      // span: styles.span1,
    },
    {
      id: 4,
      title: "",
      location: "",
      capacity: "",
      year: "2022",
      image: img4,
      // span: styles.spanRow2,
    },
    {
      id: 5,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img5,
      // span: styles.span1,
    },
    {
      id: 6,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img6,
      // span: styles.span1,
    },
    {
      id: 7,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img7,
      // span: styles.span1,
    },
    {
      id: 8,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img8,
      // span: styles.span1,
    },
    {
      id: 9,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img9,
      // span: styles.span1,
    },
    {
      id: 10,
      title: "",
      location: "",
      capacity: "",
      year: "2023",
      image: img10,
      // span: styles.span1,
    },
  ];


const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.badge}>Some Of Our Glimpses</div>

          <h2 className={styles.title}>
            Providing{" "}
            <span className={styles.gradientText}>Across all Over Nepal</span>
          </h2>


        </div>

        {/* GRID */}
        <div className={styles.grid}>
          {projects.map((project) => (
            <div
  key={project.id}
  className={`${styles.card} ${project.span} fadeUp`}
  onClick={() => setSelectedImage(project)}
>
              <div className={styles.imageWrapper}
          
              >
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={project.image}
                  alt={project.title}
                  className={styles.image}
                />

                {/* OVERLAY */}
                <div className={styles.overlay} />

                {/* CONTENT */}
                <div className={styles.content}>
                  <h3 className={styles.projectTitle}>
                    {project.title}
                  </h3>

                  {/* <div className={styles.locationRow}>
                    <FiMapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                      <FiMapPin className="w-4 h-4" />
                      <span>{project.capacity}</span>
                    </div>

                    <div className={styles.infoItem}>
                      <FiMapPin className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                  </div> */}

                  <button className={styles.button}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

{selectedImage && (
  <div
    className={styles.lightbox}
    onClick={() => setSelectedImage(null)}
  >
    <div
      className={styles.lightboxContent}
      onClick={(e) => e.stopPropagation()}
    >
      <Image
        src={selectedImage.image}
        alt={selectedImage.title}
        fill
        className={styles.lightboxImage}
      />

      <button
        className={styles.closeButton}
        onClick={() => setSelectedImage(null)}
      >
        ✕
      </button>

      <div className={styles.lightboxText}>
        <h2>{selectedImage.title}</h2>
        <p>{selectedImage.location}</p>
      </div>
    </div>
  </div>
)}

    
      </div>
    </section>
  );
}

export default GalleryCard;