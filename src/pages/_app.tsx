import '../styles/globals.css';
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
        <title>Client Directory App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main className={poppins.className}>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </main>
    </>
  );
}
