'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getServiceFeatures, deleteServiceFeature } from '@/services/service/serviceFeature';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import ServiceFeatureForm from './ServiceFeatureForm';
import styles from '../hero/hero.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

export default function ServiceFeaturesTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(getServiceFeatures, { enabled: true });

  useEffect(() => {
    if (data?.data) setDataList(data.data);
  }, [data]);

  if (loadingApi) return <Loading text="Loading service features..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading features: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteServiceFeature(id);
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title="Service Feature"
        description="Manage Service Features"
        icon={<FiBarChart2 />}
      >
        <ServiceFeatureForm
          key={editingItem?.id ?? 'create'}
          initialData={editingItem}
          mode={editingItem ? 'edit' : 'create'}
          onSuccess={(updated) => {
            if (!updated?.id) return;
            if (editingItem) {
              setDataList((prev) =>
                prev.map((item) => item.id == updated.id ? updated : item)
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
            <h1 className={styles.title}>Service Features</h1>
            <p className={styles.subtitle}>Manage service feature cards with icons</p>
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
                <th>Slogan</th>
                <th>Title</th>
                <th>Paragraph</th>
                <th>Image Title</th>
                <th>Icons</th>
                <th>Order</th>
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
                      {(item?._imageBlob || item?.image) ? (
                        <img
                          src={item._imageBlob ?? `${BASE_URL}${item.image}`}
                          alt={item.title}
                          style={{
                            width: 52,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #e5e7eb',
                          }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ color: '#d1d5db', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>{item?.slogan}</td>
                    <td><strong>{item?.title}</strong></td>
                    <td
                      style={{
                        maxWidth: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item?.paragraph}
                    </td>
                    <td>{item?.imageTitle}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {Array.isArray(item?.icons) && item.icons.length > 0 ? (
                          item.icons.map((ic, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: 11,
                                background: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                padding: '2px 7px',
                                color: '#374151',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {ic.icon} · {ic.text}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#d1d5db', fontSize: 12 }}>None</span>
                        )}
                      </div>
                    </td>
                    <td>{item?.shortOrder}</td>
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