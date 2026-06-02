'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createStats, updateStats } from '@/services/statsApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

// Common emoji options for stats icons
const EMOJI_OPTIONS = [
  // General
  '😃', '🏆', '⭐', '🚀', '💡', '🌟', '✅', '📈',
  '👥', '🎯', '💪', '🌍', '🏅', '🎉', '🔥', '💼',

  // Chicken / Poultry
  '🐔', '🐓', '🥚', '🍗', '🐣', '🪶',

  // Fish / Seafood
  '🐟', '🐠', '🦐', '🦑', '🦞', '🎣',

  // Meat / Food
  '🥩', '🍖', '🍔', '🌭', '🍱',

  // Farm / Animals
  '🐄', '🐐', '🐑', '🐖', '🐇', '🦆',
  '🐂', '🐃', '🐕', '🐈', '🐎',

  // Agriculture
  '🌾', '🌽', '🥕', '🍎', '🍅', '🥬',
  '🍆', '🥔', '🧅', '🧄','🌿',

  // Electronics / Tech
  '💻', '🖥️', '⌨️', '🖱️', '📱', '🔋',
  '📷', '🎧', '📡', '🔌', '🛜', '🖨️',

  // Vehicle / Transport
  '🚗', '🚕', '🚙', '🚌', '🚎', '🚚',
  '🚛', '🚜', '🏍️', '🚲', '🛺', '✈️',
  '🚢', '⛽',

  // Clothing / Fashion
  '👕', '👔', '👗', '🧥', '👖', '🩳',
  '👚', '👟', '👞', '👜', '🎒', '🧢',

  // Plumbing
  '🚰', '🪠', '🚿', '🛁', '🧰', '🔧',
  '🪛', '🔩', '⚙️',

  // Carpenter / Construction
  '🪚', '🪵', '🔨', '🏠', '🧱', '📐',
  '🪜', '⛏️', '🧲',

  // Business / Office
  '🏢', '📦', '🛒', '💳', '📊', '📋',

  // Medical
  '🏥', '💊', '🩺', '🩹', '🧬',

  // Education
  '📚', '🎓', '✏️', '🖊️', '🧠',

  // Beauty / Salon
  '💄', '💅', '💇', '🪞', '🧴',

  // Sports / Fitness
  '⚽', '🏀', '🏏', '🎾', '🏋️', '🤸',

  // Security
  '🛡️', '🔒', '🚨', '🧯',

  // Home Services
  '🛋️', '🪑', '🛏️', '🚪', '🪟',

  // Internet / Social
  '🌐', '📶', '📲', '💬', '📢',
];

export default function StatsForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    icon: '',
    number_text: '',
    label: '',
    sort_order: '',
    is_active: 1,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        icon: initialData.icon || '',
        number_text: initialData.number_text || '',
        label: initialData.label || '',
        sort_order: initialData.sort_order || '',
        is_active: initialData.is_active ?? 1,
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
        res = await updateStats(initialData.id, form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
        });
      } else {
        res = await createStats(form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...res.data,
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
// console.log(form)
  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* Emoji select + live preview */}
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
          {EMOJI_OPTIONS.map((emoji) => (
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
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
            background: '#f9fafb',
          }}
        >
          {form.icon || '?'}
        </div>
      </div>

      <input
        name="number_text"
        value={form.number_text}
        onChange={handleChange}
        placeholder="Number Text (e.g. 12k, 500+)"
        className={styles.input}
        required
      />

      <input
        name="label"
        value={form.label}
        onChange={handleChange}
        placeholder="Label (e.g. Happy Clients)"
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
        type="number"

      >
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}