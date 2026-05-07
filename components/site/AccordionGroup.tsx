import Link from "next/link";
import type { RecordGroup } from "@/types/site";

export function AccordionGroup({ group, open = false }: { group: RecordGroup; open?: boolean }) {
  return (
    <details className="accordion-group" open={open}>
      <summary>
        <span className="accordion-group__icon">{group.icon}</span>
        <span className="accordion-group__text">
          <strong>{group.title}</strong>
          <small>{group.summary}</small>
        </span>
      </summary>

      <div className="accordion-group__items">
        {group.items.length ? (
          group.items
            .filter((item) => item.visible !== false)
            .map((item) => (
              <article key={item.id} className="record-card">
                <div>
                  <p className="record-card__meta">{item.meta}</p>
                  <h3>{item.title}</h3>
                  <p className="record-card__subtitle">{item.subtitle}</p>
                  <p>{item.summary}</p>
                </div>
                {item.link ? (
                  <Link className="button-link button-link--ghost" href={item.link}>
                    相关链接
                  </Link>
                ) : null}
              </article>
            ))
        ) : (
          <p className="record-card record-card--empty">暂无条目</p>
        )}
      </div>
    </details>
  );
}
