import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laman Auto UI",
  description: "Laman Auto UI Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-gray-50">
            {user && <Sidebar />}
            <div className={`flex-1 ${user ? 'ml-64' : ''}`}>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 