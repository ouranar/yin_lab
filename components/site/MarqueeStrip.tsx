import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { HomeActivity } from "@/types/site";

export function MarqueeStrip({ items }: { items: HomeActivity[] }) {
  const loopItems = [...items, ...items];

  return (
    <section className="marquee-section">
      <div className="marquee-track">
        {loopItems.map((item, index) => (
          <Link key={`${item.id}-${index}`} className="marquee-card" href={item.href}>
            <span className="marquee-card__date">{formatDate(item.date)}</span>
            <b>{item.label}</b>
            <strong>{item.title}</strong>
            <p>{item.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
