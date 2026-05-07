import { SectionHeading } from "@/components/site/SectionHeading";
import { readSiteData } from "@/lib/site-data";

export default async function AboutPage() {
  const data = await readSiteData();

  return (
    <>
      <section className="about-hero">
        <div className="about-hero__content">
          <p className="page-hero__eyebrow">{data.about.hero.eyebrow}</p>
          <h1>{data.about.hero.title}</h1>
          <p className="about-hero__subtitle">{data.about.hero.subtitle}</p>
          {data.about.hero.description ? <p className="about-hero__description">{data.about.hero.description}</p> : null}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading title={data.about.introTitle} />
        <div className="about-intro">
          <div className="about-intro__main">
            <div className="about-intro__text">
              {data.about.introText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {data.about.introImage ? (
              <div className="about-intro__media">
                <img alt={data.about.introImageAlt ?? "实验室介绍配图"} src={data.about.introImage} />
              </div>
            ) : null}
          </div>
          <div className="highlight-grid highlight-grid--intro">
            {data.about.introHighlights.map((item) => (
              <article key={item.id} className="info-chip">
                <strong>{item.value}</strong>
                <span>{item.title}</span>
                <p>{item.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading title={data.about.timelineTitle} description={data.about.timelineSubtitle} />
        <div className="timeline">
          {data.about.timeline.map((item) => (
            <article key={item.id} className="timeline__item">
              <div className="timeline__card">
                <span>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="timeline__node">
                <img alt={item.title} src={item.image} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading title={data.about.goalsTitle} description={data.about.goalsStatement} />
        <div className="goals-layout">
          <div className="goals-layout__text">
            {data.about.goalsText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="highlight-grid highlight-grid--goals">
            {data.about.goalsCards.map((item) => (
              <article key={item.id} className="info-chip">
                <strong>{item.value}</strong>
                <span>{item.title}</span>
                <p>{item.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
