import Link from "next/link";
import type { PageHero as PageHeroType } from "@/types/site";

export function PageHero({ hero }: { hero: PageHeroType }) {
  const hasSubtitle = Boolean(hero.subtitle?.trim());
  const hasDescription = Boolean(hero.description?.trim());

  return (
    <section className="page-hero">
      <div className="page-hero__content">
        <p className="page-hero__eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        {hasSubtitle ? <p className="page-hero__subtitle">{hero.subtitle}</p> : null}
        {hasDescription ? <p className="page-hero__description">{hero.description}</p> : null}
        {(hero.primaryAction || hero.secondaryAction) && (
          <div className="page-hero__actions">
            {hero.primaryAction ? (
              <Link className="button-link button-link--primary" href={hero.primaryAction.href}>
                {hero.primaryAction.label}
              </Link>
            ) : null}
            {hero.secondaryAction ? (
              <Link className="button-link button-link--secondary" href={hero.secondaryAction.href}>
                {hero.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
