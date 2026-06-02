

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GiFishingBoat,
} from 'react-icons/gi';
import {
  FaArrowRight,
  FaPhoneAlt,
} from 'react-icons/fa';
import { MdOutlineEgg } from 'react-icons/md';
import { TbChevronDown } from 'react-icons/tb';
import styles from '../../../../css/hero.module.css';
import adultChicken from '../../../../../public/owned/adultHen2.png';
import fishFarm from '../../../../../public/owned/fishFarm1.jpg';
import Agri from '../../../../../public/owned/agri4.jpg';
import LoadingForEndUser from '@/adminComponent/loading/LoadinfForEndUser';


import { GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat } from 'react-icons/gi';
import { FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';


// get stats 
const getStats = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};
const getTicker = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/ticker`);
    if (!response.ok) {
      throw new Error('Failed to fetch ticker');
    }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching ticker:', error);
    return [];
  }
};

const getHeroData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/hero`);
    console.log(response, "res")
    if (!response.ok) {
      throw new Error('Failed to fetch hero data');
    }
    const data = await response.json();
    // console.log("inside fun", data)
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return [];
  }
};

const iconMap = {
 GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat,
  GiFishingBoat,
FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor, 
  FaArrowRight,
  FaPhoneAlt,
};

/* ── Business data ──────────────────────────────────────── */
// const BUSINESSES = [
//   {
//     id: 'poultry',
//     tab: 'Poultry Farm',
//     tabIcon: <GiChicken />,
//     tabClass: styles['tab--poultry'],
//     color: '#e8a045',
//     eyebrow: 'Western Poultry Breeding Farm',
//     headline: 'Farm-Fresh',
//     accentLine: 'Poultry & Eggs',
//     sub:
//       'Premium free-range chickens and organically raised eggs — straight from our farm to your table. No antibiotics. No compromise.',
//     label: 'Know More',
//      href: '/services',
//     bgClass: styles['bgPanel--poultry'],
//     /* Replace with your actual image imports */
//     image: adultChicken.src,

//   },
//   {
//     id: 'agri',
//     tab: 'Agriculture',
//     tabIcon: <GiWheat />,
//     tabClass: styles['tab--agri'],
//     color: '#5bbf1a',
//     eyebrow: 'Organic Agriculture',
//     headline: 'Naturally',
//     accentLine: 'Grown Harvest',
//     sub:
//       'Seasonal vegetables, grains, and herbs cultivated with love and zero synthetic chemicals. Good for you. Good for the soil.',
// label: 'Explore Products', 
// href: '/services',
//     bgClass: styles['bgPanel--agri'],
//     image: Agri.src,
//   },
//   {
//     id: 'fish',
//     tab: 'Fish Farming',
//     tabIcon: <GiFishingBoat />,
//     tabClass: styles['tab--fish'],
//     color: '#1a9bbf',
//     eyebrow: 'Freshwater Fish Farm',
//     headline: 'Pristine',
//     accentLine: 'Fresh Fish',
//     sub:
//       'Sustainably farmed fresh-water fish raised in clean, oxygen-rich ponds. Omega-rich and harvested to order for peak freshness.',
// label: 'Our Services',
//  href: '/services',
//     bgClass: styles['bgPanel--fish'],
//     image: fishFarm.src,
//   },
// ];

// api response 
// {
//     "id": 11,
//     "tab": " test tab",
//     "tab_icon": "GiCow",
//     "tab_class": "tab--poultry",
//     "color": " #e8a045",
//     "eyebrow": " test eyebrow",
//     "headline": " Test headline",
//     "accent_line": " accent line",
//     "sub": " subsa",
//     "label": " btn label",
//     "href": " btn href",
//     "bg_class": "bgPanel--poultry",
//     "image": "hero/1779966158857-445171461.png",
//     "created_at": "2026-05-28T11:02:38.000Z",
//     "updated_at": "2026-05-28T17:23:13.000Z"
// }

/* ── Component ───────────────────────────────────────────── */
export default function MultiHero() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const switchTo = useCallback((idx) => {
    setActive(idx);
    setAnimKey((k) => k + 1);
  }, []);



  
  // GET STATS DATA 
  const [statsData, setStatsData] = useState(null);
  const [tickerData, setTickerData] = useState(null);
  const [BUSINESSES, setBUSINESS] = useState([])
  const biz = BUSINESSES[active];
  useEffect(() => {
    getStats().then((data) => {
      setStatsData(data);
    });
    getTicker().then((data) => {
      setTickerData(data);
    });
    getHeroData().then((data) => {
  const formatted = data.map((item) => ({
    ...item,
    tabClass: item.tab_class,
    bgClass: item.bg_class,
    accentLine: item.accent_line,
    tabIcon: item.tab_icon?.trim(),
  }));

  setBUSINESS(formatted);
});
  }, []);

    /* Auto-rotate every 6 seconds */
