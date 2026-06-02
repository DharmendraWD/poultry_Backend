'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import {
  createHomeCard,
  updateHomeCard,
} from '@/services/homeCardApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

export default function FirstCardForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    title: '',
    timee: '',
    days: '',
    body: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        timee: initialData.timee || '',
        days: initialData.days || '',
        body: initialData.body || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let res;

      if (mode === 'edit') {
        res = await updateHomeCard(initialData.id, form);

        handleApiMessage(res?.message);
      } else {
        res = await createHomeCard(form);
        handleApiMessage(res?.message);
      }
      console.log(res.message)
      onSuccess?.({
  ...form,
 id: res.data.insertId,                    // ← MySQL insertId
  created_at: new Date().toISOString(),     // ← generate on client side
});
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
        name="timee"
        value={form.timee}
        onChange={handleChange}
        placeholder="7.00 am - 7.00 pm"
        className={styles.input}
        required
      />

      <input
        name="days"
        value={form.days}
        onChange={handleChange}
        placeholder="Sunday - Saturday"
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
        {loading
          ? 'Saving...'
          : mode === 'edit'
          ? 'Update'
          : 'Create'}
      </button>

    </form>
  );
}