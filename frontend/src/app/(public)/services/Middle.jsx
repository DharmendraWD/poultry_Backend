"use client";
import img2 from '../../../../public/owned/adultHen2.png';
import agri from "../../../../public/owned/agri3.jpg"
import fish from "../../../../public/owned/fishFarm2.jpg"

import * as FaIcons from "react-icons/fa";

import Image from "next/image";
import {
  FaTruck,
  FaStore,
  FaHotel,
  FaUtensils,
  FaCheckCircle,
  FaLeaf,
  FaShippingFast,
  FaDrumstickBite,
} from "react-icons/fa";

import {
  MdRestaurant,
  MdHealthAndSafety,
} from "react-icons/md";

import styles from "../../../css/service.module.css";
import Loading from '@/adminComponent/loading/Loading';
import LoadingForEndUser from '@/adminComponent/loading/LoadinfForEndUser';

const wholesaleClients = [
  {
    title: "Restaurants",
    icon: <MdRestaurant />,
    image:img2
  },
  {
    title: "Hotels",
    icon: <FaHotel />,
    image: agri,
  },
  {
    title: "Meat Shops",
    icon: <FaStore />,
    image: fish,
  },
  {
    title: "Caterers",
    icon: <FaUtensils />,
    image: agri,
  },
];




export default function ServicesMidSection({moreFeature, feature}) 
{




const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

  return (
    <section className={styles.servicesSection}>
      {/* WHOLESALE SECTION */}

      {/* <div className={styles.sectionPadding}>
        <div className={styles.wholesaleGrid}>
     

          <div>
            <p className={styles.sectionTag}>
              Bulk Chicken Supply
            </p>

            <h2 className={styles.sectionTitle}>
              Wholesale & Bulk Orders
            </h2>

            <p className={styles.sectionDescription}>
              We supply premium quality chicken in bulk quantities for
              restaurants, hotels, meat shops, caterers, and retail stores.
              Our farm ensures freshness, hygiene, and timely delivery every
              single day.
            </p>

         

            <div className={styles.benefitsList}>
              {[
                "Consistent Supply",
                "Competitive Pricing",
                "Timely Delivery",
              ].map((item, index) => (
                <div
                  key={index}
                  className={styles.benefitItem}
                >
                  <div className={styles.benefitIcon}>
                    <FaCheckCircle />
                  </div>

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

   

          <div className={styles.clientsGrid}>
            {wholesaleClients.map((item, index) => (
              <div
                key={index}
                className={styles.clientCard}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.clientImage}
                />

                <div className={styles.clientOverlay} />

                <div className={styles.clientContent}>
                  <div className={styles.clientIcon}>
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
{
  Array.isArray(feature) ? (
    feature?.map((item, index) => {
    const isImageLeft = index % 2 === 0;

    return (
      <div key={item.id} className={styles.freshSection}>
        <div className={styles.freshGrid}>

          {/* IMAGE LEFT */}
          {isImageLeft && (
            <div className={styles.freshImageWrapper}>
  
              <img
                src={`${BASE_URL}${item.image}`}
                alt={item.imageTitle}
            
                className={styles.freshImage}
              />

              <div className={styles.freshOverlay} />

              <div className={styles.freshContent}>
                <h3>{item.imageTitle}</h3>
                <p>{item.imagePara}</p>
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div>
            <p className={styles.sectionTag}>
              {item.slogan}
            </p>

            <h2 className={styles.sectionTitle}>
              {item.title}
            </h2>

            <p className={styles.sectionDescription}>
              {item.paragraph}
            </p>

            <div className={styles.chickenGrid}>
              {item.icons?.map((iconItem) => {
                const Icon =
                  FaIcons[iconItem.icon] ||
                  FaIcons.FaCheckCircle;

                return (
                  <div
                    key={iconItem.id}
                    className={styles.chickenCard}
                  >
                    <div className={styles.chickenIcon}>
                      <Icon />
                    </div>

                    <h4>{iconItem.text}</h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IMAGE RIGHT */}
          {!isImageLeft && (
            <div className={styles.freshImageWrapper}>
        
              <img
                src={`${BASE_URL}${item.image}`}
                alt={item.imageTitle}
                
                className={styles.freshImage}
              />

              <div className={styles.freshOverlay} />

              <div className={styles.freshContent}>
                <h3>{item.imageTitle}</h3>
                <p>{item.imagePara}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  })
  ):(
    <LoadingForEndUser />
  )
}

      {/* WHY CHOOSE US */}
      <div className={styles.whySection}>
        <div className={styles.whyHeader}>
          <p className={styles.sectionTag}>
            Why Customers Trust Us
          </p>

          <h2 className={styles.sectionTitle}>
            Why Choose Our Poultry Farm
          </h2>
        </div>

        {/* CARDS */}

{
  Array.isArray(moreFeature) ? (
    <div className={styles.whyGrid}>
      {moreFeature.map((item, index) => (
        <div
          key={item.id || index}
          className={styles.whyCard}
        >
          <div className={styles.whyGlow} />

          <div className={styles.whyIcon}>
            {item?.icon}
          </div>

          <h3>{item?.paragraph}</h3>

          <p>
            We maintain high-quality poultry farming standards with fresh
            supply, hygienic processing, and customer-first service.
          </p>
        </div>
      ))}
    </div>
  ) : (
   <LoadingForEndUser />
  )
}
      </div>
    </section>
  );
}