useEffect(() => {
  if (!BUSINESSES.length) return;

  const id = setInterval(() => {
    setActive((prev) => {
      const next = (prev + 1) % BUSINESSES.length;
      setAnimKey((k) => k + 1);
      return next;
    });
  }, 6000);

  return () => clearInterval(id);
}, [BUSINESSES.length]);

useEffect(() => {
  if (BUSINESSES.length > 0) {
    setActive(0);
  }
}, [BUSINESSES]);
console.log(BUSINESSES, "k");
  // GET STATS DATA END

  const getImageUrl = (path) => {
  if (!path) return adultChicken.src;

  return `${process.env.NEXT_PUBLIC_BASE_CONTENT_URL}/${path}`
};

  return (
    <section
      className={styles.heroWrapper}
      style={{ '--active-color': biz?.color }}
    >
      {/* ── Sliding backgrounds ── */}
 {
  
  Array.isArray(BUSINESSES) ? (
     <div className={styles.bgSlider}>
        {BUSINESSES.map((b, i) => (
          <div
            key={b.id}
            className={`${styles.bgPanel} ${styles[b.bgClass]} ${
  i === active ? styles.active : ''
}`}
          >
          <Image
  src={getImageUrl(b.image)}
  alt={b.tab}
  fill
  unoptimized
  priority={i === 0}
  quality={90}
  style={{
    objectFit: 'cover',
    objectPosition: 'center',
  }}
/>
            <h1>{b?.image ? process.env.NEXT_PUBLIC_BASE_CONTENT_URL + b?.image : adultChicken.src}</h1>
          </div>
        ))}
      </div>
  ) : (
   <LoadingForEndUser />
  )

 }



      {/* ── Grain texture ── */}
      <div className={styles.grain} aria-hidden />

      {/* ── Floating orbs ── */}
      <div className={`${styles.orb} ${styles['orb--1']}`} aria-hidden />
      <div className={`${styles.orb} ${styles['orb--2']}`} aria-hidden />
      <div className={`${styles.orb} ${styles['orb--3']}`} aria-hidden />

      {/* ── Diagonal accent ── */}
      <div className={styles.diagonalAccent} aria-hidden />

      {/* ── Main content ── */}
      <div className={styles.heroContent}>

        {/* Business switcher tabs */}
{/* Business BOX  */}

        <div className={styles.businessTabs} role="tablist">
{BUSINESSES?.map((b, i) => {
  const Icon = iconMap[b?.tabIcon?.trim()];

  return (
    <button
      key={b.id}
      role="tab"
      aria-selected={i === active}
      className={`${styles.tab} ${styles[b.tabClass]} ${
        i === active ? styles.active : ''
      }`}
      onClick={() => switchTo(i)}
    >
      <span className={styles.tabIcon}>
        {Icon && <Icon size={20} />}
      </span>

      {b.tab}
    </button>
  );
})}
        </div>



        {/* Center block */}
        <div className={styles.centerBlock}>

          {/* Text side */}
          <div className={styles.textBlock} key={animKey}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {biz?.eyebrow}
            </div>

            <div className={styles.headlineSlot}>
              <span className={styles.headline}>{biz?.headline}</span>
  
            </div>
            <div className={styles.headlineSlot}>
              <span className={styles.headlineAccent}>{biz?.accentLine}</span>
            </div>

            <p className={styles.subText}>{biz?.sub}</p>

            <div className={styles.ctaRow}>
              <Link href={biz?.href || '/services'} className={styles.ctaPrimary}>
                {biz?.label}
           
              </Link>
              <Link href="/services" className={styles.ctaSecondary}>
           
                View Our All Service
              </Link>
            </div>
          </div>

          {/* Stats side */}
       {
  Array.isArray(statsData) ? (
   <div className={styles.statsPanel}>
            {statsData.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{s.number_text}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
  ) : (
   <LoadingForEndUser />
  )
}
        </div>

        {/* Bottom strip */}
        <div className={styles.bottomStrip}>
          {/* Ticker */}
    

                 {
  Array.isArray(tickerData) ? (
      <div className={styles.ticker}>
            <div className={styles.tickerInner}>
              {tickerData.map((item, i) => (
                <span key={i} className={styles.tickerItem}>
                  <span className={styles.tickerDot} />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
  ) : (
   <LoadingForEndUser />
  )
}

          {/* Progress dots */}
          <div className={styles.progressDots}>
            {BUSINESSES?.map((b, i) => (
              <button
                key={b?.id}
                className={`${styles.dot} ${i === active ? styles.active : ''}`}
                onClick={() => switchTo(i)}
                aria-label={`Go to ${b?.tab}`}
                style={i === active ? { background: biz?.color } : {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating organic badge ── */}
      <div className={styles.floatingBadge} aria-hidden>
        <div
          className={styles.badgeCircle}
          style={{ background: biz?.color }}
        >
          <span className={styles.badgePct}>100%</span>
          <span className={styles.badgeWord}>Organic</span>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className={styles.scrollHint} aria-hidden>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
        <TbChevronDown size={14} color="rgba(255,255,255,0.4)" />
      </div>
    </section>
  );
}