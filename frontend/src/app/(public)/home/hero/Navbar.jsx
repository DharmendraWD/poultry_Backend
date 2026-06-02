'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../../../css/navbar.module.css';
// import WhatsappBtn from '../../../../../includes/Button/WhatsappBtn';
import { useEffect } from 'react';
import logo from "../../../../../public/logo-cheeky2.png";
import Image from 'next/image';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  // { label: 'Pages', href: '/pages', hasDropdown: true },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();



  const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      <nav 
       className={`${styles.navbar} 
  ${scrolled ? styles.scrolled : ""} 
  ${pathname === "/contact" || pathname === "/gallery" ? styles.contact : ""}`}
      >
        <div className={styles.navbar__inner}>
          {/* Logo */}
          <Link href="/" className={`${styles.navbar__logo} transition-transform duration-200 
            hover:scale-105`}>
     
            <Image src={logo} alt="Logo" className='w-[51px] rounded-full' />

            <span className={styles.navbar__logo_text}>Western Poultry Breeding Farm Pvt. Ltd.</span>
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navbar__nav}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return link.hasDropdown ? (
                <li key={link.label}>
                  <span className={styles.has_dropdown}>
                    <Link
                      href={link.href}
                      className={isActive ? styles.active : ''}
                    >
                      {link.label}
                    </Link>
                  </span>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={isActive ? styles.active : ''}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* <WhatsappBtn /> */}
          </ul>

          {/* Mobile hamburger */}
          <button
            className={styles.navbar__hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              style={
                mobileOpen
                  ? { transform: 'rotate(45deg) translate(5px, 5px)' }
                  : {}
              }
            />
            <span style={mobileOpen ? { opacity: 0 } : {}} />
            <span
              style={
                mobileOpen
                  ? { transform: 'rotate(-45deg) translate(5px, -5px)' }
                  : {}
              }
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`${styles['navbar__mobile-drawer']} ${
          mobileOpen ? styles.open : ''
        }`}
      >

        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (

            <Link
              key={link.label}
              href={link.href}
              className={isActive ? styles.active : ''}
              onClick={() => setMobileOpen(false)}
              >
              {link.label}
            </Link>

          );
        })}
        {/* <WhatsappBtn /> */}
      </div>
    </>
  );
}