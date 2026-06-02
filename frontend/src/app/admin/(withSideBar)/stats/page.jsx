'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getStats, deleteStats } from '@/services/statsApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import StatsForm from './StatsForm';
import styles from '../hero/hero.module.css';

export default function StatsTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getStats(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading stats..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading stats: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteStats(id);
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
        title="Delete this stat?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Stat"
        description="Manage Stats Section"
        icon={<FiBarChart2 />}
      >
        <StatsForm
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
            <h1 className={styles.title}>Stats</h1>
            <p className={styles.subtitle}>Manage homepage stats content</p>
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
                <th>Number</th>
                <th>Label</th>
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
                      <span style={{ fontSize: 24 }}>{item?.icon}</span>
                    </td>
                    <td>
                      <strong>{item?.number_text}</strong>
                    </td>
                    <td>{item?.label}</td>
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