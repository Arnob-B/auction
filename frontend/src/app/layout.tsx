import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import {Inter, Open_Sans} from "next/font/google"

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});
const open_sans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans'
});

export const metadata: Metadata = {
  title: "Mock IPL Auction",
  description: "Mock IPL Auction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${open_sans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
