import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Layout>
          {/* <Script
            id="Adsense-id"
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
            async
            strategy="afterInteractive"
            onError={(e) => {
              console.error("Script failed to load", e);
            }}
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          /> */}
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  );
}
