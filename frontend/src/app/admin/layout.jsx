import { AuthProvider } from '@/context/AuthContext';
import './admin.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Admin Panel',
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
        <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </AuthProvider>
  );
}


