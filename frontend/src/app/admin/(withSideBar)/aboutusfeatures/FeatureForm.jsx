'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createFeature, updateFeature } from '@/services/aboutus/aboutusApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

// Common emoji/icon options — extend as needed
const ICON_OPTIONS = [
  '🌟', '🚀', '💡', '✅', '🎯', '🔥', '💪', '🏆',
  '🌍', '📈', '👥', '🎉', '⭐', '🛡️', '⚡', '🌱',
  '🤝', '💼', '🔬', '🏅', '🎁', '📦', '🌿', '🐔',
];

export default function FeatureForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    icon: '',
    paragraph: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        icon:      initialData.icon      || '',
        paragraph: initialData.paragraph || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res;

      if (mode === 'edit') {
        res = await updateFeature(initialData.id, form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
          created_at: initialData.created_at,
        });
      } else {
        res = await createFeature(form);
        handleApiMessage(res?.message);
        onSuccess?.(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* Icon select + live preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <select
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className={styles.input}
          style={{ flex: 1 }}
          required
        >
          <option value="">Select Icon</option>
          {ICON_OPTIONS.map((emoji) => (
            <option key={emoji} value={emoji}>
              {emoji}
            </option>
          ))}
        </select>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            border: '1.5px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            flexShrink: 0,
            background: '#f9fafb',
          }}
        >
          {form.icon || '?'}
        </div>
      </div>

      <textarea
        name="paragraph"
        value={form.paragraph}
        onChange={handleChange}
        placeholder="Feature paragraph"
        className={styles.input}
        rows={4}
        required
      />

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}