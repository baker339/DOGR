"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Extend the Window interface to include adsbygoogle as unknown[]
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdCodeWithoutRouterProps {
  router: any;
}

class AdCodeWithoutRouter extends React.Component<AdCodeWithoutRouterProps> {
  renderAds() {
    try {
      if (Array.isArray(window.adsbygoogle)) {
        (window.adsbygoogle as unknown[]).push({});
      }
    } catch (error) {
      console.error("Adsense error:", error);
    }
  }

  componentDidMount() {
    this.renderAds();
  }

  componentDidUpdate(prevProps: AdCodeWithoutRouterProps) {
    // Ensure ads are only re-rendered when the route changes
    if (this.props.router.asPath !== prevProps.router.asPath) {
      this.renderAds();
    }
  }

  render() {
    return (
      <div className="container mx-auto text-center" aria-hidden={true}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-format="fluid"
          data-ad-layout-key="-6s+eg+1g-3d+2z"
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
          data-ad-slot="6703865562"
        ></ins>
      </div>
    );
  }
}

const AdCode: React.FC = () => {
  const router = useRouter();
  return <AdCodeWithoutRouter router={router} />;
};

export default AdCode;
