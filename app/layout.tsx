import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display, Ubuntu } from "next/font/google";
import "@/app/styles/globals.css";
import styles from "@/app/styles/components/layout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <GoogleAnalytics />
      </head>
      <body className={`${ibmPlexSansJP.variable} ${ubuntu.variable} ${playfairDisplay.variable}`}>
        <ScrollToTop />
        <div className={styles.wrap}>
          <Header />
          <main className={styles.main}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
