'use client';

import { useEffect, useState } from 'react';
import styles from '../hero/heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';

import { createTicker, updateTicker } from '@/services/tickerApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';

import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function TickerForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  // edit mode — single text field
  const [editText, setEditText] = useState('');

  // create mode — dynamic list of rows
  const [rows, setRows] = useState([{ id: Date.now(), value: '' }]);

  useEffect(() => {
    if (initialData) {
      setEditText(initialData.text || '');
    } else {
      setRows([{ id: Date.now(), value: '' }]);
    }
  }, [initialData]);

  /* ── row helpers (create mode) ── */
  const addRow = () => {
    setRows((prev) => [...prev, { id: Date.now(), value: '' }]);
  };

  const removeRow = (rowId) => {
    setRows((prev) => {
      if (prev.length === 1) return prev; // keep at least one
      return prev.filter((r) => r.id !== rowId);
    });
  };

  const handleRowChange = (rowId, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, value } : r))
    );
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (mode === 'edit') {
        const res = await updateTicker(initialData.id, { text: editText });
        handleApiMessage(res?.message);
        onSuccess?.({
          id: initialData.id,
          text: editText,
        });
      } else {
        const validRows = rows.filter((r) => r.value.trim() !== '');
        if (validRows.length === 0) return;

        const items = validRows.map((r) => ({ text: r.value.trim() }));
        console.log(Array.isArray(items), items)
        const res = await createTicker(items);
        handleApiMessage(res?.message);

        // API only returns { inserted: N }, no ids
        // optimistically add with temp ids — table shows "pending" until refresh
        const optimistic = items.map((item, i) => ({
          id: `tmp_${Date.now()}_${i}`,
          text: item.text,
        }));
        onSuccess?.(optimistic);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

//   console.log(rows)

  /* ── edit mode UI ── */
  if (mode === 'edit') {
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="Ticker text"
          className={styles.input}
          required
          name='text'
        />
        <button type="submit" className={add.addButton}>
          {loading ? 'Saving...' : 'Update'}
        </button>
      </form>
    );
  }

  /* ── create mode UI — dynamic rows ── */
  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((row, index) => (
          <div
            key={row.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#9ca3af',
                minWidth: 20,
                textAlign: 'right',
              }}
            >
              {index + 1}.
            </span>
            <input
              value={row.value}
              onChange={(e) => handleRowChange(row.id, e.target.value)}
              placeholder={`Ticker item ${index + 1}`}
              className={styles.input}
              style={{ flex: 1, margin: 0 }}
              required
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: rows.length === 1 ? 'not-allowed' : 'pointer',
                color: rows.length === 1 ? '#d1d5db' : '#ef4444',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
              disabled={rows.length === 1}
              title="Remove row"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Row button */}
      <button
        type="button"
        onClick={addRow}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: '1.5px dashed #d1d5db',
          borderRadius: 8,
          padding: '8px 14px',
          cursor: 'pointer',
          color: '#6b7280',
          fontSize: 13,
          fontWeight: 500,
          width: '100%',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        <FiPlus size={15} /> Add Row
      </button>

      <button type="submit" className={add.addButton}>
        {loading ? 'Saving...' : `Create ${rows.length} Item${rows.length > 1 ? 's' : ''}`}
      </button>

    </form>
  );
}