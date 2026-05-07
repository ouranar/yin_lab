import { MemberCard } from "@/components/site/MemberCard";
import { PageHero } from "@/components/site/PageHero";
import { getVisibleMemberGroups, readSiteData } from "@/lib/site-data";

export default async function MembersPage() {
  const data = await readSiteData();
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
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </>
  );
}
