'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createWhyChooseUs, updateWhyChooseUs } from '../../../../services/whyChooseApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

export default function WhyChooseUsForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    text: '',
    body: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        text: initialData.text || '',
        body: initialData.body || '',
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
        res = await updateWhyChooseUs(initialData.id, form);
        handleApiMessage(res?.message);
        onSuccess?.({
          ...form,
          id: initialData.id,
          created_at: initialData.created_at,
          updated_at: new Date().toISOString(),
        });
      } else {
        res = await createWhyChooseUs(form);
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <input
        name="text"
        value={form.text}
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

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
      </button>

    </form>
  );
}