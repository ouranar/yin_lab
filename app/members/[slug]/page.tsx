import Link from "next/link";
import { notFound } from "next/navigation";
import { findMemberBySlug, readSiteData } from "@/lib/site-data";

type MemberDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const splitMemberName = (name: string) => {
  const parts = name
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      primaryName: parts[1],
      secondaryName: parts[0],
    };
  }

  return {
    primaryName: name.trim(),
    secondaryName: "",
  };
};

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { slug } = await params;
  const data = await readSiteData();
  const decodedSlug = decodeURIComponent(slug);
  const member = findMemberBySlug(data, decodedSlug) ?? findMemberBySlug(data, slug);

  if (!member) {
    notFound();
  }

  const { primaryName, secondaryName } = splitMemberName(member.name);
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
      <Link className="member-profile__back" href="/members">
        返回成员页
      </Link>

      <article className="member-profile">
        <div className="member-profile__hero">
          <div className="member-profile__portrait">
            <img alt={member.name} src={member.image} />
          </div>

          <div className="member-profile__intro">
            {secondaryName ? <p className="member-profile__secondary-name">{secondaryName}</p> : null}
            <h1>{primaryName || member.name}</h1>
            <p className="member-profile__title">{member.title || "实验室成员"}</p>

            {member.email || member.phone || member.profileLink ? (
              <div className="member-profile__actions">
                {member.email ? (
                  <a className="button-link button-link--secondary" href={`mailto:${member.email}`}>
                    发送邮件
                  </a>
                ) : null}
                {member.phone ? (
                  <a className="button-link button-link--secondary" href={`tel:${member.phone.replace(/\s+/g, "")}`}>
                    电话联系
                  </a>
                ) : null}
                {member.profileLink ? (
                  <Link className="button-link button-link--secondary" href={member.profileLink} target="_blank">
                    个人主页
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <section className="member-profile__section">
          <div className="member-profile__section-head">
            <h2>Profile</h2>
          </div>

          {hasProfileContent ? (
            <dl className="member-profile__rows">
              {member.hometown ? (
                <div className="member-profile__row">
                  <dt>籍贯</dt>
                  <dd>{member.hometown}</dd>
                </div>
              ) : null}

              {member.birthDate ? (
                <div className="member-profile__row">
                  <dt>出生日期</dt>
                  <dd>{member.birthDate}</dd>
                </div>
              ) : null}

              {member.researchAreas.length ? (
                <div className="member-profile__row">
                  <dt>研究方向</dt>
                  <dd>{member.researchAreas.join(" / ")}</dd>
                </div>
              ) : null}

              {member.email ? (
                <div className="member-profile__row">
                  <dt>邮箱</dt>
                  <dd>
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  </dd>
                </div>
              ) : null}

              {member.phone ? (
                <div className="member-profile__row">
                  <dt>电话</dt>
                  <dd>
                    <a href={`tel:${member.phone.replace(/\s+/g, "")}`}>{member.phone}</a>
                  </dd>
                </div>
              ) : null}

              {member.profileLink ? (
                <div className="member-profile__row">
                  <dt>个人链接</dt>
                  <dd>
                    <Link href={member.profileLink} target="_blank">
                      {member.profileLink}
                    </Link>
                  </dd>
                </div>
              ) : null}

              {summaryParagraphs.length ? (
                <div className="member-profile__row member-profile__row--summary">
                  <dt>简介</dt>
                  <dd>
                    {summaryParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="member-profile__empty">该成员暂时还没有补充资料。</p>
          )}
        </section>
      </article>
    </section>
  );
}
