'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createGallery, updateGallery } from '@/services/galleryApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

export default function GalleryForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const emptyForm = {
    title: '',
    sort_order: '',
    is_active: '1',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        sort_order: initialData.sort_order || '',
        is_active: String(initialData.is_active ?? '1'),
      });
      setImagePreview(
        initialData.image ? `${BASE_URL}/${initialData.image}` : null
      );
      setImageFile(null);
    } else {
      setForm(emptyForm);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = new FormData();
      Object.entries(form).forEach(([key, val]) => payload.append(key, val));
      if (imageFile) payload.append('image', imageFile);

      let res;

      if (mode === 'edit') {
        res = await updateGallery(initialData.id, payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
          _imageBlob: imageFile ? imagePreview : null,
        });
      } else {
        res = await createGallery(payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _imageBlob: imagePreview,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className={styles.input}
        required
      />

      <input
        name="sort_order"
        value={form.sort_order}
        onChange={handleChange}
        placeholder="Sort Order (e.g. 1)"
        className={styles.input}
        type="number"
      />

      <select
        name="is_active"
        value={form.is_active}
        onChange={handleChange}
        className={styles.input}
      >
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>

      {/* Image upload + preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.input}
          style={{ flex: 1 }}
          {...(mode === 'create' ? { required: true } : {})}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{
              width: 72,
              height: 52,
              objectFit: 'cover',
              borderRadius: 6,
              border: '2px solid #e5e7eb',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}