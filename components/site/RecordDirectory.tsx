import Link from "next/link";
import { defaultSiteLocale, getSiteUiText, type SiteLocale } from "@/lib/i18n";
import type { RecordGroup } from "@/types/site";

type RecordDirectoryProps = {
  groups: RecordGroup[];
  locale?: SiteLocale;
};

export function RecordDirectory({ groups, locale = defaultSiteLocale }: RecordDirectoryProps) {
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.visible !== false),
    }))
    .filter((group) => group.items.length > 0);
  const ui = getSiteUiText(locale);

  return (
    <div className="record-directory">
      <aside className="record-directory__sidebar">
        <div className="record-directory__sidebar-card">
          <p className="record-directory__eyebrow">{ui.publications.sectionNavigation}</p>
          <nav className="record-directory__nav" aria-label={ui.publications.navAriaLabel}>
            {visibleGroups.map((group) => (
              <a key={group.id} className="record-directory__nav-link" href={`#${group.id}`}>
                <span className="record-directory__nav-main">
                  <span className="record-directory__nav-icon">{group.icon}</span>
                  <span className="record-directory__nav-text">
                    <strong>{group.title}</strong>
                    {group.summary ? <small>{group.summary}</small> : null}
                  </span>
                </span>
                <span className="record-directory__nav-count">{group.items.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="record-directory__content">
        {visibleGroups.map((group) => (
          <section key={group.id} className="record-section" id={group.id}>
            <div className="record-section__header">
              <div className="record-section__title">
                <span className="record-section__icon">{group.icon}</span>
                <div>
                  <p className="record-section__eyebrow">{ui.publications.recordsCount(group.items.length)}</p>
                  <h2>{group.title}</h2>
                  {group.summary ? <p>{group.summary}</p> : null}
                </div>
              </div>
            </div>

            <div className="record-section__list">
              {group.items.map((item) => (
                <article key={item.id} className="record-entry">
                  <p className="record-entry__meta">{item.meta || "-"}</p>
                  <div className="record-entry__body">
                    <h3>{item.title}</h3>
                    {item.subtitle ? <p className="record-entry__subtitle">{item.subtitle}</p> : null}
                    {item.summary ? <p className="record-entry__summary">{item.summary}</p> : null}
                    {item.link ? (
                      <Link className="record-entry__link" href={item.link} target="_blank">
                        {ui.publications.viewSource}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
