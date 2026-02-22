import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display } from "next/font/google";
import "./styles/global/globals.css?${Date.now()}";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const ibmPlexSansJP = IBM_Plex_Sans_JP({
  variable: "--font-ibm-plex-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

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
    <html lang="js">
      <body className={`${ibmPlexSansJP.className} ${playfairDisplay.variable} antialiased min-h-screen color-primary-black bg-primary-beige`}>
        <div className="min-h-screen flex flex-col bg-[url(/images/global/bg_pattern.png)] bg-top">
          <div className="relative w-full max-w-283.75 mx-auto my-10.5 p-6 pt-28 pb-16 bg-primary-red">
            <Header/>
            <main className="relative deco max-w-230 mx-auto min-h-135 py-30 px-15 bg-primary-white rounded-2xl">
              {children}
            </main>
            <Footer/>
          </div>
        </div>
      </body>
    </html>
  );
}
