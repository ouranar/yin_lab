import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { RecordDirectory } from "@/components/site/RecordDirectory";
import { isSiteLocale, type SiteLocale } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalizedPublicationsPage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);

  return (
    <>
      <PageHero hero={data.publications.hero} />

      <section className="section-shell">
        <RecordDirectory groups={data.publications.groups} locale={locale} />
      </section>
    </>
  );
}
