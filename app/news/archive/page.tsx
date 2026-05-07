import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { getArchivedNews, readSiteData } from "@/lib/site-data";

export default async function NewsArchivePage() {
  const data = await readSiteData();
  const items = getArchivedNews(data);

  return (
    <>
      <PageHero
        hero={{
          eyebrow: "News Archive",
          title: data.news.archiveTitle,
          subtitle: "历史新闻归档",
          description: data.news.archiveSubtitle,
        }}
      />

      <section className="section-shell">
        <div className="card-grid card-grid--news">
          {items.length ? items.map((item) => <NewsCard key={item.id} archived item={item} />) : <p>暂无归档内容</p>}
        </div>
      </section>
    </>
  );
}
