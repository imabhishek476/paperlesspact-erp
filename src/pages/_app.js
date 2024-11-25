import { Partytown } from '@builder.io/partytown/react';
import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Lato } from "next/font/google";
import ChatIcon from "@mui/icons-material/Chat";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Script from "next/script";
import Image from "next/image";
import CookieSnackbar from "@/components/CookieSnackbar/cookieSnackbar";
import HelpMenu from "../components/Dashboard/HelpMenu";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#151513",
    },
    secondary: {
      main: "#E8713C",
    },
  },
  typography: {
    fontFamily: lato.style.fontFamily,
  },
});

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const { events, pathname } = useRouter();
  const hideChat = !pathname.includes("/sign");
  const hideHelp = pathname.includes("/onboarding")|| pathname.includes("print") || pathname === '/';
  // console.log(pathname.includes("/onboarding"))
  // console.log(pathname.includes("/"))
  console.log(pathname === '/')

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", end);
    events.on("routeChangeError", end);
    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", end);
      events.off("routeChangeError", end);
    };
  }, [events]);
  return (
    <>
      {" "}
      <style jsx global>{`
        html {
          font-family: ${lato.style.fontFamily};
        }
      `}</style>
      {/* {true ? ( */}
      {loading ? (
        <LoadingPage />
      ) : (
        <ThemeProvider theme={theme}>
          <Partytown debug={true} forward={['dataLayer.push']} />
          <main className={`${lato.variable} font-sans`}>
            <Component {...pageProps} />
            {/* analytics scripts */}

            <Script
              type="text/partytown"
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '986705319287274');fbq('track', 'PageView');`,
              }}
            ></Script>
            <noscript>
              <Image
                height="1"
                width="1"
                alt=""
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=986705319287274&ev=PageView&noscript=1"
              />
            </noscript>
            <Script
              type="text/partytown"
              async
              src="https://www.googletagmanager.com/gtag/js?id=AW-11328680492"
            ></Script>
            <Script
              type="text/partytown"
              strategy="afterInteractive"
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
  
        gtag('config', 'AW-11328680492');`,
              }}
            ></Script>

            {/* chat and scroll to top button   */}
          </main>

          {/* cookie permission snackbar */}
          {!hideHelp && <div className="fixed bottom-1  lg:bottom-5 right-1 lg:right-5 z-10">
          </div>}
          { !pathname.includes("print") &&
            <CookieSnackbar />
          }
        </ThemeProvider>
      )}
    </>
  );
}
