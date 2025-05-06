import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laman Auto Admin",
  description: "Admin dashboard for Laman Auto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 p-6 overflow-auto w-full">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
} 