import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from '../../../../css/freRangeEggSec.module.css';
import eggInHand from '../../../../../public/owned/adultHen.png';
import eggInBask2 from '../../../../../public/owned/fishFarm1.jpg';
import agri from '../../../../../public/owned/agri2.jpg';
import LoadingForEndUser from '@/adminComponent/loading/LoadinfForEndUser';



export default function FreeRangeEggs({blogData}) {
const BASE_CONTENT_URL = process.env.BASE_CONTENT_URL;


  return (

  Array.isArray(blogData) ? (
        <section className={styles.section}
    data-aos="zoom-in"
    >
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.header__eyebrow}>Our Product</p>
          <h2 className={styles.header__title}>Free Range Products</h2>
        </div>

        {/* Two-column grid */}
        <div className={styles.grid}>

          {/* Left — large eggs basket image */}
          {/*
            Replace with /public/images/eggs-basket.jpg
            (brown eggs in wicker basket with a whisk, top-down shot)
          */}
          <img
            src={blogData[0]?.image ?  BASE_CONTENT_URL + blogData[0]?.image : ""}
            alt="Fresh free range eggs in a basket"
        
            className={styles['left-img']}
            style={{ objectFit: 'cover' }}
          />

          {/* Right — small image + text */}
          <div className={styles.right}>
            {/*
              Replace with /public/images/eggs-hand.jpg
              (hands holding white eggs with chickens in background)
            */}
            <img
              src={blogData[1]?.image ? BASE_CONTENT_URL + blogData[1]?.image : ""}
              alt="Farmer holding fresh eggs"
              className={styles['right-img']}
              style={{ objectFit: 'cover' }}
            />

            <div>
              <p className={styles.right__body}>
             {blogData[1]?.description}
              </p>
              <Link href="/gallery" className={styles.right__link}>
                <FaArrowRight size={12} />
                See More
              </Link>
            </div>
          </div>
          {/* Right — small image + text */}
          <div className={styles.right}>
            {/*
              Replace with /public/images/eggs-hand.jpg
              (hands holding white eggs with chickens in background)
            */}
            <img
              src={blogData[2]?.image ? BASE_CONTENT_URL + blogData[2]?.image : ""}
              alt="Farmer holding fresh eggs"
              className={styles['right-img']}
              style={{ objectFit: 'cover' }}
            />

            <div>
              <p className={styles.right__body}>
                         {blogData[2]?.description}

              </p>
              <Link href="/gallery" className={styles.right__link}>
                <FaArrowRight size={12} />
                See More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  ) : (
   <LoadingForEndUser />
  )


  );
}