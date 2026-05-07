import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { getArchivedNews, getVisibleNews } from "@/lib/site-data";
import { getSiteUiText, isSiteLocale, type SiteLocale, withLocalePath } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalizedNewsPage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const items = getVisibleNews(data);
  const archivedCount = getArchivedNews(data).length;
  const ui = getSiteUiText(locale);

  return (
    <>
      <PageHero hero={data.news.hero} />

      <section className="section-shell">
        <div className="archive-banner">
          <div>
            <p className="section-heading__eyebrow">{ui.news.archiveEyebrow}</p>
            <h2>{data.news.archiveTitle}</h2>
            <p>{data.news.archiveSubtitle}</p>
          </div>
          <Link className="button-link button-link--secondary" href={withLocalePath(locale, "/news/archive")}>
            {ui.news.viewArchive} ({archivedCount})
          </Link>
        </div>

        <div className="card-grid card-grid--news">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
