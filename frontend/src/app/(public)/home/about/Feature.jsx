import { IoFishSharp } from 'react-icons/io5';
import styles from '../../../../css/feature.module.css';
import { LuTreePalm } from 'react-icons/lu';
import { MdHealthAndSafety, MdOutlineSentimentVerySatisfied } from 'react-icons/md';
import { SiThunderbird } from 'react-icons/si';
import * as Gi from 'react-icons/gi';
import * as Fa from 'react-icons/fa';
import * as Fa6 from 'react-icons/fa6';
import * as Md from 'react-icons/md';
import * as Bi from 'react-icons/bi';
import * as Hi from 'react-icons/hi';


async function getFeatures() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/home/homefeaturecard`,
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


export default async function Features() {
  const featuresData = await getFeatures();

  const getIcon = (iconName) => {
    return (
      Fa[iconName] ||
      Fa6[iconName] ||
      Gi[iconName] ||
      Md[iconName] ||
      Bi[iconName] ||
      Hi[iconName]
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {Array.isArray(featuresData) &&
          featuresData
            .filter((item) => item?.active === 1)
            .map((f) => {
              const IconComponent = getIcon(f.icon);

              return (
                <div
                  key={f.id}
                  className={`${styles.card} ${
                    f.active ? styles['card--active'] : ''
                  }`}
                  data-aos="fade-up"
                >
                  <div
                    className={styles.card__icon}
                    style={{ color: f.icon_color }}
                  >
                    {IconComponent && <IconComponent />}
                  </div>

                  <h3 className={styles.card__title}>
                    {f.title}
                  </h3>

                  <p className={styles.card__body}>
                    {f.body}
                  </p>
                </div>
              );
            })}

                 <div
                  className={`${styles.card} `}
                  data-aos="fade-up"
                >
                  <div
                    className={styles.card__icon}
                  
                  >
             <Gi.GiHealthPotion style={{ color: 'var(--color-primary)' }} />
                  </div>

                  <h3 className={styles.card__title} style={{ color: 'var(--color-primary)' }}>
                   We Care About Your Health
                  </h3>

                  <p className={styles.card__body}>
                 We are committed to providing healthy, organic Vegetables.
                  </p>
                </div>
      </div>
    </section>
  );
}