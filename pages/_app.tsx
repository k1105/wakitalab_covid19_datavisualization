import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Head>
        <title>at that time — COVID-19 Pandemic</title>
      </Head>
      <Component {...pageProps} />
    </main>
  );
}
