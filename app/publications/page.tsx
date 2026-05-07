import { PageHero } from "@/components/site/PageHero";
import { RecordDirectory } from "@/components/site/RecordDirectory";
import { readSiteData } from "@/lib/site-data";

export default async function PublicationsPage() {
  const data = await readSiteData();

  return (
    <>
      <PageHero hero={data.publications.hero} />

      <section className="section-shell">
        <RecordDirectory groups={data.publications.groups} />
      </section>
    </>
  );
}
