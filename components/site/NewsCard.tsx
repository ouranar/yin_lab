import Link from "next/link";
import { classNames, formatDate } from "@/lib/format";
import { defaultSiteLocale, getSiteUiText, type SiteLocale, withLocalePath } from "@/lib/i18n";
import type { NewsItem } from "@/types/site";

export function NewsCard({
  item,
  archived = false,
  locale = defaultSiteLocale,
}: {
  item: NewsItem;
  archived?: boolean;
  locale?: SiteLocale;
}) {
  const hasImage = Boolean(item.image?.trim());
  const ui = getSiteUiText(locale);

  return (
    <article className={classNames("news-card", !hasImage && "news-card--text-only")}>
      {hasImage ? (
        <div className="news-card__media">
          <img alt={item.title} src={item.image} />
        </div>
      ) : null}
      <div className="news-card__body">
        <div className="news-card__meta">
          <span>{formatDate(item.date, locale)}</span>
          <b>{archived ? ui.news.archivedBadge : item.label}</b>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <Link className="button-link button-link--ghost" href={withLocalePath(locale, `/news/${item.slug}`)}>
          {ui.news.viewDetails}
        </Link>
      </div>
    </article>
  );
}
