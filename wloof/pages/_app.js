import { useEffect } from 'react';
import '../styles/globals.css'

const liffId = process.env.NEXT_PUBLIC_LIFF_ID

function MyApp({ Component, pageProps }) {
  useEffect(async () => {
    const initLiff = async () => {
      const liff = (await import('@line/liff')).default;
      try {
      await liff.init({ liffId });
      } catch (error) {
      console.error('liff init error', error.message);
      }
      if (!liff.isLoggedIn()) {
      liff.login();
      }
      };
      initLiff();
  }, [])

  return <Component {...pageProps} />
}

export default MyApp