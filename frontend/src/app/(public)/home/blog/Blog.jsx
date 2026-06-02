import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../../css/blog.module.css';

import img1 from "../../../../../public/owned/LittleChicks.png";
import img2 from "../../../../../public/owned/farm.png";
import img3 from "../../../../../public/owned/littleChicks2.png";
import LoadingForEndUser from '@/adminComponent/loading/LoadinfForEndUser';


const posts = [
  {
    image: img1, 
    day: '09',
    month: 'Nov',
    title: 'Healthy, Organically Raised Chickens in a Well-Organized Farm System',
    excerpt:
      'We raise chickens in a clean, well-organized environment with careful attention to their health and welfare. Our farming practices focus on natural and organic methods, ensuring the birds are grown without unnecessary chemicals or harmful additives. This results in healthier chickens and high-quality, safe poultry you can trust.',
    href: '/blog/eggs-are-simply-lovely',
  },
  {
    image: img2,
    day: '09',
    month: 'Nov',
    title: 'Peaceful Organic Chicken Farm in a Calm, Natural Environment',
    excerpt:
      'Our farm is located in a calm and open environment, away from noise and pollution, providing the perfect setting for healthy poultry farming. We raise chickens in a well-organized and hygienic system, using organic and natural practices that support their well-being. This peaceful atmosphere helps us ensure high-quality, fresh, and responsibly raised chickens you can trust.',
    href: '/blog/progenies-are-better',
  },
  {
    image: img3,
    day: '09',
    month: 'Nov',
    title: 'Gives You Flawless Protein',
    excerpt:
      'We provide a clean and reliable source of high-quality protein, ensuring healthy nutrition for your daily needs. Our carefully raised chickens are grown in natural and hygienic conditions, giving you fresh, wholesome protein you can trust for strength and wellness.',
    href: '/blog/flawless-protein',
  },
];

export default function Blog({ blogData }) {
const BASE_CONTENT_URL = process.env.BASE_CONTENT_URL;

  return (

  Array.isArray(blogData) && blogData.length >3  ? (
    <>
   

    <div className={styles.whyGrid}>

              <section className={styles.section}>
      <div className={styles.inner}>
       {/* Header row */}
        <div className={styles['header-row']}>
          <div data-aos="fade-left"> 
            <p className={styles.header__eyebrow}>Gallery &amp; Views</p>
            <h2 className={styles.header__title}>
              Views Around<br />The Farm
            </h2>
          </div>
          <Link data-aos="fade-right" href="/gallery" className={styles['more-btn']}>
            See More Photos
          </Link>
        </div>
  
        {/* Blog cards grid */}
        <div className={styles.grid}>
          {blogData?.slice(3).map((post, index) => (
            <article key={post.id || index} className={styles.card}>

              {/* Image + date badge */}
              <div className={styles['card__img-wrap']}>
                {/*
                  Replace image srcs with your actual blog photos:
                  blog-eggs.jpg   — eggs in basket on white surface
                  blog-chicks.jpg — baby chicks in green grass
                  blog-protein.jpg — hand holding eggs with chickens
                */}
                <Image
                  src={post.image ? BASE_CONTENT_URL + post.image : ""}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 33vw"
                />

                {/* Green date badge */}
                <div className={styles['date-badge']}>
                  <span className={styles['date-badge__day']}>{post.day}</span>
                  <span className={styles['date-badge__month']}>{post.month}</span>
                </div>
              </div>

              {/* Text body */}
              <div className={styles.card__body}>
                <h3 className={styles.card__title}>{post.title}</h3>
                <p className={styles.card__excerpt}>{post.excerpt}</p>
                {/* <Link href={post.href} className={styles.card__link}>
                  read more
                </Link> */}
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
     

    </div>
    </>
  ) : (
  //  <LoadingForEndUser /> 
  null
  )


  );
}