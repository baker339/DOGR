import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

// Extend the Window interface to add the `adsbygoogle` property
// declare global {
//   interface Window {
//     adsbygoogle: unknown[]; // Define adsbygoogle as an array of unknown types
//   }
// }

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        {/* <Script
          id="Adsense-id"
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
