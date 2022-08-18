import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}
    >
      <div className="overflow-hidden h-[100vh]">
        <Navbar />
        <div className="flex">
          <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto md:ml-16">
            <Sidebar />
          </div>
          <div className="pt-8 p-2 flex flex-wrap justify-center overflow-auto h-[87vh] flex-1">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default MyApp;
