import Link from "next/link";
import type { NavItem } from "@/types/site";

type SiteHeaderProps = {
  labName: string;
  shortName: string;
  navigation: NavItem[];
  adminLabel: string;
};

export function SiteHeader({ labName, shortName, navigation, adminLabel }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/">
          <span className="site-brand__mark">{shortName}</span>
          <span className="site-brand__text">
            <strong>{labName}</strong>
            <small>{shortName}</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {navigation.map((item) => (
            <Link key={item.href} className="site-nav__link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="admin-entry" href="/admin/login">
          {adminLabel}
        </Link>
      </div>
    </header>
  );
}
