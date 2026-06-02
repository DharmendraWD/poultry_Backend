'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import useApi from '@/hooks/useApi';
import Loading from '@/adminComponent/loading/Loading';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import { getSiteSettings, updateSiteSettings } from '@/services/siteSettingsApi';

import {
  FiGlobe, FiPhone, FiMail, FiMapPin, FiSave,
  FiImage, FiVideo, FiInstagram, FiFacebook,
} from 'react-icons/fi';
import { SiTiktok, SiWhatsapp } from 'react-icons/si';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

const emptyForm = {
  facebook: '',
  whatsapp: '',
  mobilenum1: '',
  mobilenum2: '',
  tiktok: '',
  instagram: '',
  companyName: '',
  footerSlogan: '',
  address: '',
  location: '',
  email: '',
};

export default function SiteSettings() {
  const imageBasePath = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // file states
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [heroImgFile, setHeroImgFile] = useState(null);
  const [heroImgPreview, setHeroImgPreview] = useState(null);

  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [heroVideoPreview, setHeroVideoPreview] = useState(null);

  const logoRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroVideoRef = useRef(null);

const fetchSettings = useCallback(() => getSiteSettings(), []);

const { data, loadingApi, error } = useApi(fetchSettings, {
  enabled: true,
});
  

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setForm({
        facebook: d.facebook || '',
        whatsapp: d.whatsapp || '',
        mobilenum1: d.mobilenum1 || '',
        mobilenum2: d.mobilenum2 || '',
        tiktok: d.tiktok || '',
        instagram: d.instagram || '',
        companyName: d.companyName || '',
        footerSlogan: d.footerSlogan || '',
        address: d.address || '',
        location: d.location || '',
        email: d.email || '',
      });
      if (d.logo) setLogoPreview(`${BASE_URL}/${d.logo}`);
      if (d.SecondSecImage_Hero) setHeroImgPreview(`${BASE_URL}/${d.SecondSecImage_Hero}`);
      if (d.ThirdSecVideo_Hero) setHeroVideoPreview(`${BASE_URL}/${d.ThirdSecVideo_Hero}`);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading site settings..." />;
  if (error)
    return <div style={{ color: '#ef4444', padding: 40 }}>Error loading settings: {error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      if (logoFile) payload.append('logo', logoFile);
      if (heroImgFile) payload.append('SecondSecImage_Hero', heroImgFile);
      if (heroVideoFile) payload.append('ThirdSecVideo_Hero', heroVideoFile);

      const res = await updateSiteSettings(payload);
      handleApiMessage(res?.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={css.page}>
      <form onSubmit={handleSubmit}>

        {/* ── Page Header ── */}
        <div style={css.pageHeader}>
          <div>
            <h1 style={css.pageTitle}>Site Settings</h1>
            <p style={css.pageSubtitle}>Manage your website configuration and branding</p>
          </div>
          <button type="submit" style={css.saveBtn} disabled={loading}>
            <FiSave size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={css.grid}>

          {/* ── Branding ── */}
          <Section title="Branding" subtitle="Company identity and name" icon="🏷️">
            <Field label="Company Name" icon={<FiGlobe size={14} />}>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company name"
                style={css.input}
              />
            </Field>
            <Field label="Footer Slogan">
              <input
                name="footerSlogan"
                value={form.footerSlogan}
                onChange={handleChange}
                placeholder="Your tagline here"
                style={css.input}
              />
            </Field>

            {/* Logo upload */}
            <Field label="Logo">
              <div style={css.uploadRow}>
                <button
                  type="button"
                  style={css.uploadBtn}
                  onClick={() => logoRef.current?.click()}
                >
                  <FiImage size={14} /> Change Logo
                </button>
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e, setLogoFile, setLogoPreview)}
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="logo"
                    style={{ height: 44, width: 'auto', maxWidth: 120, objectFit: 'contain', borderRadius: 6, border: '1.5px solid #e5e7eb' }}
                  />
                )}
              </div>
            </Field>
          </Section>

          {/* ── Contact ── */}
          <Section title="Contact" subtitle="Phone, email and address" icon="📞">
            <Field label="Email" icon={<FiMail size={14} />}>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@yoursite.com"
                style={css.input}
                type="email"
              />
            </Field>
            <Field label="Mobile 1" icon={<FiPhone size={14} />}>
              <input
                name="mobilenum1"
                value={form.mobilenum1}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                style={css.input}
              />
            </Field>
            <Field label="Mobile 2" icon={<FiPhone size={14} />}>
              <input
                name="mobilenum2"
                value={form.mobilenum2}
                onChange={handleChange}
                placeholder="+1 234 567 891"
                style={css.input}
              />
            </Field>
            <Field label="Address" icon={<FiMapPin size={14} />}>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street address"
                style={css.input}
              />
            </Field>
            <Field label="Location">
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                style={css.input}
              />
            </Field>
          </Section>

          {/* ── Social Media ── */}
          <Section title="Social Media" subtitle="Links to social platforms" icon="🔗">
            <Field label="Facebook" icon={<FiFacebook size={14} color="#1877f2" />}>
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="//facebook.com/yourpage"
                style={css.input}
              />
            </Field>
            <Field label="WhatsApp" icon={<SiWhatsapp size={14} color="#25d366" />}>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="//wa.me/123456789"
                style={css.input}
              />
            </Field>
            <Field label="Instagram" icon={<FiInstagram size={14} color="#e1306c" />}>
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="//instagram.com/yourhandle"
                style={css.input}
              />
            </Field>
            <Field label="TikTok" icon={<SiTiktok size={14} />}>
              <input
                name="tiktok"
                value={form.tiktok}
                onChange={handleChange}
                placeholder="//tiktok.com/@yourhandle"
                style={css.input}
              />
            </Field>
          </Section>

          {/* ── Hero Media ── */}
          <Section title="Hero Media" subtitle="Images and video for hero sections" icon="🎬" fullWidth>
            <div style={css.mediaGrid}>

              {/* Hero Image */}
              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiImage size={14} />
                  <span>Hero Section Image</span>
                </div>
                {heroImgPreview && (
                  <img
                    src={heroImgPreview}
                    alt="hero"
                    style={css.mediaPreviewImg}
                  />
                )}
                <button
                  type="button"
                  style={css.uploadBtn}
                  onClick={() => heroImgRef.current?.click()}
                >
                  <FiImage size={13} />
                  {heroImgPreview ? 'Change Image' : 'Upload Image'}
                </button>
                <input
                  ref={heroImgRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e, setHeroImgFile, setHeroImgPreview)}
                />
              </div>

              {/* Hero Video */}
              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiVideo size={14} />
                  <span>Hero Section Video</span>
                </div>
                {heroVideoPreview && (
                  <video
                    src={heroVideoPreview}
                    controls
                    style={css.mediaPreviewImg}
                  />
                )}
                <button
                  type="button"
                  style={css.uploadBtn}
                  onClick={() => heroVideoRef.current?.click()}
                >
                  <FiVideo size={13} />
                  {heroVideoPreview ? 'Change Video' : 'Upload Video'}
                </button>
                <input
                  ref={heroVideoRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e, setHeroVideoFile, setHeroVideoPreview)}
                />
              </div>

            </div>
          </Section>

        </div>

        {/* ── Bottom save ── */}
        <div style={css.bottomBar}>
          <button type="submit" style={css.saveBtn} disabled={loading}>
            <FiSave size={16} />
            {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}

