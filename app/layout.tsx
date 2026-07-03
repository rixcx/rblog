import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display, Noto_Sans_JP, Ubuntu} from "next/font/google";
import "@/app/styles/global/globals.css?${Date.now()}";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const ibmPlexSansJP = IBM_Plex_Sans_JP({
  variable: "--font-ibm-plex-sans-jp",
  weight: ["400","500", "700"],
  preload: false,
});

// export const notoSansJP = Noto_Sans_JP({
//   variable: "--font-noto-sans-jp",
//   weight: ["400","500", "700"],
//   preload: false,
// });

export const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "r.blog",
  description: "",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="min-h-screen bg-[url(/images/global/bg_pattern.png)] bg-top bg-[length:150px] md:bg-[length:210px] overflow-x-hidden bg-primary-beige">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <GoogleAnalytics />
      </head>
      <body className={`${ibmPlexSansJP.variable} ${ubuntu.variable} ${playfairDisplay.variable} min-h-screen color-primary-black`}>
        <ScrollToTop />
        <div>
          <div className="relative w-full md:max-w-283.75 mx-auto my-10.5 p-2.5 md:p-15 pt-16 md:pt-28 pb-16 bg-primary-red">
            <Header/>
            <main className="relative deco md:max-w-230 mx-auto min-h-135 py-12 md:py-30 px-4 md:px-15 bg-primary-white rounded-2xl">
              {children}
            </main>
            <Footer/>
          </div>
        </div>
      </body>
    </html>
  );
}
