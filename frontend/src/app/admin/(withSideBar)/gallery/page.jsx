'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getGallery, deleteGallery } from '@/services/galleryApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import GalleryForm from './GalleryForm';
import styles from '../hero/hero.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

export default function GalleryTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getGallery(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading gallery..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading gallery: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteGallery(id);
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
        title="Delete this image?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gallery"
        description="Manage Gallery Section"
        icon={<FiBarChart2 />}
      >
        <GalleryForm
          key={editingItem?.id ?? 'create'}
          initialData={editingItem}
          mode={editingItem ? 'edit' : 'create'}
          onSuccess={(updated) => {
            if (!updated?.id) return;

            if (editingItem) {
              setDataList((prev) =>
                prev.map((item) =>
                  item.id == updated.id ? updated : item
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
            <h1 className={styles.title}>Gallery</h1>
            <p className={styles.subtitle}>Manage homepage gallery images</p>
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
                <th>Image</th>
                <th>Title</th>
                <th>Sort Order</th>
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
                    <td>
                      {(item?._imageBlob || item?.image) && (
                        <img
                          src={
                            item._imageBlob
                              ? item._imageBlob
                              : `${BASE_URL}/${item.image}`
                          }
                          alt={item.title}
                          style={{
                            width: 64,
                            height: 44,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #e5e7eb',
                          }}
                        />
                      )}
                    </td>
                    <td>{item?.title}</td>
                    <td>{item?.sort_order}</td>
                    <td>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: item?.is_active == 1 ? '#dcfce7' : '#fee2e2',
                          color: item?.is_active == 1 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {item?.is_active == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {item?.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : '—'}
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