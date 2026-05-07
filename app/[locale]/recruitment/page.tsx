import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { getSiteUiText, isSiteLocale, type SiteLocale } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalizedRecruitmentPage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const { recruitment } = data;
  const ui = getSiteUiText(locale);

  return (
    <>
      <PageHero hero={recruitment.hero} />

      <section className="section-shell recruitment-page">
        <article className="recruitment-story">
          <div className="recruitment-story__main">
            {recruitment.intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="recruitment-section recruitment-section--audience">
          <header className="recruitment-section__header">
            <p className="recruitment-section__eyebrow">{ui.recruitment.audienceEyebrow}</p>
            <h2>{recruitment.audience.title}</h2>
            <p>{recruitment.audience.intro}</p>
          </header>

          <ul className="recruitment-targets">
            {recruitment.audience.points.map((point, index) => (
              <li key={`audience-${index}`} className="recruitment-target">
                <span aria-hidden="true" className="recruitment-target__icon" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {recruitment.audience.note ? <p className="recruitment-section__note">{recruitment.audience.note}</p> : null}
        </section>

        <section className="recruitment-section recruitment-section--growth">
          <header className="recruitment-section__header">
            <p className="recruitment-section__eyebrow">{ui.recruitment.growthEyebrow}</p>
            <h2>{recruitment.growth.title}</h2>
            <p>{recruitment.growth.intro}</p>
          </header>

          <div className="recruitment-skill-grid">
            {recruitment.growth.cards.map((card) => (
              <article key={card.id} className="recruitment-skill-card">
                <div className="recruitment-skill-card__header">
                  <span aria-hidden="true" className="recruitment-skill-card__badge" />
                  <h3>{card.title}</h3>
                </div>
                <ul>
                  {card.items.map((item, index) => (
                    <li key={`${card.id}-${index}`}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="recruitment-cta">
          <div className="recruitment-cta__body">
            <p className="recruitment-section__eyebrow">{ui.recruitment.contactEyebrow}</p>
            <h2>{recruitment.callToAction.title}</h2>
            <p>{recruitment.callToAction.content}</p>
          </div>

          {recruitment.callToAction.href && recruitment.callToAction.linkLabel ? (
            <Link className="button-link button-link--primary" href={recruitment.callToAction.href}>
              {recruitment.callToAction.linkLabel}
            </Link>
          ) : null}
        </section>
      </section>
    </>
  );
}
