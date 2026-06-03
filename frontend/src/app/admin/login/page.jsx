'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('/admin/dashboard');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setFrom(searchParams.get('from') || '/admin/dashboard');
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {

 console.log('Attempting login...');
    await login(form.email, form.password);
    console.log('Login success, redirecting to:', from);
    router.push(from);

    await login(form.email, form.password);
    router.push(from); // ← redirect back to where they came from
  } catch (err) {
     console.log('Login error:', err);
    console.log('Error response:', err?.response);
    console.log('Error response data:', err?.response?.data);
    console.log('Error message:', err?.message);
    setError(err?.response?.data?.message || err?.message || 'Login failed.');
  } finally {
    setLoading(false);
  }
};

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-950">
    //   <div className="w-full max-w-md px-8 py-10 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
    //     <div className="mb-8 text-center">
    //       <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
    //       <p className="mt-2 text-gray-400 text-sm">Sign in to access the dashboard</p>
    //     </div>

    //     <form onSubmit={handleSubmit} className="space-y-5">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-300 mb-1.5">
    //           Email
    //         </label>
    //         <input
    //           type="email"
    //           name="email"
    //           value={form.email}
    //           onChange={handleChange}
    //           required
    //           placeholder="you@example.com"
    //           className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-gray-300 mb-1.5">
    //           Password
    //         </label>
    //         <input
    //           type="password"
    //           name="password"
    //           value={form.password}
    //           onChange={handleChange}
    //           // required
    //           placeholder="••••••••"
    //           className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    //         />
    //       </div>

    //       {error && (
    //         <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2.5">
    //           {error}
    //         </div>
    //       )}

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
    //       >
    //         {loading ? 'Signing in…' : 'Sign in'}
    //       </button>
    //     </form>
    //   </div>
    // </div>


  <div className="login-page">
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to access the dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="form-input"
          />
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>

    <style jsx>{`
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #030712;
      }

      .login-card {
        width: 100%;
        max-width: 448px;
        padding: 2.5rem 2rem;
        background: #111827;
        border-radius: 1rem;
        border: 1px solid #1f2937;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      }

      .login-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .login-title {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.025em;
      }

      .login-subtitle {
        margin-top: 0.5rem;
        color: #9ca3af;
        font-size: 0.875rem;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #d1d5db;
      }

      .form-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.625rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #374151;
        background: #1f2937;
        color: #ffffff;
        font-size: 0.95rem;
        transition: all 0.2s ease;
      }

      .form-input::placeholder {
        color: #6b7280;
      }

      .form-input:focus {
        outline: none;
        border-color: transparent;
        box-shadow: 0 0 0 2px #6366f1;
      }

      .error-box {
        padding: 0.625rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #991b1b;
        background: rgba(127, 29, 29, 0.2);
        color: #f87171;
        font-size: 0.875rem;
      }

      .submit-btn {
        width: 100%;
        padding: 0.625rem 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #4f46e5;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .submit-btn:hover:not(:disabled) {
        background: #6366f1;
      }

      .submit-btn:disabled {
        background: #312e81;
        cursor: not-allowed;
      }
    `}</style>
  </div>

  );
}

