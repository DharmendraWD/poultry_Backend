

import { FaLocationArrow, FaPhoneSquare } from "react-icons/fa";
import logo from "../../public/logo-cheeky2.png"
import styles from "../css/footer.module.css";
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { IoMdCall } from "react-icons/io";

async function getmiscellaneousData() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/home/site-settings`,
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


export default async function Footer() {
//   const phoneNumber = "+9779840914606";

// const message = `
// Hello
// `;
// const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

const miscellaneousData = await getmiscellaneousData();

const BASE_CONTENT_URL = process.env.BASE_CONTENT_URL;


  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.col}>
          <div className={styles.logoWrap}>
            <div className={styles.logoCircle}>
              <img src={BASE_CONTENT_URL + miscellaneousData?.logo} alt="logo" className={styles.logo} />
            </div>
            <h2 className={styles.logoText}>{miscellaneousData?.companyName}</h2>
          </div>

          <p className={styles.desc}>
            {miscellaneousData?.footerSlogan}
          </p>
        </div>

        {/* SERVICE */}
        <div className={styles.col}>
          <h3 className={styles.title}>Service</h3>
          <ul className={styles.list}>
            <Link href="/">Go to Home</Link>
            <Link href="/gallery">Our Gallery</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/Services">Services</Link>
          </ul>
        </div>

        {/* LINKS */}
        <div className={styles.col}>
          <h3 className={styles.title}>Further Links</h3>
          <ul className={styles.list}>
              {/* <Link 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
     className=""
    >
      Get In Touch on WhatsApp
    </Link> */}
          <Link href={`tel:${miscellaneousData?.mobilenum1}`} className="flex gap-1 items-center">
 Call Now
</Link>

          </ul>
        </div>

        {/* CONTACT */}
        <div className={styles.col}>
          <h3 className={styles.title}>Get In Touch</h3>

          <div className={styles.contact}>
<Link
  href={`https://www.google.com/maps/search/${encodeURIComponent(miscellaneousData?.location)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex gap-1 items-center"
>
  <FaLocationArrow />
  <span>{miscellaneousData?.address}</span>
</Link>
            <Link href={`tel:${miscellaneousData?.mobilenum1}`} className="flex gap-1 items-center">
            <FaPhoneSquare />
<span> Call Now</span>
</Link>
<Link
  href={`mailto:${miscellaneousData?.email}`}
  className="flex gap-1 items-center"
>
  <CiMail />
  <span>{miscellaneousData?.email}</span>
</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} {miscellaneousData?.companyName}. All rights reserved.
        </p>
        <p className={styles.developer}>
          Developed by{" "}
          <a href="https://www.aayusofttech.com.np" target="_blank" rel="noopener noreferrer">
            Aayu Softtech
          </a>
        </p>
      </div>
    </footer>
  );
}