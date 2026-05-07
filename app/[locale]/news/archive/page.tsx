import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { getArchivedNews } from "@/lib/site-data";
import { getSiteUiText, isSiteLocale, type SiteLocale } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalizedNewsArchivePage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const items = getArchivedNews(data);
  const ui = getSiteUiText(locale);

  return (
    <>
      <PageHero
        hero={{
          eyebrow: ui.news.archiveEyebrow,
          title: data.news.archiveTitle,
          subtitle: ui.news.archiveHeroSubtitle,
          description: data.news.archiveSubtitle,
        }}
      />

      <section className="section-shell">
        <div className="card-grid card-grid--news">
          {items.length ? items.map((item) => <NewsCard key={item.id} archived item={item} locale={locale} />) : <p>{ui.news.emptyArchive}</p>}
        </div>
      </section>
    </>
  );
}
