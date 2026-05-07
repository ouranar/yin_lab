import Link from "next/link";
import {
  getShellAdminLabel,
  getShellLabName,
  getShellNavigationLabel,
  localeLabels,
  removeLocalePrefix,
  siteLocales,
  type SiteLocale,
  withLocalePath,
} from "@/lib/i18n";
import type { NavItem } from "@/types/site";

type SiteHeaderProps = {
  labName: string;
  shortName: string;
  navigation: NavItem[];
  adminLabel: string;
  locale: SiteLocale;
  pathname: string;
};

export function SiteHeader({ labName, shortName, navigation, adminLabel, locale, pathname }: SiteHeaderProps) {
  const currentPath = removeLocalePrefix(pathname);
  const brandName = getShellLabName(locale) || labName;
  const adminEntryLabel = getShellAdminLabel(locale) || adminLabel;
  const navLabel = locale === "en" ? "Primary navigation" : locale === "ja" ? "メインナビゲーション" : "主导航";
  const switcherLabel = locale === "en" ? "Language switcher" : locale === "ja" ? "言語切替" : "语言切换";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href={withLocalePath(locale, "/")}>
          <span className="site-brand__mark">{shortName}</span>
          <span className="site-brand__text">
            <strong>{brandName}</strong>
            <small>{shortName}</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label={navLabel}>
          {navigation.map((item) => (
            <Link key={item.href} className="site-nav__link" href={withLocalePath(locale, item.href)}>
              {getShellNavigationLabel(locale, item.href, item.label)}
            </Link>
          ))}
        </nav>

        <div className="site-header__controls">
          <div className="language-switcher" aria-label={switcherLabel}>
            {siteLocales.map((targetLocale) => (
              <Link
                key={targetLocale}
                className={`language-switcher__link ${targetLocale === locale ? "is-active" : ""}`}
                href={withLocalePath(targetLocale, currentPath)}
                hrefLang={targetLocale}
                lang={targetLocale}
              >
                {localeLabels[targetLocale]}
              </Link>
            ))}
          </div>

          <Link className="admin-entry" href="/admin/login">
            {adminEntryLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
