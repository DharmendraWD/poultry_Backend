'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiEdit, FiBarChart2 } from 'react-icons/fi';

import {
  getHomeCard,
  deleteHomeCard,
} from '@/services/homeCardApi';

import FirstCardForm from './FirstCardForm';
import styles from '../hero/hero.module.css';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { handleApiMessage, HandleApiMessage } from '@/adminComponent/ToastMessageHandler';

export default function FirstCardTable() {
  const [dataList, setDataList] = useState([]);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getHomeCard(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading cards..." />;

  if (error)
    return (
      <div className="text-red-500 p-10">
        Error loading cards: {error}
      </div>
    );

  /* DELETE */
  const handleDelete = async () => {
  let res =   await deleteHomeCard(id);

    setDataList((prev) => prev.filter((item) => item.id !== id));
        handleApiMessage(res?.message);

    setOpen(false);
    setId(null);
  };

  return (
    <div className={styles.container}>

      {/* CONFIRM */}
      <ConfirmBox
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        icon={<FiTrash2 />}
        title="Delete this card?"
        description="This action cannot be undone."
      />

      {/* MODAL */}
      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="First Card"
        description={"Manage Card Section"}
             icon={<FiBarChart2  />}
     
      >
        <FirstCardForm
          key={editingItem?.id ?? 'create'}
          initialData={editingItem}
          mode={editingItem ? 'edit' : 'create'}
onSuccess={(updated) => {
  if (!updated?.id) return;

  if (editingItem) {
    setDataList((prev) =>
      prev.map((item) =>
        item.id === updated.id ? updated : item
      )
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
         <h1 className={styles.title}>Hero Sections</h1>
        <p className={styles.subtitle}>
          Manage homepage hero content
        </p>
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
            <th>Title</th>
            <th>Time</th>
            <th>Days</th>
            <th>Body</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
            {
                Array.isArray(dataList) && dataList.length > 0 && (
             
          dataList
  ?.filter(Boolean)  
  .map((item) => (
    <tr key={item?.id}>
  
              <td>#{item?.id}</td>
              <td>{item?.title}</td>
              <td>{item?.timee}</td>
              <td>{item?.days}</td>
              <td>{item?.body}</td>

              <td>
                {new Date(item.created_at).toLocaleDateString()}
              </td>

              <td>
                <div className={styles.actions}>
                <button
                className={`${styles.btn} ${styles.btnEdit}`} 
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                >
              <FaEdit className='text-xl faEdit text-blue-500hover:text-blue-600 hover:scale-110'/>  
                </button>

                <button
                className={`${styles.btn} ${styles.btnDanger}`} 
                  onClick={() => {
                    setId(item.id);
                    setOpen(true);
                  }}
                >
                      <MdDelete className='text-xl hover:text-red-600 hover:scale-110' />
                </button>
                </div>  
              </td>
      
        </tr>
          ))
                )
            }
        </tbody>
      </table>
        </div>
      </div>
    </div>
  );
}