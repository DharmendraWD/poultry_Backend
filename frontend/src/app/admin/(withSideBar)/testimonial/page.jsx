'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';

import { getTestimonial, deleteTestimonial } from '@/services/testimonialApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import TestimonialForm from './TestimonialForm';
import styles from '../hero/hero.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL; 

export default function TestimonialTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getTestimonial(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading testimonials..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading testimonials: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteTestimonial(id);
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
        title="Delete this testimonial?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Testimonial"
        description="Manage Testimonials Section"
        icon={<FiBarChart2 />}
      >
        <TestimonialForm
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
            <h1 className={styles.title}>Testimonials</h1>
            <p className={styles.subtitle}>Manage homepage testimonials content</p>
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
                <th>Avatar</th>
                <th>Name</th>
                <th>Stars</th>
                <th>Body</th>
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
                    <td>
                      {item && (
                        <img
                          src={`${BASE_URL}/${item.avatar}`}
                          alt={item.name}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb',
                          }}
                        />
                        
                      )}
                    </td>
                    <td>{item?.name}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            style={{
                              color: i < Number(item?.stars) ? '#f59e0b' : '#e5e7eb',
                              fontSize: 13,
                            }}
                          />
                        ))}
                      </div>
                    </td>
                    <td>{item?.body}</td>
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