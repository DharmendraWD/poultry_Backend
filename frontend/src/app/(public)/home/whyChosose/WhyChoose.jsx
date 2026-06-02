import Image from 'next/image';
import styles from '../../../../css/whychoose.module.css';

import Portrait_Chicken from "../../../../../public/portrait-chicken-on-the.jpg"
import chickenBg from "../../../../../public/farm-2021-08-30-03-44-32-utc-copy-650x650.jpg"
import LoadingForEndUser from '@/adminComponent/loading/LoadinfForEndUser';

// import chickVideo from "../../../../../public/videos/Littlechicks.mp4"

// changing above into object of array 
async function getWhyChooseUs() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/home/whychooseus`,
     {
       cache: "no-store",
     }
   );

   const data = await res.json();
   return data?.data || {};
  } catch (error) {
   console.log(error);
   return {};
  }
 }



function CheckIcon() {
  return (
    <svg
      className={styles['check-icon']}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Organic product speech-bubble badge as inline SVG
function OrganicBadge() {
  return (
    <svg
      viewBox="0 0 145 110"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="100% Organic product"
    >
      {/* Bubble body */}
      <ellipse cx="72" cy="52" rx="70" ry="48" fill="#5bbf1a" />
      {/* Tail of speech bubble */}
      <polygon points="30,90 55,75 20,100" fill="#5bbf1a" />
      {/* Text: Organic */}
      <text
        x="72"
        y="46"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="22"
        fontWeight="bold"
        fill="white"
      >
        Organic
      </text>
      {/* Text: product */}
      <text
        x="72"
        y="68"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="13"
        fill="rgba(255,255,255,0.9)"
      >
        product
      </text>
    </svg>
  );
}

export default async function WhyChooseUs({ miscellaneousData }) {


  const whyChooseUsData = await getWhyChooseUs();
// console.log(miscellaneousData)
  return (



    <div className={styles.whyGrid}>

      <section className={styles.section}>
      {/* Background image */}
      <div className={styles.section__bg}
      data-aos="fade-up"
     data-aos-anchor-placement="center-center"
      >
        
        <img
              src={miscellaneousData?.SecondSecImage_Hero
 ? process.env.BASE_CONTENT_URL + miscellaneousData?.SecondSecImage_Hero
 : "/videos/Littlechicks.mp4"}

          alt="Chicken flock background"

          style={{ objectFit: 'cover', objectPosition: 'center' }}

        />
      </div>

      {/* Dark overlay */}
      <div className={styles.section__overlay} />

      <div className={styles.inner}>
        {/* ── Left: text ── */}
        <div className={styles.content} data-aos="fade-right">
          <p className={styles.content__eyebrow}>Why Choose Us</p>
          <h2 className={styles.content__title}>
            Get The<br />
            Different Taste<br />
            Here
          </h2>
          <p className={styles.content__desc}>
            We Give Special Care To Our Products To Ensure The Best Quality And Taste For Our Customers.
          </p>


          {
  Array.isArray(whyChooseUsData) ? (
            <ul className={styles.checklist}>
            {whyChooseUsData?.map((item) => (
              <li key={item.id}>
              <div className='flex'>
                  <div className='flex gap-2'>
                <CheckIcon />
               <span className={styles.semibold}> {item?.text || 'Missing text.'}: </span>

             </div>
               <span> {item?.body || 'Missing text.'}</span>
              </div>
              </li>
            ))}
          </ul>
  ) : (
   <LoadingForEndUser />
  )
}
        </div>

        {/* ── Right: hen photo card ── */}
        <div className={styles['image-card']} data-aos="fade-left">
          {/* Organic speech bubble */}
          <div className={styles['organic-badge']}>
            <OrganicBadge />
          </div>

          {/* <Image
            src={Portrait_Chicken}
            alt="Fresh organic hen"
            width={300}
            height={360}
            style={{
              objectFit: 'cover',
              borderRadius: '18px',
              width: '100%',
              height: 'auto',
            }}
          /> */}


<div
  style={{
    width: 300,
    height: 360,
    borderRadius: '18px',
    overflow: 'hidden',
  }}
>
  <video
     src={miscellaneousData?.ThirdSecVideo_Hero ? process.env.BASE_CONTENT_URL + miscellaneousData?.ThirdSecVideo_Hero : "/videos/Littlechicks.mp4"}
    autoPlay
    muted
    loop
    playsInline
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    }}
  />
</div>

        </div>
      </div>
    </section>

    </div>


  );
}