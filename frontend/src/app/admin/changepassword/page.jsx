'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { changePassword } from '@/services/auth/authApi';
import styles from './changepassword.module.css';


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ newPassword: '', currentPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  changePassword(form)
    .then(() => {
      setLoading(false);
      router.push('/admin/dashboard');
    })
    .catch((err) => {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to change password');
    });
};

  return (
  

  <div className={styles['login-page']}>
    <div className={styles['login-card']}>
      <div className={styles['login-header']}>
        <h1 className={styles['login-title']}>Change Your Password</h1>
        <p className={styles['login-subtitle']}>Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <div>
          <label className={styles['form-label']}>
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            placeholder="********"
            className={styles['form-input']}
          />
        </div>

        <div>
          <label className={styles['form-label']}>
            New Password
          </label>
          <input
          required
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={styles['form-input']}
          />
        </div>

        {error && (
          <div className={styles['error-box']}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles['submit-btn']}
        >
          {loading ? 'Changing password…' : 'Change Password'}
        </button>
      </form>
    </div>
  </div>

  );
}

