import Link from "next/link";
import { formatDate } from "@/lib/format";
import { defaultSiteLocale, type SiteLocale, withLocalePath } from "@/lib/i18n";
import type { HomeActivity } from "@/types/site";

export function MarqueeStrip({ items, locale = defaultSiteLocale }: { items: HomeActivity[]; locale?: SiteLocale }) {
  const loopItems = [...items, ...items];

  return (
    <section className="marquee-section">
      <div className="marquee-track">
        {loopItems.map((item, index) => (
          <Link key={`${item.id}-${index}`} className="marquee-card" href={withLocalePath(locale, item.href)}>
            <span className="marquee-card__date">{formatDate(item.date, locale)}</span>
            <b>{item.label}</b>
            <strong>{item.title}</strong>
            <p>{item.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
