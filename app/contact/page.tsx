import { PageHero } from "@/components/site/PageHero";
import { readSiteData } from "@/lib/site-data";

export default async function ContactPage() {
  const data = await readSiteData();
  const regularTransit = data.contact.transitText.length > 1 ? data.contact.transitText.slice(0, -1) : data.contact.transitText;
  const emphasisTransit = data.contact.transitText.length > 1 ? data.contact.transitText[data.contact.transitText.length - 1] : "";

  const renderMethodValue = (label: string, value: string) => {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return null;
    }

    const isEmail = /邮箱|email/i.test(label);
    const isPhone = /电话|phone/i.test(label);

    return (
      <div className="contact-detail__value">
        {lines.map((line) => {
          if (isEmail) {
            return (
              <p key={line}>
                <a href={`mailto:${line}`}>{line}</a>
              </p>
            );
          }

          if (isPhone) {
            return (
              <p key={line}>
                <a href={`tel:${line.replace(/\s+/g, "")}`}>{line}</a>
              </p>
            );
          }

          return <p key={line}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      <PageHero hero={data.contact.hero} />

      <section className="section-shell contact-access">
        <div className="contact-access__content">
          <div className="contact-access__details">
            {data.contact.methods.map((method) => (
              <section key={method.id} className="contact-detail">
                <p className="contact-detail__label">{method.label}</p>
                {renderMethodValue(method.label, method.value)}
                {method.note ? <p className="contact-detail__note">{method.note}</p> : null}
              </section>
            ))}
          </div>

          <section className="contact-visit-guide">
            <h2>{data.contact.transitTitle}</h2>
            {regularTransit.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {emphasisTransit ? <p className="contact-visit-guide__emphasis">{emphasisTransit}</p> : null}
          </section>
        </div>

        <aside className="contact-access__map-panel">
          <div className="contact-map contact-map--feature">
            <img alt={data.contact.mapAlt} src={data.contact.mapImage} />
          </div>
        </aside>
      </section>
    </>
  );
}
