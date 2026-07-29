import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display, Ubuntu } from "next/font/google";
import "@/app/styles/common/reset.css";
import "@/app/styles/globals.scss";
import styles from "@/app/layout.module.scss";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import ScrollToTop from "@/app/components/ScrollToTop";
import GoogleAnalytics from "@/app/components/GoogleAnalytics/GoogleAnalytics";

export const ibmPlexSansJP = IBM_Plex_Sans_JP({
  variable: "--font-ibm-plex-sans-jp",
  weight: ["400","500", "700"],
  subsets: ["latin"],
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
