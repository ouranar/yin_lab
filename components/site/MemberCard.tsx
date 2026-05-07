import Link from "next/link";
import { defaultSiteLocale, getLocalizedMemberName, type SiteLocale, withLocalePath } from "@/lib/i18n";
import { getMemberRouteSlug } from "@/lib/site-data";
import type { Member } from "@/types/site";

export function MemberCard({ member, locale = defaultSiteLocale }: { member: Member; locale?: SiteLocale }) {
  const name = getLocalizedMemberName(member, locale);

  return (
    <article className="member-card">
      <div className="member-card__media">
        <img alt={name} src={member.image} />
      </div>
      <div className="member-card__body">
        <p>{member.title}</p>
        <h3>
          <Link href={withLocalePath(locale, `/members/${getMemberRouteSlug(member)}`)}>{name}</Link>
        </h3>
      </div>
    </article>
  );
}
