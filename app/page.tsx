import Link from "next/link";
import { MarqueeStrip } from "@/components/site/MarqueeStrip";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getFeaturedMember, getMemberRouteSlug, readSiteData } from "@/lib/site-data";

export default async function HomePage() {
  const data = await readSiteData();
  const leader = getFeaturedMember(data);
  const directions = data.research.directions.filter((item) => item.visible !== false);
  const overviewParagraphs = data.home.intro.content?.length ? data.home.intro.content : data.about.introText.slice(0, 2);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content home-hero__content--full">
          <div className="home-hero__main">
            <p className="home-hero__eyebrow">{data.home.hero.eyebrow}</p>
            <h1>{data.home.hero.title}</h1>
            <p className="home-hero__subtitle">{data.home.hero.subtitle}</p>
            <p className="home-hero__description">{data.home.hero.description}</p>
          </div>
          <div className="home-hero__actions">
            {data.home.hero.primaryAction ? (
              <Link className="button-link button-link--primary" href={data.home.hero.primaryAction.href}>
                {data.home.hero.primaryAction.label}
              </Link>
            ) : null}
            {data.home.hero.secondaryAction ? (
              <Link className="button-link button-link--secondary" href={data.home.hero.secondaryAction.href}>
                {data.home.hero.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <MarqueeStrip items={data.home.activities} />

        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue__mouse" />
          <span className="scroll-cue__line" />
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading title={data.home.intro.title} description={data.home.intro.description} />
        <div className="home-overview">
          <article className="highlight-panel">
            <div className="highlight-panel__text">
              {overviewParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className="button-link button-link--ghost" href={data.home.intro.href}>
              {data.home.intro.buttonLabel}
            </Link>
          </article>
          <div className="highlight-grid">
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
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-heading__eyebrow">Research</p>
            <h2>{data.research.directionsTitle}</h2>
          </div>
          <Link className="button-link button-link--secondary" href="/research">
            查看研究方向
          </Link>
        </div>
        <div className="card-grid card-grid--research-directions">
          {directions.map((item) => (
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
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-heading__eyebrow">Members</p>
            <h2>{data.home.membersLead.title}</h2>
            <p>{data.home.membersLead.description}</p>
          </div>
          <Link className="button-link button-link--secondary" href={data.home.membersLead.href}>
            {data.home.membersLead.buttonLabel}
          </Link>
        </div>
        {leader ? (
          <article className="leader-card">
            <div className="leader-card__media">
              <img alt={leader.name} src={leader.image} />
            </div>
            <div className="leader-card__content">
              <p className="leader-card__eyebrow">负责人</p>
              <h3>{leader.name}</h3>
              <strong>{leader.title}</strong>
              <p>{leader.summary}</p>
              {leader.researchAreas.length ? (
                <ul className="tag-list">
                  {leader.researchAreas.slice(0, 3).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              <div className="leader-card__actions">
                <Link className="button-link button-link--primary" href={`/members/${getMemberRouteSlug(leader)}`}>
                  查看负责人介绍
                </Link>
                <Link className="button-link button-link--secondary" href="/members">
                  查看全部成员
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <section className="section-shell">
        <article className="recruitment-banner">
          <div>
            <p className="section-heading__eyebrow">Recruitment</p>
            <h2>{data.home.recruitmentLead.title}</h2>
            <p>{data.home.recruitmentLead.description}</p>
          </div>
          <Link className="button-link button-link--primary" href={data.home.recruitmentLead.href}>
            {data.home.recruitmentLead.buttonLabel}
          </Link>
        </article>
      </section>
    </>
  );
}
