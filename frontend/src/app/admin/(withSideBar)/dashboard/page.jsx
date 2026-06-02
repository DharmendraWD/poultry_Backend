'use client';

import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


import useApi from "@/hooks/useApi";
import { getUserById, getUsers } from "@/services/userApi";


import styles from "./dashboard.module.css";

import { FiUser, FiMail, FiShield, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import AdminHeader from '@/adminComponent/header/Header';
import formatDate from '@/lib/formatDate';


export default function DashboardPage() {
  const imageBasePath = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;
    const [first, setfirst] = useState([]);
      const user2 = {
    name: 'Alex Carter',
    email: 'alex.carter@cheekyadmin.com',
    isAdmin: true,
    profileImage: null,
    joinedDate: 'May 2026'
  };

  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  // API DATA 
const {
  data,
  loadingApi,
  error,
} = useApi(
  () => getUserById(user?.id),
  {
    enabled: !!user?.id && !!user,
  }
);
  

// console.log(data?.data)
// console.log(imageBasePath)
  // API DATA END 


  // Client-side guard (middleware handles the server-side redirect)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <span className="animate-pulse text-gray-400">Verifying session…</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;


  if (loadingApi) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (

<div className={styles.containerMain}>
    <AdminHeader
      title="Dashboard"
      description="Welcome to your admin dashboard!"
      icon={<FiBarChart2 />}
    />
  <div className={styles.container}>
      <div className={styles.profileCard}>
        
        {/* Top Header Banner Color Accent */}
        <div className={styles.cardBanner} />

        {/* User Identity Segment */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            {data?.data?.profileImag ? (
              <img 
                src={data?.data ? imageBasePath +"users"+"/" + data?.data?.profileImag : 'not found'} 
                alt={`${data?.data ? data?.data?.username : 'User'}'s Profile`} 
                width={110} 
                height={110} 
                className={styles.avatarImage}
              />
            ) : (
              // Fallback block if no profile image exists
              <div className={styles.avatarFallback}>
                <FiUser className={styles.avatarIcon} />
              </div>
            )}
          </div>
          <div className={styles.titleArea}>
            <h1 className={styles.userName}>{data?.data ? data?.data?.username : 'not found'} </h1>
            <span className={`${styles.badge} ${data?.data && data?.data?.isSuperAdmin ? styles.adminBadge : styles.userBadge}`}>
              <FiShield className={styles.badgeIcon} />
              {data?.data?.isSuperAdmin ? 'System Administrator' : 'Standard User'}
            </span>
          </div>
        </div>

        {/* Meta Details Listing Grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <FiUser />
            </div>
            <div className={styles.infoData}>
              <label>Full Display Name</label>
              <p>{data?.data ? data?.data?.fullname : 'not found'}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <FiMail />
            </div>
            <div className={styles.infoData}>
              <label>Email Address</label>
              <p>{data?.data ? data?.data?.email : 'not found'}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <FiShield />
            </div>
            <div className={styles.infoData}>
              <label>Account Role Access Status</label>
              <p>{data?.data?.isSuperAdmin ? 'Read, Write, and Execute Privileges' : 'Restricted Access'}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.iconBox}>
              <FiCalendar />
            </div>
            <div className={styles.infoData}>
              <label>Member Since</label>
              {/* updated_at: "2026-05-28T07:58:49.000Z" */}
              <p>{data?.data ? formatDate(data?.data?.created_at) : 'not found'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

{/* <button onClick={getUser}>Refresh User List</button> */}
      {
        Array.isArray(first) && first.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">User List</h2>
            <ul className="space-y-2">
              {first.map((user) => (
                <li key={user.id} className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                  <p><strong>Name:</strong> {user.fullname}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </div>

  );
}