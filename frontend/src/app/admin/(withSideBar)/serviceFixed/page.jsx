'use client';

import { useEffect, useState, useRef } from 'react';
import useApi from '@/hooks/useApi';
import Loading from '@/adminComponent/loading/Loading';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import { getServiceContent, updateServiceContent } from '@/services/service/serviceApi';

import { FiSave, FiImage, FiType, FiAlignLeft, FiAward } from 'react-icons/fi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

const emptyForm = {
  Hservice_heading:       '',
  Hservice_para:          '',
  shortHeading:           '',
  shortpara:              '',
  longpara:               '',
  aboutusHeroPara:        '',
  yrsOfExp:               '',
  yrsOfExpText:           '',
  satisfiedCustomer:      '',
  satisfiedCustomerText:  '',
  projectCompleted:       '',
  projectCompletedText:   '',
  other:                  '',
  otherText:              '',
};

export default function ServiceContent() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [heroImgFile, setHeroImgFile] = useState(null);
  const [heroImgPreview, setHeroImgPreview] = useState(null);

  const logoRef    = useRef(null);
  const heroImgRef = useRef(null);

  const { data, loadingApi, error } = useApi(getServiceContent, { enabled: true });

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setForm({
        Hservice_heading:      d.Hservice_heading      || '',
        Hservice_para:         d.Hservice_para         || '',
        shortHeading:          d.shortHeading          || '',
        shortpara:             d.shortpara             || '',
        longpara:              d.longpara              || '',
        aboutusHeroPara:       d.aboutusHeroPara       || '',
        yrsOfExp:              d.yrsOfExp              || '',
        yrsOfExpText:          d.yrsOfExpText          || '',
        satisfiedCustomer:     d.satisfiedCustomer     || '',
        satisfiedCustomerText: d.satisfiedCustomerText || '',
        projectCompleted:      d.projectCompleted      || '',
        projectCompletedText:  d.projectCompletedText  || '',
        other:                 d.other                 || '',
        otherText:             d.otherText             || '',
      });

      // logo comes back as "[object Object]" string when no file — guard it
      if (d.logo && !d.logo.includes('[object')) {
        setLogoPreview(`${BASE_URL}${d.logo}`);
      }
      if (d.SecondSecImage_Hero) {
        setHeroImgPreview(`${BASE_URL}${d.SecondSecImage_Hero}`);
      }
    }
  }, [data]);

  if (loadingApi) return <Loading text="Loading service content..." />;
  if (error)
    return (
      <div style={{ color: '#ef4444', padding: 40, fontSize: 14 }}>
        Error loading service content: {error}
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

for (const key in form) {
  if (form[key]) {
    payload.append(key, form[key]);
  }
}
      if (logoFile)    payload.append('logo', logoFile);
      if (heroImgFile) payload.append('SecondSecImage_Hero', heroImgFile);

      const res = await updateServiceContent(payload);
      handleApiMessage(res?.message);

      // realtime: sync previews from response
      if (res?.data?.logo && !res.data.logo.includes('[object')) {
        setLogoPreview(`${BASE_URL}${res.data.logo}`);
      }
      if (res?.data?.SecondSecImage_Hero) {
        setHeroImgPreview(`${BASE_URL}${res.data.SecondSecImage_Hero}`);
      }

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

        {/* ── Header ── */}
        <div style={css.pageHeader}>
          <div>
            <h1 style={css.pageTitle}>Service Content</h1>
            <p style={css.pageSubtitle}>Manage your service page fixed content</p>
          </div>
          <button type="submit" style={css.saveBtn} disabled={loading}>
            <FiSave size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={css.grid}>

          {/* ── Hero Section ── */}
          <Section title="Hero Section" subtitle="Main heading and paragraph" icon="✨">
            <Field label="Service Heading" icon={<FiType size={14} />}>
              <input
                name="Hservice_heading"
                value={form.Hservice_heading}
                onChange={handleChange}
                placeholder="Main service heading"
                style={css.input}
              />
            </Field>
            <Field label="Service Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="Hservice_para"
                value={form.Hservice_para}
                onChange={handleChange}
                placeholder="Hero paragraph"
                style={{ ...css.input, ...css.textarea }}
                rows={3}
              />
            </Field>
          </Section>

          {/* ── Short Section ── */}
          <Section title="Short Section" subtitle="Brief heading and summary" icon="📝">
            <Field label="Short Heading" icon={<FiType size={14} />}>
              <input
                name="shortHeading"
                value={form.shortHeading}
                onChange={handleChange}
                placeholder="Short heading"
                style={css.input}
              />
            </Field>
            <Field label="Short Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="shortpara"
                value={form.shortpara}
                onChange={handleChange}
                placeholder="Short paragraph"
                style={{ ...css.input, ...css.textarea }}
                rows={3}
              />
            </Field>
          </Section>

          {/* ── Long Para — full width ── */}
          <Section title="Long Description" subtitle="Extended content paragraph" icon="📄" fullWidth>
            <Field label="Long Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="longpara"
                value={form.longpara}
                onChange={handleChange}
                placeholder="Long description content..."
                style={{ ...css.input, ...css.textarea }}
                rows={5}
              />
            </Field>
            <Field label="Short Paragraph" icon={<FiAlignLeft size={14} />}>
              <textarea
                name="aboutusHeroPara"
                value={form.aboutusHeroPara}
                onChange={handleChange}
                placeholder="Short paragraph for service page"
                style={{ ...css.input, ...css.textarea }}
                rows={4}
              />
            </Field>
          </Section>

          {/* ── Stats — full width ── */}
          <Section title="Stats & Numbers" subtitle="Years of experience, customers, projects" icon="📊" fullWidth>
            <div style={css.statsGrid}>

              <StatPair
                numName="yrsOfExp"
                numVal={form.yrsOfExp}
                textName="yrsOfExpText"
                textVal={form.yrsOfExpText}
                label="Years of Experience"
                numPlaceholder="e.g. 10+"
                textPlaceholder="e.g. Years of Experience"
                onChange={handleChange}
                css={css}
              />

              <StatPair
                numName="satisfiedCustomer"
                numVal={form.satisfiedCustomer}
                textName="satisfiedCustomerText"
                textVal={form.satisfiedCustomerText}
                label="Satisfied Customers"
                numPlaceholder="e.g. 500+"
                textPlaceholder="e.g. Happy Clients"
                onChange={handleChange}
                css={css}
              />

              <StatPair
                numName="projectCompleted"
                numVal={form.projectCompleted}
                textName="projectCompletedText"
                textVal={form.projectCompletedText}
                label="Projects Completed"
                numPlaceholder="e.g. 200+"
                textPlaceholder="e.g. Projects Done"
                onChange={handleChange}
                css={css}
              />

              <StatPair
                numName="other"
                numVal={form.other}
                textName="otherText"
                textVal={form.otherText}
                label="Other Stat"
                numPlaceholder="e.g. 50+"
                textPlaceholder="e.g. Awards Won"
                onChange={handleChange}
                css={css}
              />

            </div>
          </Section>

          {/* ── Media — full width ── */}
          <Section title="Media" subtitle="Side Image and Service hero section image" icon="🖼️" fullWidth>
            <div style={css.mediaGrid}>

              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiImage size={14} />
                  <span>Side Image</span>
                </div>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Side Image"
                    style={{ ...css.mediaPreview, objectFit: 'contain', background: '#f3f4f6' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
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

              <div style={css.mediaCard}>
                <div style={css.mediaLabel}>
                  <FiImage size={14} />
                  <span>Service full Page Image</span>
                </div>
                {heroImgPreview && (
                  <img
                    src={heroImgPreview}
                    alt="hero"
                    style={css.mediaPreview}
                    onError={(e) => { e.target.style.display = 'none'; }}
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

        {/* ── Bottom save bar ── */}
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

/* ── Stat pair: number + label text side by side ── */
function StatPair({ numName, numVal, textName, textVal, label, numPlaceholder, textPlaceholder, onChange, css }) {
  return (
    <div style={css.statCard}>
      <div style={css.statLabel}>{label}</div>
      <div style={css.statRow}>
        <input
          name={numName}
          value={numVal}
          onChange={onChange}
          placeholder={numPlaceholder}
          style={{ ...css.input, fontWeight: 700, fontSize: 15 }}
        />
        <input
          name={textName}
          value={textVal}
          onChange={onChange}
          placeholder={textPlaceholder}
          style={css.input}
        />
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
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

/* ── Field wrapper ── */
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

/* ── Styles — same tokens as SiteSettings / AboutUs ── */
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
  sectionIcon: { fontSize: 22, lineHeight: 1 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.2 },
  sectionSubtitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  sectionBody: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
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
    minHeight: 80,
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 14,
    border: '1.5px solid #f0f0f0',
    borderRadius: 10,
    background: '#fafafa',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
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