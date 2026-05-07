import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, splitParagraphs } from "@/lib/format";
import { findNewsBySlug } from "@/lib/site-data";
import { getSiteUiText, isSiteLocale, type SiteLocale, withLocalePath } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalizedNewsDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function LocalizedNewsDetailPage({ params }: LocalizedNewsDetailPageProps) {
  const { locale: rawLocale, slug } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const item = findNewsBySlug(data, slug);
  const ui = getSiteUiText(locale);

  if (!item) {
    notFound();
  }

  const hasImage = Boolean(item.image?.trim());
  const isExternalRelatedLink = item.relatedLink ? /^(https?:)?\/\//.test(item.relatedLink) : false;

  return (
    <section className="section-shell section-shell--detail">
      <div className="detail-header">
        <span>{formatDate(item.date, locale)}</span>
        <b>{item.label}</b>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <div className="page-hero__actions">
          <Link className="button-link button-link--secondary" href={withLocalePath(locale, "/news")}>
            {ui.news.backToNews}
          </Link>
          {item.relatedLink ? (
            <Link
              className="button-link button-link--primary"
              href={item.relatedLink}
              target={isExternalRelatedLink ? "_blank" : undefined}
            >
              {ui.news.relatedLink}
            </Link>
          ) : null}
        </div>
      </div>

      {hasImage ? (
        <div className="detail-media">
          <img alt={item.title} src={item.image} />
        </div>
      ) : null}

      <div className="detail-body">
        {splitParagraphs(item.content).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
