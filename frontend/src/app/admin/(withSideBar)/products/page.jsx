'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';

import Loading from '@/adminComponent/loading/Loading';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';

import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { getProduct, deleteProduct } from '@/services/productApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import ProductForm from './ProductForm';
import styles from '../hero/hero.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

export default function ProductTable() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, loadingApi, error } = useApi(() => getProduct(), {
    enabled: true,
  });

  useEffect(() => {
    if (data?.data) {
      setDataList(data.data);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading products..." />;
  if (error)
    return <div className="text-red-500 p-10">Error loading products: {error}</div>;

  const handleDelete = async () => {
    const res = await deleteProduct(id);
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
        title="Delete this product?"
        description="This action cannot be undone."
      />

      <ReusableModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Product"
        description="Manage Products Section"
        icon={<FiBarChart2 />}
      >
        <ProductForm
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
            <h1 className={styles.title}>Products</h1>
            <p className={styles.subtitle}>Manage homepage product content</p>
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
                <th>Subtitle</th>
                <th>Button</th>
                <th>Order</th>
                <th>Active</th>
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
              width: 48,
              height: 38,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
            }}
          />
        )}
      </td>

      <td>{item?.title}</td>
      <td>{item?.subtitle}</td>

      <td>
        <a
          href={item?.button_link}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#3b82f6', fontSize: 13 }}
        >
          {item?.button_text}
        </a>
      </td>

      <td>{item?.sort_order}</td>

      <td>
        <span
          style={{
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            background:
              item?.is_active == 1 ? '#dcfce7' : '#fee2e2',
            color:
              item?.is_active == 1 ? '#16a34a' : '#dc2626',
          }}
        >
          {item?.is_active == 1 ? 'Active' : 'Inactive'}
        </span>
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