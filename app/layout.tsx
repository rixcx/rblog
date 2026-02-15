import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, Playfair_Display } from "next/font/google";
import "./styles/global/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="js">
      <body
        className={`${ibmPlexSansJP.className} ${playfairDisplay.variable} antialiased`}
      >
      <div className="min-h-screen bg-teal-100">
        <div className="">
          {children}
        </div>
      </div>
      </body>
    </html>
  );
}
