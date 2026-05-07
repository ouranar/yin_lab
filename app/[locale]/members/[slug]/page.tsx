import Link from "next/link";
import { notFound } from "next/navigation";
import { findMemberBySlug } from "@/lib/site-data";
import {
  getLocalizedMemberNameParts,
  getSiteUiText,
  isSiteLocale,
  type SiteLocale,
  withLocalePath,
} from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalizedMemberDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const memberProfileHeading: Record<SiteLocale, string> = {
  zh: "个人资料",
  en: "Profile",
  ja: "プロフィール",
};

export default async function LocalizedMemberDetailPage({ params }: LocalizedMemberDetailPageProps) {
  const { locale: rawLocale, slug } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const decodedSlug = decodeURIComponent(slug);
  const member = findMemberBySlug(data, decodedSlug) ?? findMemberBySlug(data, slug);
  const ui = getSiteUiText(locale);

  if (!member) {
    notFound();
  }

  const { primaryName, secondaryName } = getLocalizedMemberNameParts(member, locale);
  const summaryParagraphs = member.summary
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const hasProfileContent =
    Boolean(member.birthDate) ||
    Boolean(member.hometown) ||
    Boolean(member.researchAreas.length) ||
    Boolean(member.email) ||
    Boolean(member.phone) ||
    Boolean(member.profileLink) ||
    Boolean(summaryParagraphs.length);

  return (
    <section className="section-shell section-shell--detail">
      <Link className="member-profile__back" href={withLocalePath(locale, "/members")}>
        {ui.members.backToMembers}
      </Link>

      <article className="member-profile">
        <div className="member-profile__hero">
          <div className="member-profile__portrait">
            <img alt={primaryName || member.name} src={member.image} />
          </div>

          <div className="member-profile__intro">
            {secondaryName ? <p className="member-profile__secondary-name">{secondaryName}</p> : null}
            <h1>{primaryName || member.name}</h1>
            <p className="member-profile__title">{member.title || ui.members.defaultTitle}</p>

            {member.email || member.phone || member.profileLink ? (
              <div className="member-profile__actions">
                {member.email ? (
                  <a className="button-link button-link--secondary" href={`mailto:${member.email}`}>
                    {ui.members.sendEmail}
                  </a>
                ) : null}
                {member.phone ? (
                  <a className="button-link button-link--secondary" href={`tel:${member.phone.replace(/\s+/g, "")}`}>
                    {ui.members.call}
                  </a>
                ) : null}
                {member.profileLink ? (
                  <Link className="button-link button-link--secondary" href={member.profileLink} target="_blank">
                    {ui.members.personalWebsite}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <section className="member-profile__section">
          <div className="member-profile__section-head">
            <h2>{memberProfileHeading[locale]}</h2>
          </div>

          {hasProfileContent ? (
            <dl className="member-profile__rows">
              {member.hometown ? (
                <div className="member-profile__row">
                  <dt>{ui.members.hometown}</dt>
                  <dd>{member.hometown}</dd>
                </div>
              ) : null}

              {member.birthDate ? (
                <div className="member-profile__row">
                  <dt>{ui.members.birthDate}</dt>
                  <dd>{member.birthDate}</dd>
                </div>
              ) : null}

              {member.researchAreas.length ? (
                <div className="member-profile__row">
                  <dt>{ui.members.researchAreas}</dt>
                  <dd>{member.researchAreas.join(" / ")}</dd>
                </div>
              ) : null}

              {member.email ? (
                <div className="member-profile__row">
                  <dt>{ui.members.email}</dt>
                  <dd>
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  </dd>
                </div>
              ) : null}

              {member.phone ? (
                <div className="member-profile__row">
                  <dt>{ui.members.phone}</dt>
                  <dd>
                    <a href={`tel:${member.phone.replace(/\s+/g, "")}`}>{member.phone}</a>
                  </dd>
                </div>
              ) : null}

              {member.profileLink ? (
                <div className="member-profile__row">
                  <dt>{ui.members.profileLink}</dt>
                  <dd>
                    <Link href={member.profileLink} target="_blank">
                      {member.profileLink}
                    </Link>
                  </dd>
                </div>
              ) : null}

              {summaryParagraphs.length ? (
                <div className="member-profile__row member-profile__row--summary">
                  <dt>{ui.members.summary}</dt>
                  <dd>
                    {summaryParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="member-profile__empty">{ui.members.emptyProfile}</p>
          )}
        </section>
      </article>
    </section>
  );
}
