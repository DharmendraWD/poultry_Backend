'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import Loading from '@/adminComponent/loading/Loading';

import { getAllUsers, createUser, deleteUser } from '@/services/auth/userApi';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import {  useRef } from 'react';

import { FiPlus, FiMail, FiUser, FiCalendar, FiShield, FiX } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

import styles from './users.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

function getInitial(name, username) {
  return (name || username || '?')[0].toUpperCase();
}

function buildAvatarUrl(path, blob) {
  if (blob) return blob;
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  return `${BASE_URL}users/${path}`;
}

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.isAdmin === 1 || user?.isSuperAdmin === 1;
  } catch {
    return false;
  }
}

export default function UsersPage() {
  const [dataList, setDataList]       = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createOpen, setCreateOpen]   = useState(false);
  const [confirmId, setConfirmId]     = useState(null);
  const [adminUser, setAdminUser]     = useState(false);

  const [profileFile, setProfileFile]     = useState(null);
const [profilePreview, setProfilePreview] = useState(null);
const fileRef = useRef(null);

const handleProfileFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setProfileFile(file);
  setProfilePreview(URL.createObjectURL(file));
};

  const [form, setForm] = useState({
    username: '', email: '', password: '',
    fullname: '', isAdmin: '1', isSuperAdmin: '0',
  });
  const [formLoading, setFormLoading] = useState(false);

  const { data, loadingApi, error } = useApi(getAllUsers, { enabled: true });

  useEffect(() => {
    if (data?.data) setDataList(data.data);
  }, [data]);

  useEffect(() => {
    setAdminUser(isAdmin());
  }, []);

  if (loadingApi) return <Loading text="Loading users..." />;
  if (error)
    return <div style={{ color: '#ef4444', padding: 40 }}>Error loading users: {error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleCreate = async (e) => {
  e.preventDefault();
  try {
    setFormLoading(true);
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    if (profileFile) payload.append('profileImag', profileFile);

    const res = await createUser(payload);
    handleApiMessage(res?.message);

    setDataList((prev) => [
      {
        id: res.userId,
        username: form.username,
        email: form.email,
        fullname: form.fullname,
        isAdmin: Number(form.isAdmin),
        isSuperAdmin: Number(form.isSuperAdmin),
        profileImag: null,
        _avatarBlob: profilePreview, // show immediately
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setForm({ username: '', email: '', password: '', fullname: '', isAdmin: '1', isSuperAdmin: '0' });
    setProfileFile(null);
    setProfilePreview(null);
    setCreateOpen(false);
  } catch (err) {
    console.error(err);
  } finally {
    setFormLoading(false);
  }
};  

  const handleDelete = async () => {
    try {
      const res = await deleteUser(confirmId);
      handleApiMessage(res?.message);
      setDataList((prev) => prev.filter((u) => u.id !== confirmId));
      if (selectedUser?.id === confirmId) setSelectedUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className={styles.container}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>Users</h1>
          <p>Manage admin panel users and permissions</p>
        </div>
        {adminUser && (
          <button className={styles.addButton} onClick={() => setCreateOpen(true)}>
            <FiPlus size={16} /> Add User
          </button>
        )}
      </div>

      {/* ── User Grid ── */}
      <div className={styles.grid}>
        {dataList.length === 0 ? (
          <div className={styles.empty}>No users found.</div>
        ) : (
          dataList.filter(Boolean).map((user) => {
            const avatarUrl = buildAvatarUrl(user.profileImag, user._avatarBlob);
            return (
              <div
                key={user.id}
                className={styles.card}
                onClick={() => setSelectedUser(user)}
              >
                {/* Delete button — only for admins, stop propagation */}
                {adminUser && (
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmId(user.id);
                    }}
                    title="Delete user"
                  >
                    <MdDelete size={18} />
                  </button>
                )}

                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.username}
                      className={styles.avatar}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={styles.avatarFallback}
                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                  >
                    {getInitial(user.fullname, user.username)}
                  </div>
                  <div className={styles.onlineDot} />
                </div>

                <p className={styles.cardName}>
                  {user.fullname || user.username}
                </p>
                <span className={styles.cardUsername}>@{user.username}</span>
                <span className={styles.cardEmail}>{user.email}</span>

                <div className={styles.badgeRow}>
                  {user.isSuperAdmin === 1 && (
                    <span className={`${styles.badge} ${styles.badgeSuperAdmin}`}>
                      Super Admin
                    </span>
                  )}
                  {user.isAdmin === 1 && (
                    <span className={`${styles.badge} ${styles.badgeAdmin}`}>
                      Admin
                    </span>
                  )}
                  {!user.isAdmin && !user.isSuperAdmin && (
                    <span className={`${styles.badge} ${styles.badgeUser}`}>
                      User
                    </span>
                  )}
                </div>

                <span className={styles.cardDate}>
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ── User Detail Modal ── */}
  {selectedUser && (() => {
  const detailAvatarUrl = buildAvatarUrl(selectedUser.profileImag, selectedUser._avatarBlob);
  return (
    <div className={styles.overlay} onClick={() => setSelectedUser(null)}>
      <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>

            {/* Hero */}
            <div className={styles.detailHero}>
              <button className={styles.detailCloseBtn} onClick={() => setSelectedUser(null)}>
                <FiX size={16} />
              </button>

              {detailAvatarUrl ? (
                <img
                  src={detailAvatarUrl}
                  alt={selectedUser.username}
                  className={styles.detailAvatar}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={styles.detailAvatarFallback}
                style={{
                  display: buildAvatarUrl(selectedUser.profileImag) ? 'none' : 'flex',
                }}
              >
                {getInitial(selectedUser.fullname, selectedUser.username)}
              </div>

              <h2 className={styles.detailName}>
                {selectedUser.fullname || selectedUser.username}
              </h2>
              <span className={styles.detailUsername}>@{selectedUser.username}</span>

              <div className={styles.badgeRow}>
                {selectedUser.isSuperAdmin === 1 && (
                  <span className={`${styles.badge} ${styles.badgeSuperAdmin}`}>Super Admin</span>
                )}
                {selectedUser.isAdmin === 1 && (
                  <span className={`${styles.badge} ${styles.badgeAdmin}`}>Admin</span>
                )}
              </div>
            </div>

            {/* Body rows */}
            <div className={styles.detailBody}>

              <div className={styles.detailRow}>
                <FiMail className={styles.detailRowIcon} />
                <div className={styles.detailRowContent}>
                  <span className={styles.detailRowLabel}>Email</span>
                  <span className={styles.detailRowValue}>{selectedUser.email}</span>
                </div>
              </div>

              {selectedUser.fullname && (
                <div className={styles.detailRow}>
                  <FiUser className={styles.detailRowIcon} />
                  <div className={styles.detailRowContent}>
                    <span className={styles.detailRowLabel}>Full Name</span>
                    <span className={styles.detailRowValue}>{selectedUser.fullname}</span>
                  </div>
                </div>
              )}

              <div className={styles.detailRow}>
                <FiShield className={styles.detailRowIcon} />
                <div className={styles.detailRowContent}>
                  <span className={styles.detailRowLabel}>Role</span>
                  <div className={`${styles.detailRowValue} ${styles.detailBadgeRow}`}>
                    {selectedUser.isSuperAdmin === 1 && (
                      <span className={`${styles.badge} ${styles.badgeSuperAdmin}`}>Super Admin</span>
                    )}
                    {selectedUser.isAdmin === 1 && (
                      <span className={`${styles.badge} ${styles.badgeAdmin}`}>Admin</span>
                    )}
                    {!selectedUser.isAdmin && !selectedUser.isSuperAdmin && (
                      <span className={`${styles.badge} ${styles.badgeUser}`}>User</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.detailRow}>
                <FiCalendar className={styles.detailRowIcon} />
                <div className={styles.detailRowContent}>
                  <span className={styles.detailRowLabel}>Joined</span>
                  <span className={styles.detailRowValue}>
                    {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {selectedUser.updated_at && (
                <div className={styles.detailRow}>
                  <FiCalendar className={styles.detailRowIcon} />
                  <div className={styles.detailRowContent}>
                    <span className={styles.detailRowLabel}>Last Updated</span>
                    <span className={styles.detailRowValue}>
                      {new Date(selectedUser.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}

            </div>
           </div>
    </div>
  ); // ← close return
})()} {/* ← close IIFE */}
      {/* ── Create User Modal ── */}
      {createOpen && (
        <div className={styles.overlay} onClick={() => setCreateOpen(false)}>
          <div className={styles.createModal} onClick={(e) => e.stopPropagation()}>

            <div className={styles.createModalHeader}>
              <div>
                <h2 className={styles.createModalTitle}>Create User</h2>
                <p className={styles.createModalSubtitle}>Add a new admin panel user</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setCreateOpen(false)}>
                <FiX />
              </button>
            </div>

            <form className={styles.createForm} onSubmit={handleCreate}>

          {/* Profile Image */}
<div className={styles.fieldGroup}>
  <label className={styles.fieldLabel}>Profile Image</label>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#f3f4f6',
        border: '1.5px solid #e5e7eb',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 13,
        fontWeight: 500,
        color: '#374151',
        cursor: 'pointer',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    >
      📷 {profilePreview ? 'Change Photo' : 'Upload Photo'}
    </button>
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handleProfileFile}
    />
    {profilePreview && (
      <img
        src={profilePreview}
        alt="preview"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #e5e7eb',
        }}
      />
    )}
  </div>
</div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Full Name</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={styles.input}
                  type="email"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Password *</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={styles.input}
                  type="password"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Role</label>
                <select
                  name="isAdmin"
                  value={form.isAdmin}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="1">Admin</option>
                  <option value="0">User</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Super Admin</label>
                <select
                  name="isSuperAdmin"
                  value={form.isSuperAdmin}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                <FiPlus size={15} />
                {formLoading ? 'Creating...' : 'Create User'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmId && (
        <div className={styles.confirmOverlay} onClick={() => setConfirmId(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3 className={styles.confirmTitle}>Delete this user?</h3>
            <p className={styles.confirmDesc}>
              This action is permanent and cannot be undone. The user will lose all access immediately.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className={styles.confirmDelete} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}