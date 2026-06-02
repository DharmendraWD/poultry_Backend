'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import useApi from '@/hooks/useApi';
import Loading from '@/adminComponent/loading/Loading';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import { getAboutUs, updateAboutUs } from '@/services/aboutus/aboutusApi';

import { FiSave, FiImage, FiType, FiAlignLeft } from 'react-icons/fi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

const emptyForm = {
  aboutus_heading: '',
  aboutusHeroPara: '',
  aboutusLongPara: '',
  aboutusbellowHeading: '',
  aboutusbellowPara: '',
};

export default function AboutUs() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [heroImgFile, setHeroImgFile] = useState(null);
  const [heroImgPreview, setHeroImgPreview] = useState(null);

  const logoRef = useRef(null);
  const heroImgRef = useRef(null);

  const { data, loadingApi, error } = useApi(getAboutUs, { enabled: true });

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setForm({
        aboutus_heading:      d.aboutus_heading      || '',
        aboutusHeroPara:      d.aboutusHeroPara      || '',
        aboutusLongPara:      d.aboutusLongPara      || '',
        aboutusbellowHeading: d.aboutusbellowHeading || '',
        aboutusbellowPara:    d.aboutusbellowPara    || '',
      });
      if (d.logo)               setLogoPreview(`${BASE_URL}/${d.logo}`);
      if (d.SecondSecImage_Hero) setHeroImgPreview(`${BASE_URL}/${d.SecondSecImage_Hero}`);
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading about us content..." />;
  if (error)
    return (
      <div style={{ color: '#ef4444', padding: 40, fontSize: 14 }}>
        Error loading about us: {error}
      </div>
    );

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
      if (logoFile)    payload.append('logo', logoFile);
      if (heroImgFile) payload.append('SecondSecImage_Hero', heroImgFile);

      const res = await updateAboutUs(payload);
      handleApiMessage(res?.message);

      // realtime: update previews from response if server returns paths
      if (res?.data?.logo)               setLogoPreview(`${BASE_URL}/${res.data.logo}`);
      if (res?.data?.SecondSecImage_Hero) setHeroImgPreview(`${BASE_URL}/${res.data.SecondSecImage_Hero}`);

      // clear file inputs after save
      setLogoFile(null);
      setHeroImgFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={css.page}>
      <form onSubmit={handleSubmit}>

        {/* Header */}
        <div style={css.pageHeader}>
          <div>
            <h1 style={css.pageTitle}>About Us</h1>
            <p style={css.pageSubtitle}>Manage your about us page content and images</p>
          </div>
          <button type="submit" style={css.saveBtn} disabled={loading}>
            <FiSave size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={css.grid}>

          {/* Hero Content */}
          <Section title="Hero Section" subtitle="Heading and intro paragraph" icon="✨">
            <Field label="Heading" icon={<FiType size={14} />}>
              <input
                name="aboutus_heading"
                value={form.aboutus_heading}
                onChange={handleChange}
                placeholder="About us heading"
                style={css.input}
              />
            </Field>
            <Field label="Hero Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="aboutusHeroPara"
                value={form.aboutusHeroPara}
                onChange={handleChange}
                placeholder="Short intro paragraph shown in the hero"
                style={{ ...css.input, ...css.textarea }}
                rows={4}
              />
            </Field>
          </Section>

          {/* Below Section */}
          <Section title="Below Section" subtitle="Secondary heading and paragraph" icon="📝">
            <Field label="Below Heading" icon={<FiType size={14} />}>
              <input
                name="aboutusbellowHeading"
                value={form.aboutusbellowHeading}
                onChange={handleChange}
                placeholder="Secondary section heading"
                style={css.input}
              />
            </Field>
            <Field label="Below Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="aboutusbellowPara"
                value={form.aboutusbellowPara}
                onChange={handleChange}
                placeholder="Secondary paragraph content"
                style={{ ...css.input, ...css.textarea }}
                rows={4}
              />
            </Field>
          </Section>

          {/* Long Paragraph — full width */}
          <Section title="Long Description" subtitle="Extended about us content" icon="📄" fullWidth>
            <Field label="Long Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="aboutusLongPara"
                value={form.aboutusLongPara}
                onChange={handleChange}
                placeholder="Detailed description of your company..."
                style={{ ...css.input, ...css.textarea }}
                rows={6}
              />
            </Field>
          </Section>

          {/* Media — full width */}
          <Section title="Media" subtitle="About us images" icon="🖼️" fullWidth>
            <div style={css.mediaGrid}>

              {/* Logo */}
              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiImage size={14} />
                  <span>About Us Main Walpaper</span>
                </div>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    style={{ ...css.mediaPreview, objectFit: 'contain', background: '#f3f4f6' }}
                  />
                )}
                <button
                  type="button"
                  style={css.uploadBtn}
                  onClick={() => logoRef.current?.click()}
                >
                  <FiImage size={13} />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </button>
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e, setLogoFile, setLogoPreview)}
                />
                {logoFile && (
                  <span style={css.fileTag}>New: {logoFile.name}</span>
                )}
              </div>

              {/* Hero Image */}
              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiImage size={14} />
                  <span>Left Side Image</span>
                </div>
                {heroImgPreview && (
                  <img
                    src={heroImgPreview}
                    alt="hero preview"
                    style={css.mediaPreview}
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
                {heroImgFile && (
                  <span style={css.fileTag}>New: {heroImgFile.name}</span>
                )}
              </div>

            </div>
          </Section>

        </div>

        {/* Bottom save bar */}
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

/* ── Styles — identical tokens to SiteSettings ── */
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
    fontFamily: 'inherit',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 90,
    lineHeight: 1.6,
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
    width: 'fit-content',
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
  mediaPreview: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
  },
  fileTag: {
    fontSize: 11,
    color: '#6b7280',
    background: '#f3f4f6',
    borderRadius: 6,
    padding: '3px 8px',
    width: 'fit-content',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 28,
    paddingTop: 20,
    borderTop: '1.5px solid #f0f0f0',
  },
};