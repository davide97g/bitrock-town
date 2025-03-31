import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitrock Hours",
  description: "Gestione presenze, ferie e permessi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <main className="container mx-auto py-6 px-4">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
