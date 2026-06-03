import { Montserrat, Open_Sans, Dancing_Script } from 'next/font/google';
import '../globals.css';
import Footer from '../../includes/Footer';
import Navbar from './home/hero/Navbar';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-display-loaded',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body-loaded',
  weight: ['400', '600'],
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script-loaded',
  weight: ['400', '700'],
  display: 'swap',
});



export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}