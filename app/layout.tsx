import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'
import { BottomNav } from '@/components/BottomNav'
import { getUser } from '@/lib/auth/getUser'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instructor Room Checker",
  description: "Room booking and scheduling system for college instructors",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-100" suppressHydrationWarning>
        <Providers>
          <div className="pb-20">
            {children}
          </div>
          <BottomNav isAdmin={user?.isAdmin ?? false} />
        </Providers>
      </body>
    </html>
  );
}
