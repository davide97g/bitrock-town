import Sidebar from "@/components/sidebar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitrock Hours",
  description: "Gestione presenze, ferie e permessi",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense>
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
        </Suspense>
      </body>
    </html>
  );
}
