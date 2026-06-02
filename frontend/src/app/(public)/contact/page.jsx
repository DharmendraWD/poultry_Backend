

export const dynamic = 'force-dynamic';
import Link from "next/link";
import styles from "../../../css/contact.module.css";
import {
  FaFacebook,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";


async function getcontactUs() {
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
    return {};
   console.log(error);
  }
 }




export default async function ContactUs() {
const miscellaneousData = await getcontactUs();

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h2>Get in Touch</h2>
          <p>
            Fresh chicken orders, wholesale supply, or general inquiries —
            we are here to help you anytime.
          </p>
        </div>

        {/* SOCIAL CARDS */}
        <div className={styles.socialGrid}>

          {/* FACEBOOK */}
          <a
            href={miscellaneousData?.facebook}
            target="_blank"
            className={styles.socialCard}
          >
            <FaFacebook className={styles.fbIcon} />

            <div>
              <h3>Facebook</h3>
              <p>Follow our updates & farm activities</p>
            </div>
          </a>

          {/* WHATSAPP */}
          {/* <a
            href={`https://wa.me/${miscellaneousData?.whatsapp}?text=Hello, I'm interested in your products.`}
            target="_blank"
            className={styles.socialCard}
          >
            <FaWhatsapp className={styles.waIcon} />

            <div>
              <h3>WhatsApp</h3>
              <p>Chat for quick orders & delivery</p>
            </div>
          </a> */}

          {/* PHONE */}
            <Link href={`tel:${miscellaneousData?.mobilenum1}`} className={styles.socialCard}>
          <div >
            <FaPhoneAlt className={styles.icon} />

                      <div>
Click to call {miscellaneousData?.mobilenum1}
</div>
    
          </div>
            </Link>

          {/* EMAIL */}
          <Link href={`mailto:${miscellaneousData?.email}`} className={styles.socialCard}>
            <FaEnvelope className={styles.icon} />
            <div>
              <h3>Email</h3>
              <p>{miscellaneousData?.email}</p>
            </div>
          </Link>


        </div>

        {/* FORM SECTION */}
        {/* <div className={styles.formWrapper}>
          <div className={styles.formInfo}>
            <h3>Send Us a Message</h3>
            <p>
              Fill out the form and we will contact you for orders or inquiries.
            </p>

            <div className={styles.location}>
              <FaMapMarkerAlt />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

        
          <form className={styles.form}>
            <input type="text" placeholder="Your Name" required />
            <input type="text" placeholder="Your Address" required />
            <input type="tel" placeholder="Phone Number" required />
            <textarea placeholder="Your Message" rows="5"></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div> */}

      </div>
    </section>
  );
}