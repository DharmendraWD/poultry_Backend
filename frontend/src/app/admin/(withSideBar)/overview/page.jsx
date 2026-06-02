'use client';

import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import s from '../sidebar.module.css';
import Link from 'next/link';

// React Icons Imports

import styles from "./dashboard.module.css";

import { FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi';


export default function DashboardPage() {
  const [first, setfirst] = useState([]);
  let NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();


  const user2 = {
    name: 'Alex Carter',
    email: 'alex.carter@cheekyadmin.com',
    isAdmin: true,
    profileImage: null,
    joinedDate: 'May 2026'
  };

  // Client-side guard (middleware handles the server-side redirect)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
  //       <span className="animate-pulse text-gray-400">Verifying session…</span>
  //     </div>
  //   );
  // }

  if (!isAuthenticated) return null;


async function getUser() {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data?.data);
    setfirst(response.data?.data);
  } catch (error) {
    console.error(error);
  }
}




  return (

<div>
  <h1>LOVERVEW</h1>

    </div>

  );
}