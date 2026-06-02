'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createServiceFeature, updateServiceFeature } from '@/services/service/serviceFeature';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

// ── React Icons map — add more as needed ──
import * as Gi from 'react-icons/gi';
import * as Fa from 'react-icons/fa';
import * as Fa6 from 'react-icons/fa6';
import * as Md from 'react-icons/md';
import * as Bi from 'react-icons/bi';
import * as Hi from 'react-icons/hi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

// Curated list of icon options grouped by library
const ICON_OPTIONS = [
  // Poultry / farming theme
  'GiChicken', 'GiRooster', 'GiEggClutch', 'GiCow', 'GiPig', 'GiFishingBoat',
  'GiWheat', 'GiPlantRoots', 'GiGrass', 'GiFarmer',
  // Nature / food
  'FaLeaf', 'FaSeedling', 'FaFish', 'FaAppleAlt', 'FaCarrot',
  'FaDrumstickBite', 'FaEgg', 'FaTree',
  // Business / general
  'FaAward', 'FaTrophy', 'FaStar', 'FaHandshake', 'FaUsers',
  'FaShieldAlt', 'FaCheckCircle', 'FaHeart', 'FaThumbsUp',
  'FaTruck', 'FaBoxOpen', 'FaWarehouse',
  // Medical / health
  'MdHealthAndSafety', 'MdScience', 'MdNaturePeople',
  // Modern
  'BiSolidBadgeCheck', 'HiSparkles',
];

// Resolve icon name string → component
function resolveIcon(name) {
  if (!name) return null;
  return Gi[name] || Fa[name] || Fa6[name] || Md[name] || Bi[name] || Hi[name] || null;
}

const emptyForm = {
  slogan: '',
  title: '',
  paragraph: '',
  imageTitle: '',
  imagePara: '',
  shortOrder: '',
};

export default function ServiceFeatureForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // icon rows
  const [icons, setIcons] = useState([{ id: Date.now(), icon: '', text: '' }]);

  // image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        slogan:     initialData.slogan     || '',
        title:      initialData.title      || '',
        paragraph:  initialData.paragraph  || '',
        imageTitle: initialData.imageTitle || '',
        imagePara:  initialData.imagePara  || '',
        shortOrder: initialData.shortOrder ?? '',
      });
      setIcons(
        Array.isArray(initialData.icons) && initialData.icons.length > 0
          ? initialData.icons.map((ic) => ({
              id: ic.id ?? Date.now() + Math.random(),
              icon: ic.icon || '',
              text: ic.text || '',
            }))
          : [{ id: Date.now(), icon: '', text: '' }]
      );
      if (initialData.image) {
        setImagePreview(`${BASE_URL}${initialData.image}`);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      setForm(emptyForm);
      setIcons([{ id: Date.now(), icon: '', text: '' }]);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Icon row helpers ──
  const addIconRow = () => {
    setIcons((prev) => [...prev, { id: Date.now(), icon: '', text: '' }]);
  };

  const removeIconRow = (rowId) => {
    setIcons((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((r) => r.id !== rowId);
    });
  };

  const handleIconChange = (rowId, field, value) => {
    setIcons((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const validIcons = icons.filter((r) => r.icon.trim() || r.text.trim());

      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      // send icons as JSON string
      payload.append('icons', JSON.stringify(
        validIcons.map(({ icon, text }) => ({ icon, text }))
      ));
      if (imageFile) payload.append('image', imageFile);

      let res;

      if (mode === 'edit') {
        res = await updateServiceFeature(initialData.id, payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
          icons: validIcons.map(({ icon, text }) => ({ icon, text })),
          created_at: initialData.created_at,
          _imageBlob: imageFile ? imagePreview : null,
        });
      } else {
        res = await createServiceFeature(payload);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: res.data.id,
          icons: validIcons.map(({ icon, text }) => ({ icon, text })),
          image: null,
          _imageBlob: imagePreview,
          shortOrder: form.shortOrder,
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* ── Main fields ── */}
      <input
        name="slogan"
        value={form.slogan}
        onChange={handleChange}
        placeholder="Slogan"
        className={styles.input}
        required
      />

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className={styles.input}
        required
      />

      <textarea
        name="paragraph"
        value={form.paragraph}
        onChange={handleChange}
        placeholder="Paragraph"
        className={styles.input}
        rows={3}
        required
      />

      <input
        name="imageTitle"
        value={form.imageTitle}
        onChange={handleChange}
        placeholder="Image Title"
        className={styles.input}
      />

      <textarea
        name="imagePara"
        value={form.imagePara}
        onChange={handleChange}
        placeholder="Image Paragraph"
        className={styles.input}
        rows={2}
      />

      {/* <input
        name="shortOrder"
        value={form.shortOrder}
        onChange={handleChange}
        placeholder="Sort Order (e.g. 1)"
        className={styles.input}
        type="number"
      /> */}

      {/* ── Image upload ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#f3f4f6',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <FiImage size={14} />
          {imagePreview ? 'Change Image' : 'Upload Image'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{
              width: 64,
              height: 48,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1.5px solid #e5e7eb',
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* ── Icons section ── */}
      <div
        style={{
          borderTop: '1.5px solid #f0f0f0',
          paddingTop: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Icons
        </div>

        {icons.map((row, index) => {
          const ResolvedIcon = resolveIcon(row.icon);
          return (
            <div
              key={row.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fafafa',
                border: '1.5px solid #f0f0f0',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              {/* Row number */}
              <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 16 }}>
                {index + 1}.
              </span>

              {/* Icon select */}
              <select
                value={row.icon}
                onChange={(e) => handleIconChange(row.id, 'icon', e.target.value)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 13,
                  background: '#fff',
                  color: '#111827',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Select Icon</option>
                {ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Icon preview */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 7,
                  border: '1.5px solid #e5e7eb',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#374151',
                  flexShrink: 0,
                }}
              >
                {ResolvedIcon ? <ResolvedIcon /> : <span style={{ color: '#d1d5db' }}>?</span>}
              </div>

              {/* Text input */}
              <input
                value={row.text}
                onChange={(e) => handleIconChange(row.id, 'text', e.target.value)}
                placeholder="Label text"
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 13,
                  background: '#fff',
                  color: '#111827',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />

              {/* Remove row */}
              <button
                type="button"
                onClick={() => removeIconRow(row.id)}
                disabled={icons.length === 1}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: icons.length === 1 ? 'not-allowed' : 'pointer',
                  color: icons.length === 1 ? '#d1d5db' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  flexShrink: 0,
                }}
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          );
        })}

        {/* Add icon row */}
        <button
          type="button"
          onClick={addIconRow}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'none',
            border: '1.5px dashed #d1d5db',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: '#6b7280',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <FiPlus size={14} /> Add Icon Row
        </button>
      </div>

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}