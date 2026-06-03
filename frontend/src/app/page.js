
import Footer from "../includes/Footer";
import AboutUs from "./(public)/about/About";
import Features from "./(public)/home/about/Feature";
import WhyWait from "./(public)/home/about/WhyWait";
import Blog from "./(public)/home/blog/Blog";
import FreeRangeEggs from "./(public)/home/freeRangeEggSec/FreeRangeEggSec";
import Gallery from "./(public)/home/gallery/Gallery";
import Hero from "./(public)/home/hero/Hero";
import Navbar from "./(public)/home/hero/Navbar";
import Testimonials from "./(public)/home/testimonial/Testimonial";
import WhyChooseUs from "./(public)/home/whyChosose/WhyChoose";
import AOSInit from "./AOSInit";


export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Western Poultry Breeding Farm Pvt. Ltd.',
  description: 'Always Loyal and Honest. Premium farm products.',
};

async function getblog() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/home/product`,
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
async function getMiscellaneousData() {
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



export default async function HomePage() {
const blogData = await getblog();
const miscellaneousData = await getMiscellaneousData();
// console.log(blogData)

  return (
    <main>
      <Navbar></Navbar>
<AOSInit></AOSInit>
      <Hero />
      <WhyWait />
      <Features></Features>
        <WhyChooseUs miscellaneousData={miscellaneousData}></WhyChooseUs>
        <Testimonials></Testimonials>
        <FreeRangeEggs blogData={blogData}></FreeRangeEggs>
        <Blog blogData={blogData}></Blog>
      <Gallery></Gallery>
<Footer></Footer>
      
    </main>
  );
}