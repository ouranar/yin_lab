import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { readSiteData } from "@/lib/site-data";

export default async function ResearchPage() {
  const data = await readSiteData();

  return (
    <>
      <PageHero hero={data.research.hero} />

      <section className="section-shell">
        <SectionHeading title={data.research.directionsTitle} />
        <div className="card-grid card-grid--research-directions">
          {data.research.directions
            .filter((item) => item.visible !== false)
            .map((item) => (
              <article key={item.id} className="research-card research-card--direction">
                <div className="research-card__media research-card__media--direction">
                  <img alt={item.title} src={item.image} />
                </div>
                <div className="research-card__content research-card__content--direction">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <ul className="tag-list">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {item.link ? (
                    <Link className="button-link button-link--ghost" href={item.link}>
                      相关链接
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading title={data.research.projectsTitle} />
        <div className="card-grid card-grid--projects">
          {data.research.projects
            .filter((item) => item.visible !== false)
            .map((item) => (
              <article key={item.id} className="research-card research-card--stacked">
                <img alt={item.title} src={item.image} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <ul className="tag-list">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
        </div>
      </section>
    </>
  );
}
