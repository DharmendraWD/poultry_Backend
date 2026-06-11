// 'use client';

// import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// const AuthContext = createContext(null);

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// // Refresh 1 minute before the 15-min token expires
// const REFRESH_INTERVAL_MS = 1* 60 * 1000; // 14 minutes

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // true until we know auth state
//   const refreshTimerRef = useRef(null);
//   const router = useRouter();

//   // ─── Silent Refresh ──────────────────────────────────────────────────────────
//   const silentRefresh = useCallback(async () => {
//     try {
//       const { data } = await axios.post(
//         `${BASE_URL}/auth/refresh`,
//         {},
//         { withCredentials: true } // sends httpOnly cookie
//       );
//       localStorage.setItem('accessToken', data.accessToken);
//       return data.accessToken;
//     } catch {
//       // Refresh token expired → log out
//       logout();
//       return null;
//     }
//   }, []); // eslint-disable-line

//   // ─── Start proactive refresh timer ───────────────────────────────────────────
//   const startRefreshTimer = useCallback(() => {
//     if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
//     refreshTimerRef.current = setInterval(silentRefresh, REFRESH_INTERVAL_MS);
//   }, [silentRefresh]);

//   const stopRefreshTimer = () => {
//     if (refreshTimerRef.current) {
//       clearInterval(refreshTimerRef.current);
//       refreshTimerRef.current = null;
//     }
//   };

//   // ─── Login ───────────────────────────────────────────────────────────────────
//   const login = async (email, password) => {
//     const { data } = await axios.post(
//       `${BASE_URL}/auth/login`,
//       { email, password },
//       { withCredentials: true }
//     );

//     localStorage.setItem('accessToken', data.accessToken);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     setUser(data.user);
//     startRefreshTimer();
//     return data;
//   };

//   // ─── Logout ──────────────────────────────────────────────────────────────────
//   const logout = useCallback(async () => {
//     stopRefreshTimer();
//     try {
//       await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
//     } catch { /* ignore */ }
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     router.push('/admin/login');
//   }, [router]);

//   // ─── Restore session on page load ────────────────────────────────────────────
//   useEffect(() => {
//     const restore = async () => {
//       const storedUser = localStorage.getItem('user');
//       const storedToken = localStorage.getItem('accessToken');

//       if (storedUser && storedToken) {
//         // Proactively refresh so we start fresh (token may be stale after tab sleep)
//         const newToken = await silentRefresh();
//         if (newToken) {
//           setUser(JSON.parse(storedUser));
//           startRefreshTimer();
//         }
//         // silentRefresh calls logout() internally on failure
//       }
//       setLoading(false);
//     };

//     restore();

//     return () => stopRefreshTimer();
//   }, []); // eslint-disable-line

//   const value = { user, loading, login, logout, isAuthenticated: !!user };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
//   return ctx;
// };



'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios'; // ← use your proxy axios instance, not raw axios

const AuthContext = createContext(null);

const REFRESH_INTERVAL_MS = 14 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);
  const router = useRouter();

  // ─── Silent Refresh ──────────────────────────────────────────────────────────
  const silentRefresh = useCallback(async () => {
    try {
      const { data } = await api.post(
        'auth/refresh',   // ← just the path, proxy adds the base
        {},
        { withCredentials: true }
      );
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  }, []); // eslint-disable-line

  // ─── Refresh timer ───────────────────────────────────────────────────────────
  const startRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    refreshTimerRef.current = setInterval(silentRefresh, REFRESH_INTERVAL_MS);
  }, [silentRefresh]);

  const stopRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post(
      'auth/login',      // ← just the path
      { email, password },
      { withCredentials: true }
    );

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    startRefreshTimer();
    return data;
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    stopRefreshTimer();
    try {
      await api.post('auth/logout', {}, { withCredentials: true });
    } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  // ─── Restore session on page load ────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('accessToken');

      if (storedUser && storedToken) {
        const newToken = await silentRefresh();
        if (newToken) {
          setUser(JSON.parse(storedUser));
          startRefreshTimer();
        }
      }
      setLoading(false);
    };

    restore();
    return () => stopRefreshTimer();
  }, []); // eslint-disable-line

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};