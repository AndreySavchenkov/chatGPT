import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {useEffect, useState} from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');
  }, []);

  return <Component {...pageProps} apiKey={apiKey}/>
}
