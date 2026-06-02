'use client';

import { deleteHeroSection, getHeroSection } from '@/services/homeApi';
import styles from './hero.module.css';
import useApi from "@/hooks/useApi";
import Loading from '@/adminComponent/loading/Loading';
import { useEffect, useState } from 'react';
import { FiBarChart2, FiPlus, FiTrash2 } from 'react-icons/fi';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import HeroForm from './HeroFormModal';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat } from 'react-icons/gi';
import { FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';
import styles2 from "../../../../css/hero.module.css";

export default function HeroTable() {
  const imageBasePath = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;
  const [editingHero, setEditingHero] = useState(null);
// http://localhost:5001/uploads/
const icons = {
  // Poultry
  GiChicken,
  FaEgg,
  GiDuck,

  // Livestock
  GiCow,
  GiGoat,
  GiPig,
  GiRabbit,
  GiSheep,

  // Fish Farming
  FaFish,
  GiFishCorpse,
  GiFishingNet,

  // Agriculture
  FaLeaf,
  FaSeedling,
  GiWheat,
  GiCorn,
  FaCarrot,
  FaAppleAlt,
  GiFruitTree,
  GiFruitBowl,
  GiPlantRoots,

  // Farming Equipment
  GiFarmTractor,
  FaTractor,
  GiWateringCan,
  GiBarn,
  GiFarmer,

  // Others
  GiBee,
};
  const [open, setOpen] = useState(false);
  const [id, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroData, setHeroData] = useState([]);
 // API DATA 
const {
  data,
  loadingApi,
  error,
  success,
} = useApi(
  () => getHeroSection(),
  {
    enabled: true,
  }
);

useEffect(() => {
  if (data) {
    setHeroData(data?.data || []);
  }
}, [data]);

{
  if (loadingApi) {
    return (
<Loading text={"Hero Section Loading..."}/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <span className="text-red-500">Error loading hero sections: {error}</span>
      </div>
    );
  }
}


const handleDelete = async () => {
  if (id) {
    try {
      await deleteHeroSection(id);

      setHeroData((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    }
  }
};



const handleCancelDelete = () => {
  setOpen(false);
}
  return (
    <div className={styles.container}>
       <ConfirmBox
         isOpen={open}
         onClose={() => setOpen(false)}
         onConfirm={handleDelete}
         onCancel={handleCancelDelete}
         icon={<FiTrash2 />}
         title="Delete this item?"
         description="This action cannot be undone and the data will be permanently removed."
         confirmText="Delete"
         cancelText="Cancel"
       />

       {/*edit poupu  */}
  
      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={<FiBarChart2 />}
        title="Hero Section"
        description="Create or edit homepage hero section content. "
      >
        <div className={styles.formWrapper}>
          <HeroForm

 key={editingHero?.id ?? 'create'}   // ← forces remount
  initialData={editingHero}
  mode={editingHero ? 'edit' : 'create'}
  onSuccess={(savedData) => {
    if (editingHero) {
      setHeroData((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(savedData.id) ? savedData : item
        )
      );
    } else {
      setHeroData((prev) => [savedData, ...prev]);
    }
    setIsModalOpen(false);
  }}
/>
        </div>
      </ReusableModal>
   


      <div className={styles.header}>
<div className={styles.buttonWrapper}>
     <div>
         <h1 className={styles.title}>Hero Sections</h1>
        <p className={styles.subtitle}>
          Manage homepage hero content
        </p>
   </div>
    
<div>
     <button className={styles.addButton}
    onClick={() => {
    setEditingHero(null);
    setIsModalOpen(true);
  }}
     >
      <span className={styles.iconWrapper}>
        <FiPlus className={styles.icon} />
      </span>

      <span>Add</span>
    </button>
</div>
</div>

      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tab</th>
                <th>Icon</th>
                <th>Short Decs</th>
                <th>Headline</th>
                <th>Label</th>
                <th>Color</th>
                <th>Image</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
             {
              Array.isArray(heroData) ? 
               heroData?.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>

                  <td>
                    <span className={styles.badge}>
                      {item.tab}
                    </span>
                  </td>

                  <td className={styles.textSmall}>
                    {icons[item.tab_icon] &&
  (() => {
    const Icon = icons[item.tab_icon];
    return <Icon className={styles.tableIcon} />;
  })()
}

                  </td>

                  <td>{item.sub}</td>
                  <td>{item.headline}</td>

                  <td>
                    <span className={styles.badgeDark}>
                      {item.label}
                    </span>
                  </td>

                  <td>
                    <div className={styles.colorBox}>
                      <span
                        className={styles.colorDot}
  style={{ background: `var(--${item.color.replace('tab--', '').replace('-', '')})` }}
                      />
<span
  className={styles.textSmall}
  style={{ color: `var(--${item.color.replace('tab--', '').replace('-', '')})` }}
>
  {/* {item.color} */}
</span>
                    </div>
                  </td>

                  <td>
                    <img
                      src={heroData ? imageBasePath +"/" + item?.image : 'not found'}
                      className={styles.image}
                      alt="img"
                    />
                  </td>

                  <td className={styles.textSmall}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button className={styles.btn}
                      onClick={
                        ()=>{
                         setEditingHero(item);
setIsModalOpen(true);
                        }
                      }
                      >
                      <FaEdit className='text-xl faEdit text-blue-500hover:text-blue-600 hover:scale-110'/>  
                      </button>
                      <button className={`${styles.btn} ${styles.btnDanger}`} onClick={
                        () => {
                          setSelectedId(item.id);
                          setOpen(true);
                        }
                      }>
                        <MdDelete className='text-xl hover:text-red-600 hover:scale-110' />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : null
             }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}