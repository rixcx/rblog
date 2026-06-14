import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display } from "next/font/google";
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

// export const ubuntu = Ubuntu({
//   variable: "--font-ubuntu",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

export const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "r.blog",
  description: "",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="min-h-screen flex flex-col bg-[url(/images/global/bg_pattern.png)] bg-top overflow-x-hidden bg-primary-beige">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${ibmPlexSansJP.variable} ${playfairDisplay.variable} antialiased min-h-screen color-primary-black`}>
        <ScrollToTop />
        <div>
          <div className="relative w-full md:max-w-283.75 mx-auto my-10.5 p-1.5 md:p-15 pt-16 md:pt-28 pb-16 bg-primary-red">
            <Header/>
            <main className="relative deco md:max-w-230 mx-auto min-h-135 py-12 md:py-30 px-2 md:px-15 bg-primary-white rounded-2xl">
              {children}
            </main>
            <Footer/>
          </div>
        </div>
      </body>
    </html>
  );
}