/* ── Sub-components ── */
function Section({ title, subtitle, icon, children, fullWidth }) {
  return (
    <div style={{ ...css.section, ...(fullWidth ? css.fullWidth : {}) }}>
      <div style={css.sectionHeader}>
        <span style={css.sectionIcon}>{icon}</span>
        <div>
          <div style={css.sectionTitle}>{title}</div>
          <div style={css.sectionSubtitle}>{subtitle}</div>
        </div>
      </div>
      <div style={css.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={css.field}>
      <label style={css.label}>
        {icon && <span style={{ opacity: 0.6 }}>{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Styles ── */
const css = {
  page: {
    padding: '28px 24px',
    maxWidth: 1100,
    margin: '0 auto',
    fontFamily: "'DM Sans', sans-serif",
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    margin: '4px 0 0',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
  },
  section: {
    background: '#fff',
    border: '1.5px solid #f0f0f0',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1.5px solid #f5f5f5',
    background: '#fafafa',
  },
  sectionIcon: {
    fontSize: 22,
    lineHeight: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  sectionBody: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  },
  uploadRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  uploadBtn: {
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
    whiteSpace: 'nowrap',
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  mediaCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 16,
    border: '1.5px solid #f0f0f0',
    borderRadius: 12,
    background: '#fafafa',
  },
  mediaLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  mediaPreviewImg: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 28,
    paddingTop: 20,
    borderTop: '1.5px solid #f0f0f0',
  },
};