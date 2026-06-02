'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getFeature, deleteFeature } from '@/services/aboutus/aboutusApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import FeatureForm from './FeatureForm';
import styles from '../hero/hero.module.css';

export default function FeatureTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(getFeature, { enabled: true });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading features..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading features: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteFeature(id);
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
        title="Delete this feature?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feature"
        description="Manage Features Section"
        icon={<FiBarChart2 />}
      >
        <FeatureForm
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
            <h1 className={styles.title}>Features</h1>
            <p className={styles.subtitle}>Manage features section content</p>
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
                <th>Paragraph</th>
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
                      <span style={{ fontSize: 22 }}>{item?.icon}</span>
                    </td>
                    <td
                      style={{
                        maxWidth: 320,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item?.paragraph}
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