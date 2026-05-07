"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { NavItem } from "@/types/site";

type LayoutChromeProps = {
  children: React.ReactNode;
  navigation: NavItem[];
  adminLabel: string;
  labName: string;
  shortName: string;
  footerNote: string;
};

export function LayoutChrome({
  children,
  navigation,
  adminLabel,
  labName,
  shortName,
  footerNote,
}: LayoutChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <div className="page-shell">{children}</div>;
  }

  return (
    <div className="page-shell">
      <SiteHeader adminLabel={adminLabel} labName={labName} navigation={navigation} shortName={shortName} />
      <main className="page-main">{children}</main>
      <SiteFooter footerNote={footerNote} labName={labName} />
    </div>
  );
}
