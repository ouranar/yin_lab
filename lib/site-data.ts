import { unstable_noStore as noStore } from "next/cache";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import defaultSiteData from "@/content/site-content.json";
import { normalizeMemberSlug } from "@/lib/format";
import type { Member, NewsItem, SiteData } from "@/types/site";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");
const ARCHIVE_DIR = path.join(process.cwd(), "content", "archives");
export const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

const sortByDateAsc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

const defaultRecruitmentGrowthCards: SiteData["recruitment"]["growth"]["cards"] = [
  {
    id: "recruitment-growth-1",
    title: "教育系统设计与发展",
    items: [
      "从真实教学问题出发，设计能够被使用的支持工具与学习流程",
      "理解教育场景中的需求约束，并把功能设计和研究目标结合起来",
      "在迭代中学习如何让系统真正服务课堂、课程与学习者",
    ],
  },
  {
    id: "recruitment-growth-2",
    title: "数据分析与学习分析",
    items: [
      "学习整理、清洗与分析教育数据，理解学习过程中的关键行为特征",
      "掌握把数据结果转化为研究证据、反馈建议和可视化表达的方法",
      "逐步建立用数据支持教学改进与研究判断的能力",
    ],
  },
  {
    id: "recruitment-growth-3",
    title: "应用开发与原型实现",
    items: [
      "把研究想法发展为可交互的原型、实验工具或在线系统",
      "练习前后端协作、数据接口设计与研究型产品实现流程",
      "在真实使用反馈中持续优化系统结构、交互体验与功能边界",
    ],
  },
  {
    id: "recruitment-growth-4",
    title: "研究表达与国际协作",
    items: [
      "学习如何组织研究问题、方法与结果，并形成清晰的学术表达",
      "在组会、论文写作和项目合作中提升沟通、汇报与协作能力",
      "逐步适应国际化研究环境中的长期积累与公开交流",
    ],
  },
];

const normalizeBulletLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s→•·\-]+/, "").trim())
    .filter(Boolean);

const normalizeSiteData = (input: SiteData): SiteData => {
  const data = clone(input);
  const recruitment = data.recruitment as Partial<SiteData["recruitment"]> & {
    cards?: SiteData["recruitment"]["cards"];
    notes?: string[];
  };

  const hasNewRecruitmentShape =
    Array.isArray(recruitment.intro) &&
    recruitment.audience &&
    Array.isArray(recruitment.audience.points) &&
    recruitment.growth &&
    Array.isArray(recruitment.growth.cards) &&
    recruitment.callToAction;

  if (hasNewRecruitmentShape) {
    return data;
  }

  const cards = Array.isArray(recruitment.cards) ? recruitment.cards : [];
  const notes = Array.isArray(recruitment.notes) ? recruitment.notes : [];
  const audienceCard = cards[1];
  const contactCard = cards.find((card) => card.href || card.linkLabel) ?? cards[2];
  const audiencePoints = normalizeBulletLines(audienceCard?.content ?? "");

  data.recruitment = {
    hero: recruitment.hero ?? {
      eyebrow: "加入我们",
      title: "欢迎加入我们",
      subtitle: "在真实教育场景中，做有证据、有温度、能落地的研究与开发",
      description: "如果你对学习分析、教育技术设计、数据可视化、系统实现或跨学科研究协作感兴趣，欢迎与我们联系。",
    },
    intro: [
      "我们欢迎来自教育技术、计算机、数据科学、设计、人机交互等不同背景的同学和研究者加入，一起围绕真实教学与学习场景中的关键问题开展研究。",
      cards[0]?.content || "在这里，研究不会停留在概念层面，而是要真正走进课程、平台与学习过程，提出问题、构建方法、开发工具，并在现场持续验证它们是否有效。",
      notes[0] || "如果你期待把想法落到系统、把观察转成证据、把研究写成可以产生影响的成果，这里会是一个适合长期投入与成长的地方。",
    ].filter(Boolean),
    audience: {
      title: "我们在找谁",
      intro: "我们尤其欢迎以下类型的伙伴：",
      points:
        audiencePoints.length > 0
          ? audiencePoints
          : [
              "对学习行为、教学设计或教育场景中的真实问题保持敏感和好奇",
              "愿意把研究想法转化为可验证的方法、原型系统或数据分析流程",
              "对编程、系统开发、数据分析、可视化表达等至少一个方向有持续投入意愿",
              "能够在跨学科环境中协作，愿意把教育问题和技术能力真正连接起来",
            ],
      note: notes[1] || "欢迎不同学科背景的同学与合作伙伴联系。",
    },
    growth: {
      title: "你将在实验室学到什么",
      intro: "通过参与研究、协作和真实场景验证，你会逐步建立以下几类能力：",
      cards: defaultRecruitmentGrowthCards,
    },
    callToAction: {
      title: contactCard?.title || "如何联系",
      content: contactCard?.content || notes[2] || "欢迎通过邮件发送简历、研究兴趣和过往项目简介。",
      linkLabel: contactCard?.linkLabel || "查看联系方式",
      href: contactCard?.href || "/contact",
    },
    cards,
    notes,
  };

  return data;
};

