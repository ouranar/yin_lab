import type { Metadata } from "next";
import { LayoutChrome } from "@/components/site/LayoutChrome";
import { readSiteData } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yin-Lab：Artificial Intelligence in Education Lab",
  description: "Artificial intelligence in education lab website and content management system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await readSiteData();

  return (
    <html lang="zh-CN">
      <body>
        <LayoutChrome
          adminLabel={data.settings.adminLabel}
          footerNote={data.settings.footerNote}
          labName={data.settings.labName}
          navigation={data.navigation}
          shortName={data.settings.shortName}
        >
          {children}
        </LayoutChrome>
      </body>
    </html>
  );
}
