import '../styles/globals.css';
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poppins.className}>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </main>
  );
}
