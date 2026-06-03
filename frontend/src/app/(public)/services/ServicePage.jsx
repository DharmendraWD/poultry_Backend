'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../../../css/service.module.css';

import roosterImg from '../../../../public/owned/ok2.png';



import Link from 'next/link';
import styles2 from '../../../css/Previous/Oldhero.module.css';
import A_Place_For_Chicken_BG from '../../../../public/owned/sellingAll.png';
import ServicesMidSection from './Middle';



function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let start = 0;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, end, duration]);

  return (
    <h3 ref={ref} className={styles.statNumber}>
      {count}
      {suffix}
    </h3>
  );
}

export default function FarmExperience({moreFeature, feature, serviceFixedContent}) {

const BASE_CONTENT_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

const words = serviceFixedContent?.Hservice_para?.split(" ") ?? [];
const midpoint = Math.ceil(words.length / 2);


  return (
    <>

    <section className={styles2.hero}>

      {/* Background image */}
      <div className={`${styles2.hero__bg} fadeIn`}>
        <img
          src={serviceFixedContent?.logo ? BASE_CONTENT_URL + serviceFixedContent?.logo : A_Place_For_Chicken_BG}
          alt=" Farm"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Overlays */}
      <div className={styles2.hero__overlay} />
      <div className={styles2['hero__gradient-bottom']} />

      {/* Center content */}
      <div className={styles2.hero__center}>
        <p className={styles2.hero__eyebrow}>{serviceFixedContent?.Hservice_heading}</p>

        <h1 className={`${styles2.hero__title} fadeUp`}>Our Services</h1>

        <p className={styles2.hero__subtitle}>
          <span className={styles2['hero__subtitle-script']}>{words?.slice(0, midpoint).join(" ")}</span>
          <span className={styles2['hero__subtitle-bold']}>&nbsp;{words?.slice(midpoint).join(" ")}</span>
        </p>
      </div>
    </section>



    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* LEFT IMAGE */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageCard}>
            <img
              src={serviceFixedContent?.SecondSecImage_Hero ? BASE_CONTENT_URL + serviceFixedContent?.SecondSecImage_Hero : roosterImg}
              alt="Farm Rooster"
              className={styles.image}
            />

            {/* Floating badge */}
            <div className={styles.badge}>
              <span className={styles.badgeBig}>100%</span>
              <span className={styles.badgeSmall}>
                Organic <br /> product
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <p className={styles.subTitle}>{serviceFixedContent?.shortHeading}</p>

          <h2 className={styles.title}>
            {serviceFixedContent?.shortpara} <br />
          </h2>

          <p className={styles.description}>
            {serviceFixedContent?.longpara}

          </p>

          {/* STATS */}
          <div className={styles.statsGrid}>
       
              <div className={styles.statCard}>
                <Counter
                  end={serviceFixedContent?.yrsOfExp}
                  suffix={"+"}
                  duration={2000}
                  delay={0}
                />

                <p className={styles.statLabel}>
                  {serviceFixedContent?.yrsOfExpText}
                </p>
              </div>
              <div className={styles.statCard}>
                <Counter
                  end={serviceFixedContent?.satisfiedCustomer}
                  suffix={"+"}
                  duration={2000}
                  delay={0}
                />

                <p className={styles.statLabel}>
                  {serviceFixedContent?.satisfiedCustomerText}
                </p>
              </div>
              <div className={styles.statCard}>
                <Counter
                  end={serviceFixedContent?.projectCompleted}
                  suffix={"+"}
                  duration={2000}
                  delay={0}
                />

                <p className={styles.statLabel}>
                  {serviceFixedContent?.projectCompletedText}
                </p>
              </div>
              <div className={styles.statCard}>
                <Counter
                  end={serviceFixedContent?.other}
                  suffix={"+"}
                  duration={2000}
                  delay={0}
                />

                <p className={styles.statLabel}>
                  {serviceFixedContent?.otherText}
                </p>
              </div>
        
          </div>
        </div>

      </div>
    </section>
    
    <ServicesMidSection moreFeature={moreFeature} feature={feature}></ServicesMidSection>
    </>



  );
}