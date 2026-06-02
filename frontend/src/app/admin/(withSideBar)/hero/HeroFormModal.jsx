'use client';

import { useEffect, useState } from 'react';
import styles from './heroForm.module.css';
import add from '../../../../adminComponent/css/addBtn.module.css';


import "../../../../css/hero.module.css"

import {
  createHeroSection,
  updateHeroSection,
} from '@/services/homeApi';

import { FiImage, FiTrash2, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { handleApiMessage } from '@/adminComponent/ToastMessageHandler';
import { GiBarn, GiBee, GiChicken, GiCorn, GiCow, GiDuck, GiFarmer, GiFarmTractor, GiFishCorpse, GiFishingNet, GiFruitBowl, GiFruitTree, GiGoat, GiPig, GiPlantRoots, GiRabbit, GiSheep, GiWateringCan, GiWheat } from 'react-icons/gi';
import { FaAppleAlt, FaCarrot, FaEgg, FaFish, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';

export default function HeroForm({
  initialData = null,
  mode = 'create',
  onSuccess,
}) {
  const imageBasePath =
    process.env.NEXT_PUBLIC_BASE_CONTENT_URL;

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

const icons = {
  // Poultry
  GiChicken,
  FaEgg,
  GiDuck,

  // Livestock
  GiCow,
  GiGoat,
  GiPig,
  GiRabbit,
  GiSheep,

  // Fish Farming
  FaFish,
  GiFishCorpse,
  GiFishingNet,

  // Agriculture
  FaLeaf,
  FaSeedling,
  GiWheat,
  GiCorn,
  FaCarrot,
  FaAppleAlt,
  GiFruitTree,
  GiFruitBowl,
  GiPlantRoots,

  // Farming Equipment
  GiFarmTractor,
  FaTractor,
  GiWateringCan,
  GiBarn,
  GiFarmer,

  // Others
  GiBee,
};

const [form, setForm] = useState({
  tab: 'tab',
  tab_icon: '',
  tab_class: 'tab--poultry',
  bg_class: 'bgPanel--poultry',
  color: 'sahi',
  eyebrow: 'an',
  headline: 'sa',
  accent_line: 'sa',
  sub: 'sa',
  label: 'a',
  href: 'sa',
  image: null,
});
const colorMap = {
  "tab--poultry": "var(--hero-poultry)",
  "tab--agri": "var(--hero-agri)",
  "tab--fish": "var(--hero-fish)",
  "tab--color2": "var(--color2)",
  "tab--color3": "var(--color3)",
  "tab--color4": "var(--color4)",
  "tab--color5": "var(--color5)",
  "tab--color6": "var(--color6)",
  "tab--color7": "var(--color7)",
};


const SelectedIcon = icons[form.tab_icon];
const emptyForm = {
  tab: '', tab_icon: '',   tab_class: 'tab--poultry',
  bg_class: 'bgPanel--poultry',
  color: '', eyebrow: '', headline: '', accent_line: '',
  sub: '', label: '', href: '', image: null,
};

// In useEffect, reset form when initialData is null (add mode)
/* Populate edit data */
useEffect(() => {
  if (initialData) {
    setForm({ ...initialData, image: null });
      setPreview(
        `${imageBasePath}/${initialData.image}`
      );
  } else {
    setForm(emptyForm);   // ← reset when switching to add mode
    setPreview(null);
  }
}, [initialData]);


  /* Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* File Change */
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };


  

  /* Remove Image */
  const removeImage = () => {
    setPreview(null);

    setForm((prev) => ({
      ...prev,
      image: null,
    }));
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      let response;
      
      if (mode === 'edit') {
        response = await updateHeroSection(
          initialData.id,
          formData
        );
        handleApiMessage(response?.message);
        
      } else {   
        response = await createHeroSection(formData);
        console.log(response.message)
        
        handleApiMessage(response?.message);
      }
      
  
      onSuccess?.(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
console.log(form)
  return (
    <form
       className={styles.form}
  onSubmit={handleSubmit}
  encType="multipart/form-data"
    >
      <div className={styles.top}>
        <h2>
          {mode === 'edit'
            ? 'Edit Hero Section'
            : 'Create Hero Section'}
        </h2>
      </div>

      <div className={styles.grid}>
<label htmlFor="">Tab Label</label>
        <input
          name="tab"
          value={form.tab}
          onChange={handleChange}
          placeholder="Tab"
          className={styles.input}
  required

        />
<label htmlFor="">Accent Line</label>

        <input
  name="accent_line"
  value={form.accent_line}
  onChange={handleChange}
  placeholder="Accent Line"
  className={styles.input}
  required
/>
<label htmlFor="">Heading</label>

        <input
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="Headline"
          className={styles.input}
  required

        />
<label htmlFor="">Button Label</label>

        <input
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Label"
          className={styles.input}
  required

        />
<label htmlFor="">Link for Button</label>
        <input
          name="href"
          value={form.href}
          onChange={handleChange}
          placeholder="Link"
          className={styles.input}
  required

        />

<label htmlFor="">Primary Color</label>
<div className={styles.colorSelectWrapper}>

  {/* <select
    name="color"
    value={form.color}
    onChange={handleChange}
    className={styles.input}
    required
  >
    <option value="">Select</option>

    <option value="tab--poultry">tab--poultry</option>
    <option value="tab--agri">tab--agri</option>
    <option value="tab--fish">tab--fish</option>

    <option value="tab--color2">tab--color2</option>
    <option value="tab--color3">tab--color3</option>
    <option value="tab--color4">tab--color4</option>
    <option value="tab--color5">tab--color5</option>
    <option value="tab--color6">tab--color6</option>
    <option value="tab--color7">tab--color7</option>
  </select>

  <div
    className={styles.colorPreview}
    style={{
      background: colorMap[form.color] || "#e5e7eb",
    }}
  /> */}
  <div className={styles.colorPickerWrapper}>
  <input
    type="color"
    name="color"
    value={form.color || "#e8a045"}
    onChange={handleChange}
    className={styles.colorPicker}
  />

  <span>{form.color}</span>
</div>
</div>


<input
  name="bg_class"
  value={form.bg_class || "bgPanel--poultry"}
  onChange={handleChange}
  placeholder="Background Class"
  className={styles.input}
hidden
/>

<input
  name="tab_class"
  value={form.tab_class || "tab--poultry"}
  onChange={handleChange}
  placeholder="#e8a045"
  className={styles.input}
hidden
/>

<input
  name="eyebrow"
  value={form.eyebrow}
  onChange={handleChange}
  placeholder="Eyebrow"
  className={styles.input}
  required
/>

<input
  name="sub"
  value={form.sub}
  onChange={handleChange}
  placeholder="Sub text"
  className={styles.input}
  required
/>


        {/* ICON SELECT */}

        {/* <select
          name="tab_icon"
          value={form.tab_icon}
          onChange={handleChange}
          className={styles.input}
  required

        >
          <option value="">Select Icon</option>

          <option value="GiChicken">
            GiChicken
          </option>

          <option value="GiCow">
            GiCow
          </option>
        </select> */}


        <div className={styles.iconSelectWrapper}>
  <select
    name="tab_icon"
    value={form.tab_icon}
    onChange={handleChange}
    className={styles.input}
    required
  >
    <option value="">Select Icon</option>

    <option value="GiChicken">GiChicken</option>

    <option value="GiCow">GiCow</option>
    <option value="GiGoat">GiGoat</option>
    <option value="GiPig">GiPig</option>
    <option value="GiRabbit">GiRabbit</option>
    <option value="GiSheep">GiSheep</option>

    <option value="FaFish">FaFish</option>
    <option value="GiFishCorpse">GiFishCorpse</option>
    <option value="GiFishingNet">GiFishingNet</option>

    <option value="FaLeaf">FaLeaf</option>
    <option value="FaSeedling">FaSeedling</option>
    <option value="GiWheat">GiWheat</option>
    <option value="GiCorn">GiCorn</option>
    <option value="FaCarrot">FaCarrot</option>
    <option value="FaAppleAlt">FaAppleAlt</option>
    <option value="GiFruitTree">GiFruitTree</option>
    <option value="GiFruitBowl">GiFruitBowl</option>
    <option value="GiPlantRoots">GiPlantRoots</option>

    <option value="GiFarmTractor">GiFarmTractor</option>
    <option value="FaTractor">FaTractor</option>
    <option value="GiWateringCan">GiWateringCan</option>
    <option value="GiBarn">GiBarn</option>
    <option value="GiFarmer">GiFarmer</option>

    <option value="GiBee">GiBee</option>
  </select>

  <div className={styles.iconPreview}>
    {SelectedIcon && <SelectedIcon />}
  </div>
</div>

        {/* IMAGE */}

        <div className={styles.imageSection}>

          <label className={styles.uploadBox}>
            <FiUpload />

            <span>Upload Image</span>

      <input
  type="file"
  name="image"
  hidden
  onChange={handleFile}
  required={mode === "create"}
/>
          </label>

          {preview && (
            <div className={styles.previewWrapper}>

              <img
                src={preview}
                alt="preview"
                className={styles.preview}
              />

              <button
                type="button"
                className={styles.removeBtn}
                onClick={removeImage}
              >
                <FiTrash2 />
              </button>

            </div>
          )}
        </div>

      </div>

      <button
        type="submit"
        className={add.addButton}
      >
        {loading
          ? 'Saving...'
          : mode === 'edit'
          ? 'Update Hero'
          : 'Create Hero'}
      </button>


    </form>
  );
}