import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PricePulse",
  description: "Track prices and save money",
};

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
