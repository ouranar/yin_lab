import Link from "next/link";
import { getMemberRouteSlug } from "@/lib/site-data";
import type { Member } from "@/types/site";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="member-card">
      <div className="member-card__media">
        <img alt={member.name} src={member.image} />
      </div>
      <div className="member-card__body">
        <p>{member.title}</p>
        <h3>
          <Link href={`/members/${getMemberRouteSlug(member)}`}>{member.name}</Link>
        </h3>
      </div>
    </article>
  );
}