export const getDefaultSiteData = (): SiteData => normalizeSiteData(clone(defaultSiteData as unknown as SiteData));

export const ensureSiteDataFile = async () => {
  await mkdir(path.dirname(CONTENT_PATH), { recursive: true });

  try {
    await readFile(CONTENT_PATH, "utf8");
  } catch {
    await writeFile(CONTENT_PATH, JSON.stringify(getDefaultSiteData(), null, 2), "utf8");
  }
};

export const readSiteData = async (options?: { skipNoStore?: boolean }) => {
  if (!options?.skipNoStore) {
    noStore();
  }

  await ensureSiteDataFile();
  const raw = await readFile(CONTENT_PATH, "utf8");
  return normalizeSiteData(JSON.parse(raw) as SiteData);
};

export const writeSiteData = async (data: SiteData) => {
  await ensureSiteDataFile();
  const normalized = normalizeSiteData(data);
  await writeFile(CONTENT_PATH, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
};

const getArchiveCutoff = (months: number) => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - Math.max(months, 1));
  return cutoff;
};

const isExpiredNews = (item: NewsItem, months: number) => {
  const date = new Date(item.date);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date < getArchiveCutoff(months);
};

const dedupeNews = (items: NewsItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.id || item.slug;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const archiveExpiredNews = async (input: SiteData) => {
  const data = clone(input);
  const activeItems = sortByDateDesc(data.news.items);
  const minimumCount = Math.max(data.settings.minimumNewsItems, 0);

  if (activeItems.length <= minimumCount) {
    return {
      data,
      archivedItems: [] as NewsItem[],
      exportPath: "",
    };
  }

  const eligible = sortByDateAsc(
    activeItems.filter((item) => item.visible !== false && isExpiredNews(item, data.settings.newsArchiveMonths)),
  );
  const removableCount = Math.max(0, activeItems.length - minimumCount);
  const archivedItems = eligible.slice(0, removableCount);

  if (!archivedItems.length) {
    return {
      data,
      archivedItems,
      exportPath: "",
    };
  }

  const archivedIds = new Set(archivedItems.map((item) => item.id));
  data.news.items = activeItems.filter((item) => !archivedIds.has(item.id));
  data.news.archivedItems = sortByDateDesc(dedupeNews([...archivedItems, ...data.news.archivedItems]));

  await mkdir(ARCHIVE_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const exportPath = path.join(ARCHIVE_DIR, `news-archive-${stamp}.json`);

  await writeFile(
    exportPath,
    JSON.stringify(
      {
        archivedAt: new Date().toISOString(),
        items: archivedItems,
      },
      null,
      2,
    ),
    "utf8",
  );

  return {
    data,
    archivedItems,
    exportPath,
  };
};

export const syncNewsArchive = async () => {
  const current = await readSiteData({ skipNoStore: true });
  const result = await archiveExpiredNews(current);

  if (result.archivedItems.length) {
    await writeSiteData(result.data);
  }

  return result;
};

export const getVisibleNews = (data: SiteData) => sortByDateDesc(data.news.items.filter((item) => item.visible !== false));

export const getArchivedNews = (data: SiteData) =>
  sortByDateDesc(data.news.archivedItems.filter((item) => item.visible !== false));

export const findNewsBySlug = (data: SiteData, slug: string) =>
  [...data.news.items, ...data.news.archivedItems].find((item) => item.slug === slug);

export const getAllMembers = (data: SiteData) => data.members.groups.flatMap((group) => group.items);

export const getMemberRouteSlug = (member: Member) =>
  normalizeMemberSlug(member.slug, member.name, member.id || "member");

export const getVisibleMemberGroups = (data: SiteData) =>
  data.members.groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.visible !== false),
  }));

export const findMemberBySlug = (data: SiteData, slug: string): Member | undefined =>
  getAllMembers(data).find((item) => item.slug === slug || getMemberRouteSlug(item) === slug);

export const getHomeMemberPreview = (data: SiteData) => getAllMembers(data).filter((item) => item.visible !== false).slice(0, 3);

export const getFeaturedMember = (data: SiteData) => {
  const visibleFaculty = data.members.groups
    .find((group) => group.id === "faculty")
    ?.items.filter((item) => item.visible !== false);

  if (visibleFaculty?.length) {
    return visibleFaculty[0];
  }

  return getAllMembers(data).find((item) => item.visible !== false);
};
