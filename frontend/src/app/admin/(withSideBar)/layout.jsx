'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from './sidebar.module.css';
import l from './dashboard/dashboard.module.css';
  import { useAuth } from '@/context/AuthContext';

import { 
  FiMenu, FiChevronLeft, FiChevronRight, FiGrid, 
  FiUsers, FiBarChart2, FiSettings, FiActivity, FiChevronDown, 
  FiLogOut,
  FiTrash2
} from 'react-icons/fi';
import ReusableModal from '@/adminComponent/Modal/ReusableModal';
import ConfirmBox from '@/adminComponent/confirmationBox/ConfirmationBox';
import { MdMiscellaneousServices } from 'react-icons/md';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // LOGOUT 
  const [open, setOpen] = useState(false);
  const { user, loading, logout, isAuthenticated } = useAuth();
  
  
  
  const handleLogout = async (e) => {

  try {
    await logout();
    router.push("/admin/login"); 
  } catch (err) {
  } finally {
    
  }
};
const handleCancelLogout = () => {
  setOpen(false);
};
// LOGOUT END
  const menuConfig = [
    { label: 'My Details', icon: <FiGrid className={s.icon} />, path: '/admin/dashboard' },
    { 
      label: 'Home Page', 
      icon: <FiBarChart2 className={s.icon} />,
      submenu: [
        { label: 'Hero Section', path: '/admin/hero' },
        { label: 'First Cards', path: '/admin/firstcards' },
        { label: 'Feature Cards', path: '/admin/featurecards' },
        { label: 'Why Choose Us', path: '/admin/whychoose' },
        { label: 'Testimonial', path: '/admin/testimonial' },
        { label: 'Product', path: '/admin/products' },
        { label: 'Gallery', path: '/admin/gallery' },
        { label: 'Stats', path: '/admin/stats' },
        { label: 'Scroll Ticker Hero', path: '/admin/ticker' },
        // { label: 'Scroll Ticker Hero', path: '/admin/ticker' },
      ]
    },
    { 
      label: 'About Us Page', 
      icon: <FiUsers className={s.icon} />,
      submenu: [
        { label: 'Fixed Content', path: '/admin/aboutusFixed' },
        { label: 'Add Process', path: '/admin/aboutusfeatures' },
      ]
    },
    { 
      label: 'Service Page', 
      icon: <FiUsers className={s.icon} />,
      submenu: [
        { label: 'Fixed Content', path: '/admin/serviceFixed' },
        { label: 'Add Feature', path: '/admin/servicefeatures' },
        { label: 'Bottom Feature', path: '/admin/moreservice' },
      ]
    },
    { label: 'Users', icon: <FiUsers className={s.icon} />, path: '/admin/users' },
    { label: 'Miscellaneous', icon: <FiSettings className={s.icon} />, path: '/admin/miscellaneous' },
    { label: 'Change Password', icon:<MdMiscellaneousServices className={s.icon} />, path: '/admin/changepassword' },
    // { label: 'Log Out', icon: <FiLogOut className={s.icon} />, path: '/dashboard/settings' },
  ];

  const handleSubmenuToggle = (label) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenSubmenu(openSubmenu === label ? null : label);
  };


  return (
    <>
   <div>

      <ConfirmBox
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout }
        onCancel={handleCancelLogout}
        icon={<FiLogOut />}
        title="You Want to Log Out?"
        description="Are you sure you want to log out? Your current session will be ended."
        confirmText="Log Out"
        cancelText="Cancel"
      />

    </div>

      <div className={`${l.layoutWrapper}`}>
        
        {/* Mobile Dark Backdrop Sheet */}
      <div 
        className={`${l.overlay} ${isMobileOpen ? l.overlayVisible : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* --- DASHBOARD NAVIGATION SIDEBAR --- */}
      <aside className={`${s.sidebar} ${isCollapsed ? s.collapsed : s.expanded} ${isMobileOpen ? s.mobileOpen : ''}`}>
        <div>
          <div className={s.sidebarHeader}>
            {!isCollapsed && (
              <div className={s.logoArea}>
                <FiActivity className={s.logoIcon} />
                <span> ADMIN</span>
              </div>
            )}
            {isCollapsed && <FiActivity className={s.logoIcon} style={{ margin: '0 auto' }} />}
            
            <button className={`${s.toggleBtn} hidden md:flex`} onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          <nav className={s.navLinks}>
            {menuConfig.map((item, idx) => {
              const hasSubmenu = !!item.submenu;
              const isSubmenuOpen = openSubmenu === item.label;

              if (hasSubmenu) {
                return (
                  <div key={idx} className={s.menuGroup}>
                    <button onClick={() => handleSubmenuToggle(item.label)} className={s.navItem}>
                      <div className={s.navItemContent}>
                        {item.icon}
                        {!isCollapsed && <span className={s.linkLabel}>{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <FiChevronDown className={`${s.chevron} ${isSubmenuOpen ? s.chevronOpen : ''}`} />
                      )}
                    </button>
                    
                    <div className={`${s.submenu} ${isSubmenuOpen && !isCollapsed ? s.submenuOpen : ''}`}>
                      {item.submenu.map((sub, subIdx) => (
                        <Link 
                        key={subIdx} 
                        href={sub.path} 
                        className={s.subNavItem}
                        onClick={() => setIsMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link key={idx} href={item.path} className={s.navItem} onClick={() => setIsMobileOpen(false)}>
                  <div className={s.navItemContent}>
                    {item.icon}
                    {!isCollapsed && <span className={s.linkLabel}>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
              <div className={s.navItem + ' ' + s.logout}  onClick={() => setOpen(true)}>
                <span className={s.navItemContent}>
                  <FiLogOut className={s.icon} /> <span className={s.linkLabel}>log Out</span>
                </span>
              </div>

          </nav>
        </div>

      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className={l.mainContent}>{children}</main>
    </div>


    </>
  );
}