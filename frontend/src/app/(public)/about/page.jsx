export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import AboutUs from "./About";

import styles from "../../../css/aboutPage.module.css";
import LoadingForEndUser from "@/adminComponent/loading/LoadinfForEndUser";


async function getAboutUsFeature() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/aboutus/features`,
      {
        cache: "no-store",
      }
   );

   const data = await res.json();
   return data?.data || [];
  } catch (error) {
   console.log(error);
   return [];
  }
 }
async function getAboutusFixedContent() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/aboutus/fixed-content`,
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


export default async function Page() {
  

 const feature = await getAboutUsFeature() || [];
 const aboutUsFixedContent = await getAboutusFixedContent() || {};



  return (
      <>
      <AboutUs aboutUsFixedContent={aboutUsFixedContent}/>

    <section className={styles.processSection}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.centerHeader}>
          <p className={styles.tag}>Our Process</p>

          <h2 className={styles.title}>
           {aboutUsFixedContent?.aboutusbellowHeading}
          </h2>

          <p className={styles.subtitle}>
            {aboutUsFixedContent?.aboutusbellowPara}
          </p>
        </div>



{/* steps  */}
        {
  Array.isArray(feature) ? (
    <div className={styles.processGrid}>
      {feature.map((step, index) => (
            <div key={index} className={styles.processCard}>
              <div className={styles.stepNumber}>
                {index + 1}
              </div>

              <div className={styles.stepIcon}>
                {step.icon}
              </div>

              <h3>{step.title}</h3>
              <p>{step.paragraph}</p>
            </div>
      ))}
    </div>
  ) : (
   <LoadingForEndUser />
  )
}
      </div>
    </section>

      </>
  );
}
