'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createFeatureCard, updateFeatureCard } from '@/services/featureCardApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import { MdGrass } from 'react-icons/md';
import { GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat } from 'react-icons/gi';
import { FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';

// Map color value → actual CSS color for preview
const colorMap = {
  'var(--color-primary)': 'var(--color-primary)',
  'var(--iconOnPrimaryBgClr)': 'var(--iconOnPrimaryBgClr)'
};

const iconMap = {
  // Poultry
  GiChicken,
  FaEgg,
  GiDuck,
  MdGrass,

  // Livestock
  GiCow,
  GiGoat,
  GiPig,
  GiRabbit,
  GiSheep,

  // Fish Farming
  FaFish,
  GiFishCorpse,
  GiFishingNet,

  // Agriculture
  FaLeaf,
  FaSeedling,
  GiWheat,
  GiCorn,
  FaCarrot,
  FaAppleAlt,
  GiFruitTree,
  GiFruitBowl,
  GiPlantRoots,

  // Farming Equipment
  GiFarmTractor,
  FaTractor,
  GiWateringCan,
  GiBarn,
  GiFarmer,

  // Others
  GiBee,
};

export default function FeatureCardForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    icon: '',
    icon_color: '',
    title: '',
    body: '',
    active: 1,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        icon: initialData.icon || '',
        icon_color: initialData.icon_color || '',
        title: initialData.title || '',
        body: initialData.body || '',
        active: initialData.active ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const SelectedIcon = iconMap[form.icon] || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res;

      if (mode === 'edit') {
        res = await updateFeatureCard(initialData.id, form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: initialData.id,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
        });
      } else {
        res = await createFeatureCard(form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: res.data.insertId,
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
  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* Icon select + preview */}
      <div className={styles.iconSelectWrapper}>
        <select
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className={styles.input}
          required
        >
            <option value="">Select Icon</option>
            {Object.keys(iconMap).map((iconKey) => (
              <option key={iconKey} value={iconKey}>
                {iconKey}
                </option>
                ))}
        </select>
        <div className={styles.iconPreview}>
          {SelectedIcon && <SelectedIcon />}
        </div>
      </div>

      {/* Color select + preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          name="icon_color"
          value={form.icon_color}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Color</option>
          <option value="var(--color-primary)">Primary</option>
          <option value="var(--iconOnPrimaryBgClr)">On Primary</option>
        </select>
        <div
          className={styles.colorPreview}
          style={{
            background: colorMap[form.icon_color] || '#e5e7eb',
          }}
        />
      </div>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
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

      <select
        name="active"
        value={form.active}
        onChange={handleChange}
        className={styles.input}
      >
        <option value={1}>Active</option>
        <option value={0}>Inactive</option>
      </select>

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}