
import Image from 'next/image';
import styles from '../../../../css/gallery.module.css';

import img1 from "../../../../../public/owned/hens7.png";
import img2 from "../../../../../public/owned/LittleChicks.png";
import img3 from "../../../../../public/owned/adultHen.png";
import img4 from "../../../../../public/owned/adultHen2.png";
import img5 from "../../../../../public/owned/hens6.png";
import img6 from "../../../../../public/owned/littleChicks2.png";
import img7 from "../../../../../public/owned/hens3.png";
import img8 from "../../../../../public/owned/hens4.png";
import img9 from "../../../../../public/owned/hens9.png";
import img10 from "../../../../../public/owned/hens8.png";

const smImages = [
  { img: img1, alt: 'Baby chick', cls: 'img-sm-1' },
  { img: img2, alt: 'Hen flock', cls: 'img-sm-2' },
  { img: img3, alt: 'Chicken on grass', cls: 'img-sm-3' },
  { img: img4, alt: 'Rooster portrait', cls: 'img-sm-4' },
  { img: img5, alt: 'Eggs basket', cls: 'img-sm-5' },
  { img: img6, alt: 'Hands holding eggs', cls: 'img-sm-6' },
  { img: img7, alt: 'Colourful rooster', cls: 'img-sm-7' },
  { img: img8, alt: 'Chickens in yard', cls: 'img-sm-8' },
  { img: img9, alt: 'Chickens in yard', cls: 'img-sm-8' },
  { img: img10, alt: 'Chickens in yard', cls: 'img-sm-8' },
];


async function getGalleryData() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/home/gallery`,
     {
       cache: "no-store",
     }
   );

   const data = await res.json();
   return data?.data || {};
  } catch (error) {
   console.log(error);
  }
 }

export default async function Gallery() {
const galleryData = await getGalleryData();


const BaseURl = process.env.BASE_CONTENT_URL
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>



{Array.isArray(galleryData) &&
  galleryData
    .filter(item => item?.is_active === 1)
    .map((img, index) => {
      if (index === 0) {
        return (
          <div key={"dwb"} className={styles["img-large-1"]}>
            <div className={styles['img-wrap']}>
               <img
                 src={`${BaseURl}/${galleryData[0].image}`}
                 alt="Chickens at the farm"
                 sizes="(max-width: 560px) 50vw, (max-width: 860px) 25vw, 17vw"
                 style={{ objectFit: 'cover' }}

               />
             </div>
          </div>
        );
      }

      if (index === 1) {
        return (
          <div key={img.id} className={styles["img-large-2"]}>
             <div className={styles['img-wrap']}>
               <img
                 src={`${BaseURl}/${galleryData[1].image}`}
                 alt="Chickens at the farm"
                 sizes="(max-width: 560px) 50vw, (max-width: 860px) 25vw, 17vw"
                 style={{ objectFit: 'cover' }}

               />
             </div>
          </div>
        );
      }

    })}

  

<div className={styles.smallImageG}>

         {Array.isArray(galleryData) &&
  galleryData
    .filter(item => item?.is_active === 1)
    .slice(2, 6) // skip first 2, take next 4
    .map((img, index) => (
      <div
        key={img.id}
       className={styles[img.cls]}
      >
        <div className={styles['img-wrap']}>
          <img
            src={`${BaseURl}/${img.image}`}
            alt={img.title}
            sizes="(max-width: 560px) 50vw, (max-width: 860px) 25vw, 17vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    ))}
</div>
        </div>
      </div>
    </section>
  );
}
