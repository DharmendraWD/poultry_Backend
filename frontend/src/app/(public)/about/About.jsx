import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../css/aboutus.module.css';
import Free_Range_Chickens from "../../../../public/owned/a-place-for-poultry-to-call-home.jpg"
import styles2 from '../../../css/Previous/Oldhero.module.css';
import A_Place_For_Chicken_BG from '../../../../public/owned/a-place-for-poultry-to-call-home.jpg';



export default function   AboutUs({aboutUsFixedContent}) {
const BASE_CONTENT_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;
console.log(BASE_CONTENT_URL + aboutUsFixedContent?.logo )


const words = aboutUsFixedContent?.aboutusHeroPara?.split(" ") || [];
const midpoint = Math.ceil(words?.length / 2);

const words2 = aboutUsFixedContent?.aboutusbellowHeading?.split(" ") || [];
const midpoint2 = Math.ceil(words2?.length / 2);
  return (
    <>

    <section className={styles2.hero}>

      {/* Background image */}
      <div className={`${styles2.hero__bg} fadeIn`}>
        <img
          src={aboutUsFixedContent?.logo ? BASE_CONTENT_URL + aboutUsFixedContent?.logo : A_Place_For_Chicken_BG}
          alt=" Farm"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Overlays */}
      <div className={styles2.hero__overlay} />
      <div className={styles2['hero__gradient-bottom']} />

      {/* Center content */}
      <div className={styles2.hero__center}>
        <p className={styles2.hero__eyebrow}>{aboutUsFixedContent?.aboutus_heading}</p>

        <h1 className={`${styles2.hero__title} fadeUp`}>About Us</h1>

        <p className={styles2.hero__subtitle}>
          <span className={styles2['hero__subtitle-script']}>{words.slice(0, midpoint).join(" ")}</span>
          <span className={styles2['hero__subtitle-bold']}>&nbsp;{words.slice(midpoint).join(" ")}</span>
        </p>
      </div>
    </section>
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Left: farm image + badge */}
        <div className={styles['image-wrap']}>
          {/*
            Replace src with your actual farm photo.
            e.g. /public/images/farm-field.jpg
            Shows chickens roaming on green field with farm buildings.
          */}
          <img
            src={aboutUsFixedContent?.SecondSecImage_Hero ? BASE_CONTENT_URL + aboutUsFixedContent?.SecondSecImage_Hero : Free_Range_Chickens}
            alt="Free-range chickens on the farm"
            style={{ objectFit: 'cover', borderRadius: '12px', width: '100%', height: 'auto' }}
          />

          {/* 100% Organic badge */}
          <div className={styles.badge}>
            <span className={styles.badge__pct}>100%</span>
            <span className={styles.badge__label}>Organic<br />product</span>
          </div>
        </div>

        {/* Right: text content */}
        <div className={styles.content}>
          <p className={styles.content__eyebrow}>About Us</p>
          <h2 className={styles.content__title}>
         {words2.slice(0, midpoint2).join(" ")}<br />
           {words2.slice(midpoint2).join(" ")}
          </h2>
          <p className={styles.content__body}>
            {aboutUsFixedContent?.aboutusLongPara}
          </p>
          <Link href="/contact" className={styles.content__cta}>
            Contact Us
          </Link>
        </div>

      </div>
    </section></>
  );
}