'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getFeatureCard, deleteFeatureCard } from '@/services/featureCardApi';

import FeatureCardForm from './FeatureCardForm';
import styles from '../hero/hero.module.css';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import { MdGrass } from 'react-icons/md';
import { GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat } from 'react-icons/gi';
import { FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';

const icons = {
  // Poultry
  GiChicken,
  FaEgg,
  GiDuck,
  MdGrass,

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


export default function FeatureCardTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getFeatureCard(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading feature cards..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading feature cards: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteFeatureCard(id);
    setDataList((prev) => prev.filter((item) => item.id !== id));
    handleApiMessage(res?.message);
    setOpen(false);
    setId(null);
  };

  return (
    <div className={styles.container}>

      <ConfirmBox
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        icon={<FiTrash2 />}
        title="Delete this feature card?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feature Card"
        description="Manage Feature Card Section"
        icon={<FiBarChart2 />}
      >
        <FeatureCardForm
          key={editingItem?.id ?? 'create'}
          initialData={editingItem}
          mode={editingItem ? 'edit' : 'create'}
          onSuccess={(updated) => {
            if (!updated?.id) return;

            if (editingItem) {
              setDataList((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
              );
            } else {
              setDataList((prev) => [updated, ...prev]);
            }

            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      </ReusableModal>

      <div className={styles.header}>
        <div className={styles.buttonWrapper}>
          <div>
            <h1 className={styles.title}>Feature Cards</h1>
            <p className={styles.subtitle}>Manage homepage feature card content</p>
          </div>
          <div>
            <button
              className={styles.addButton}
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
            >
              <FiPlus /> Add
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
                <th>Icon</th>
                <th>Color</th>
                <th>Title</th>
                <th>Body</th>
                <th>Active</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataList) &&
                dataList.length > 0 &&
                dataList.filter(Boolean).map((item) => (
                 <tr key={item?.id}>
  <td>#{item?.id}</td>

  {/* ICON FIXED */}
  <td>
    {icons[item.icon] ? (() => {
      const Icon = icons[item.icon];
      return <Icon className={styles.icon + ' ' + styles.tableIcon} />;
    })() : null}
  </td>

  {/* COLOR */}
  <td>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          background: item?.icon_color || '#e5e7eb',
          border: '1px solid #e5e7eb',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 12 }}></span>
    </div>
  </td>

  <td>{item?.title}</td>
  <td>{item?.body}</td>
  <td>{item?.active ? 'Yes' : 'No'}</td>
  <td>{new Date(item.created_at).toLocaleDateString()}</td>
       <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.btn} ${styles.btnEdit}`}
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEdit className="text-xl text-blue-500 hover:text-blue-600 hover:scale-110" />
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger}`}
                          onClick={() => {
                            setId(item.id);
                            setOpen(true);
                          }}
                        >
                          <MdDelete className="text-xl hover:text-red-600 hover:scale-110" />
                        </button>
                      </div>
                    </td>
</tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}