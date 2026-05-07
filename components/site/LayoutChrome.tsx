"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname, getShellFooterNote, getShellLabName } from "@/lib/i18n";
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
  const locale = getLocaleFromPathname(pathname);

  if (isAdminRoute) {
    return <div className="page-shell">{children}</div>;
  }

  return (
    <div className="page-shell">
      <SiteHeader
        adminLabel={adminLabel}
        labName={labName}
        locale={locale}
        navigation={navigation}
        pathname={pathname}
        shortName={shortName}
      />
      <main className="page-main">{children}</main>
      <SiteFooter footerNote={getShellFooterNote(locale) || footerNote} labName={getShellLabName(locale) || labName} />
    </div>
  );
}
