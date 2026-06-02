'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createTestimonial, updateTestimonial } from '@/services/testimonialApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TestimonialForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  const emptyForm = {
    name: '',
    body: '',
    stars: '5',
    image: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        body: initialData.body || '',
        stars: initialData.stars || '5',
        image: initialData.image || null,
      });
      setAvatarPreview(
        initialData.image ? `${BASE_URL}/${initialData.image}` : null
      );
    } else {
      setForm(emptyForm);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('body', form.body);
      payload.append('stars', form.stars);

      payload.append('image', avatarFile);

      let res;

      if (mode === 'edit') {
        res = await updateTestimonial(initialData.id, payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: initialData.id,
          // keep existing image path unless new file uploaded
          image: avatarFile
            ? `testimonial/${avatarFile.name}` // approximate; table shows preview from blob
            : initialData.image,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
          // pass blob URL so table shows new image immediately
          _imageBlob: avatarFile ? avatarPreview : null,
        });
      } else {

        res = await createTestimonial(payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: res.data.result.insertId,       // ← nested: data.result.insertId
          image: null,
          _imageBlob: avatarPreview,          // blob URL for immediate preview
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(form)
  console.log(avatarFile)
  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className={styles.input}
        required
      />

      <textarea
        name="body"
        value={form.body}
        onChange={handleChange}
        placeholder="Body"
        className={styles.input}
        required
      />

      {/* Stars select */}
      <select
        name="stars"
        value={form.stars}
        onChange={handleChange}
        className={styles.input}
        required
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <option key={s} value={s}>
            {'★'.repeat(s)}{'☆'.repeat(5 - s)} ({s})
          </option>
        ))}
      </select>

      {/* Avatar upload + preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.input}
          style={{ flex: 1 }}
          {...(mode === 'create' ? { required: true } : {})}
        />
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="avatar preview"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
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