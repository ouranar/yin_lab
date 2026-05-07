import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, splitParagraphs } from "@/lib/format";
import { findNewsBySlug, readSiteData } from "@/lib/site-data";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const data = await readSiteData();
  const item = findNewsBySlug(data, slug);

  if (!item) {
    notFound();
  }

  return (
    <section className="section-shell section-shell--detail">
      <div className="detail-header">
        <span>{formatDate(item.date)}</span>
        <b>{item.label}</b>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <div className="page-hero__actions">
          <Link className="button-link button-link--secondary" href="/news">
            返回新闻页
          </Link>
          {item.relatedLink ? (
            <Link className="button-link button-link--primary" href={item.relatedLink} target="_blank">
              相关链接
            </Link>
          ) : null}
        </div>
      </div>

      <div className="detail-media">
        <img alt={item.title} src={item.image} />
      </div>

      <div className="detail-body">
        {splitParagraphs(item.content).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
