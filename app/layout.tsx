import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { I18nProvider } from "@/components/i18n-provider";
import { cookies } from "next/headers";
import { normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/profile.service";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Personal Operating System",
  description: "Organize purpose, areas, goals, projects, routines, processes, tasks, and knowledge.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get("app-locale")?.value
  const profile = cookieLocale ? null : await getCurrentProfile(await createClient())
  const locale = normalizeLocale(cookieLocale || profile?.locale)
  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <I18nProvider locale={locale}><TooltipProvider><AppShell>{children}</AppShell></TooltipProvider></I18nProvider>
      </body>
    </html>
  );
}
