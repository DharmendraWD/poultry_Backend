'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getTicker, deleteTicker } from '@/services/tickerApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import TickerForm from './TickerForm';
import styles from '../hero/hero.module.css';

export default function TickerTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error, refetch } = useApi(() => getTicker(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading ticker items..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading ticker: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteTicker(id);
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
        title="Delete this ticker item?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ticker"
        description="Manage Ticker Section"
        icon={<FiBarChart2 />}
      >
        <TickerForm
          key={editingItem?.id ?? 'create'}
          initialData={editingItem}
          mode={editingItem ? 'edit' : 'create'}
          onSuccess={(result) => {
            if (editingItem) {
              // single item updated
              if (!result?.id) return;
              setDataList((prev) =>
                prev.map((item) =>
                  item.id == result.id ? result : item
                )
              );
            } else {
              // bulk create — result is array of new items with temp ids
              setDataList((prev) => [...result, ...prev]);
            }
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      </ReusableModal>

      <div className={styles.header}>
        <div className={styles.buttonWrapper}>
          <div>
            <h1 className={styles.title}>Ticker</h1>
            <p className={styles.subtitle}>Manage homepage ticker items</p>
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
                <th>Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataList) &&
                dataList.length > 0 &&
                dataList.filter(Boolean).map((item) => (
                  <tr key={item?.id}>
                    <td>
                      {String(item?.id).startsWith('tmp_')
                        ? <span style={{ color: '#9ca3af', fontSize: 12 }}>pending</span>
                        : `#${item?.id}`}
                    </td>
                    <td>{item?.text}</td>
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