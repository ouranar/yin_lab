import Link from "next/link";
import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { getArchivedNews, getVisibleNews, readSiteData } from "@/lib/site-data";

export default async function NewsPage() {
  const data = await readSiteData();
  const items = getVisibleNews(data);
  const archivedCount = getArchivedNews(data).length;

  return (
    <>
      <PageHero hero={data.news.hero} />

      <section className="section-shell">
        <div className="archive-banner">
          <div>
            <p className="section-heading__eyebrow">Archive</p>
            <h2>{data.news.archiveTitle}</h2>
            <p>{data.news.archiveSubtitle}</p>
          </div>
          <Link className="button-link button-link--secondary" href="/news/archive">
            查看归档 ({archivedCount})
          </Link>
        </div>

        <div className="card-grid card-grid--news">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
