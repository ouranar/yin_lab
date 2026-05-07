import { notFound } from "next/navigation";
import { MemberCard } from "@/components/site/MemberCard";
import { PageHero } from "@/components/site/PageHero";
import { getVisibleMemberGroups } from "@/lib/site-data";
import { isSiteLocale, type SiteLocale } from "@/lib/i18n";
import { readLocalizedSiteData } from "@/lib/localized-site-data";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalizedMembersPage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as SiteLocale;
  const data = await readLocalizedSiteData(locale);
  const groups = getVisibleMemberGroups(data);

  return (
    <>
      <PageHero hero={data.members.hero} />

      <section className="section-shell">
        <div className="member-tabs">
          {groups.map((group) => (
            <a key={group.id} className="button-link button-link--secondary" href={`#${group.id}`}>
              {group.title}
            </a>
          ))}
        </div>

        {groups.map((group) => (
          <section key={group.id} className="member-group" id={group.id}>
            <h2>{group.title}</h2>
            <div className="card-grid card-grid--members">
              {group.items.map((member) => (
                <MemberCard key={member.id} member={member} locale={locale} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </>
  );
}
