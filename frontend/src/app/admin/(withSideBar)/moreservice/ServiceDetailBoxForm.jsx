'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createServiceDetailBox, updateServiceDetailBox } from '@/services/service/serviceFeature';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

const ICON_OPTIONS = [
  '🌟', '🚀', '💡', '✅', '🎯', '🔥', '💪', '🏆',
  '🌍', '📈', '👥', '🎉', '⭐', '🛡️', '⚡', '🌱',
  '🤝', '💼', '🔬', '🏅', '🎁', '📦', '🌿', '🐔',
  '🐄', '🐟', '🌾', '🥚', '🍃', '🏡', '⚙️', '📋',
];

export default function ServiceDetailBoxForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    icon: '',
    paragraph: '',
    shortOrder: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        icon:       initialData.icon       || '',
        paragraph:  initialData.paragraph  || '',
        shortOrder: initialData.shortOrder ?? '',
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
        res = await updateServiceDetailBox(initialData.id, form);
        handleApiMessage(res?.message);
        // edit returns "Success" string, not a record — use form state
        onSuccess?.({
          ...form,
          id: initialData.id,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
        });
      } else {
        res = await createServiceDetailBox(form);
        handleApiMessage(res?.message);
        // create returns { id: N }
        onSuccess?.({
          ...form,
          id: res.data.id,
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
        placeholder="Paragraph"
        className={styles.input}
        rows={4}
        required
      />

      {/* <input
        name="shortOrder"
        value={form.shortOrder}
        onChange={handleChange}
        placeholder="Sort Order (e.g. 1)"
        className={styles.input}
        type="number"
      /> */}

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}