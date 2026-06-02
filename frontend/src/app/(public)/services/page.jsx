
export const dynamic = 'force-dynamic';
import React from 'react'
import FarmExperience from './ServicePage'



const BASE_URL = process.env.BASE_URL;

async function getData() {
 try {
   const res = await fetch(
   `${process.env.BASE_URL}/service/detail-box`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data;
 } catch (error) {
  console.log(error);
 }
}

async function getServiceFeature() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/service/features`,
     {
       cache: "no-store",
     }
   );

   const data = await res.json();
   return data;
  } catch (error) {
   console.log(error);
  }
 }
async function getServiceFixedContent() {
  try {
    const res = await fetch(
     `${process.env.BASE_URL}/service/fixed-content`,
     {
       cache: "no-store",
     }
   );

   const data = await res.json();
   return data;
  } catch (error) {
   console.log(error);
  }
 }


const page = async () => {
 const moreFeature = await getData();
 const feature = await getServiceFeature();
 const serviceFixedContent = await getServiceFixedContent();


  return (
  <>
  <FarmExperience 
   moreFeature={moreFeature?.data} 
   feature={feature?.data} 
   serviceFixedContent={serviceFixedContent?.data}
   />
  </>
  )
}

export default page