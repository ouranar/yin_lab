export const classNames = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const splitParagraphs = (value: string[] = []) => value.filter((item) => item.trim().length > 0);

export const parseLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const toLines = (value: string[] = []) => value.join("\n");

export const toCommaSeparated = (value: string[] = []) => value.join(", ");

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "") || `item-${Date.now()}`;

export const asciiSlugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeMemberSlug = (slug: string | undefined, name: string, fallback: string) => {
  const fromSlug = asciiSlugify(slug ?? "");

  if (fromSlug) {
    return fromSlug;
  }

  const preferredSegment = name
    .split(/[\/|｜]/)
    .map((item) => item.trim())
    .find((item) => /[a-z0-9]/i.test(item));
  const fromName = asciiSlugify(preferredSegment ?? "");

  if (fromName) {
    return fromName;
  }

  return asciiSlugify(fallback) || `member-${Date.now()}`;
};
