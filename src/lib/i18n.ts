import type { Member } from "@/types/site";

export const siteLocales = ["zh", "en", "ja"] as const;

export type SiteLocale = (typeof siteLocales)[number];

export const defaultSiteLocale: SiteLocale = "zh";

export const localeLabels: Record<SiteLocale, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
};

const shellNavigationLabels: Record<SiteLocale, Record<string, string>> = {
  zh: {
    "/": "首页",
    "/about": "关于",
    "/news": "新闻",
    "/members": "成员",
    "/research": "研究内容",
    "/publications": "出版物",
    "/recruitment": "招募",
    "/contact": "联系方式",
  },
  en: {
    "/": "Home",
    "/about": "About",
    "/news": "News",
    "/members": "Members",
    "/research": "Research",
    "/publications": "Publications",
    "/recruitment": "Join Us",
    "/contact": "Contact",
  },
  ja: {
    "/": "ホーム",
    "/about": "研究室紹介",
    "/news": "ニュース",
    "/members": "メンバー",
    "/research": "研究内容",
    "/publications": "出版物",
    "/recruitment": "募集",
    "/contact": "アクセス",
  },
};

const shellLabNames: Record<SiteLocale, string> = {
  zh: "Yin-Lab：人工智能教育实验室",
  en: "Yin-Lab: Artificial Intelligence in Education Lab",
  ja: "Yin-Lab：教育における人工知能研究室",
};

const shellFooterNotes: Record<SiteLocale, string> = {
  zh: "通过智能教育、数字学习、移动学习与学习分析，推动教学与学习的未来发展。",
  en: "Advancing the future of teaching and learning through intelligent education, digital learning, mobile learning, and learning analytics.",
  ja: "知能教育、デジタル学習、モバイル学習、学習分析を通して、教育と学びの未来を切り拓きます。",
};

const shellAdminLabels: Record<SiteLocale, string> = {
  zh: "管理",
  en: "Admin",
  ja: "管理",
};

export type SiteUiText = {
  home: {
    researchEyebrow: string;
    membersEyebrow: string;
    recruitmentEyebrow: string;
    viewResearchDirections: string;
    relatedLink: string;
    leaderEyebrow: string;
    viewLeaderProfile: string;
    viewAllMembers: string;
  };
  news: {
    archiveEyebrow: string;
    viewArchive: string;
    archivedBadge: string;
    viewDetails: string;
    archiveHeroSubtitle: string;
    emptyArchive: string;
    backToNews: string;
    relatedLink: string;
  };
  members: {
    backToMembers: string;
    defaultTitle: string;
    sendEmail: string;
    call: string;
    personalWebsite: string;
    hometown: string;
    birthDate: string;
    researchAreas: string;
    email: string;
    phone: string;
    profileLink: string;
    summary: string;
    emptyProfile: string;
  };
  research: {
    relatedLink: string;
  };
  publications: {
    sectionNavigation: string;
    navAriaLabel: string;
    recordsCount: (count: number) => string;
    viewSource: string;
  };
  recruitment: {
    audienceEyebrow: string;
    growthEyebrow: string;
    contactEyebrow: string;
  };
};

const siteUiText: Record<SiteLocale, SiteUiText> = {
  zh: {
    home: {
      researchEyebrow: "研究",
      membersEyebrow: "成员",
      recruitmentEyebrow: "招募",
      viewResearchDirections: "查看研究方向",
      relatedLink: "相关链接",
      leaderEyebrow: "负责人",
      viewLeaderProfile: "查看负责人介绍",
      viewAllMembers: "查看全部成员",
    },
    news: {
      archiveEyebrow: "归档",
      viewArchive: "查看归档",
      archivedBadge: "归档",
      viewDetails: "查看详情",
      archiveHeroSubtitle: "历史新闻归档",
      emptyArchive: "暂无归档内容",
      backToNews: "返回新闻页",
      relatedLink: "相关链接",
    },
    members: {
      backToMembers: "返回成员页",
      defaultTitle: "实验室成员",
      sendEmail: "发送邮件",
      call: "电话联系",
      personalWebsite: "个人主页",
      hometown: "籍贯",
      birthDate: "出生日期",
      researchAreas: "研究方向",
      email: "邮箱",
      phone: "电话",
      profileLink: "个人链接",
      summary: "简介",
      emptyProfile: "该成员暂时还没有补充资料。",
    },
    research: {
      relatedLink: "相关链接",
    },
    publications: {
      sectionNavigation: "栏目导航",
      navAriaLabel: "出版物分组导航",
      recordsCount: (count) => `${count} 条记录`,
      viewSource: "查看来源",
    },
    recruitment: {
      audienceEyebrow: "候选人画像",
      growthEyebrow: "成长收获",
      contactEyebrow: "联系入口",
    },
  },
  en: {
    home: {
      researchEyebrow: "Research",
      membersEyebrow: "Members",
      recruitmentEyebrow: "Join Us",
      viewResearchDirections: "View research areas",
      relatedLink: "Related link",
      leaderEyebrow: "Director",
      viewLeaderProfile: "View director profile",
      viewAllMembers: "View all members",
    },
    news: {
      archiveEyebrow: "Archive",
      viewArchive: "View archive",
      archivedBadge: "Archived",
      viewDetails: "View details",
      archiveHeroSubtitle: "Archived lab news",
      emptyArchive: "No archived news yet.",
      backToNews: "Back to news",
      relatedLink: "Related link",
    },
    members: {
      backToMembers: "Back to members",
      defaultTitle: "Lab member",
      sendEmail: "Send email",
      call: "Call",
      personalWebsite: "Website",
      hometown: "Hometown",
      birthDate: "Date of birth",
      researchAreas: "Research areas",
      email: "Email",
      phone: "Phone",
      profileLink: "Profile link",
      summary: "Summary",
      emptyProfile: "Profile details have not been added yet.",
    },
    research: {
      relatedLink: "Related link",
    },
    publications: {
      sectionNavigation: "Sections",
      navAriaLabel: "Publication groups",
      recordsCount: (count) => `${count} records`,
      viewSource: "View source",
    },
    recruitment: {
      audienceEyebrow: "Who we are looking for",
      growthEyebrow: "What you will gain",
      contactEyebrow: "Contact",
    },
  },
  ja: {
    home: {
      researchEyebrow: "研究",
      membersEyebrow: "メンバー",
      recruitmentEyebrow: "募集",
      viewResearchDirections: "研究分野を見る",
      relatedLink: "関連リンク",
      leaderEyebrow: "代表者",
      viewLeaderProfile: "代表者プロフィールを見る",
      viewAllMembers: "すべてのメンバーを見る",
    },
    news: {
      archiveEyebrow: "アーカイブ",
      viewArchive: "アーカイブを見る",
      archivedBadge: "アーカイブ",
      viewDetails: "詳細を見る",
      archiveHeroSubtitle: "過去のニュースアーカイブ",
      emptyArchive: "アーカイブはまだありません。",
      backToNews: "ニュース一覧へ戻る",
      relatedLink: "関連リンク",
    },
    members: {
      backToMembers: "メンバー一覧へ戻る",
      defaultTitle: "研究室メンバー",
      sendEmail: "メールを送る",
      call: "電話する",
      personalWebsite: "個人ページ",
      hometown: "出身地",
      birthDate: "生年月日",
      researchAreas: "研究分野",
      email: "メール",
      phone: "電話",
      profileLink: "プロフィールリンク",
      summary: "概要",
      emptyProfile: "このメンバーの詳細はまだ追加されていません。",
    },
    research: {
      relatedLink: "関連リンク",
    },
    publications: {
      sectionNavigation: "カテゴリ",
      navAriaLabel: "出版物カテゴリナビゲーション",
      recordsCount: (count) => `${count} 件`,
      viewSource: "出典を見る",
    },
    recruitment: {
      audienceEyebrow: "求める人物像",
      growthEyebrow: "得られる力",
      contactEyebrow: "連絡先",
    },
  },
};

const localeDateFormats: Record<SiteLocale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
};

export const isSiteLocale = (value: string): value is SiteLocale => siteLocales.includes(value as SiteLocale);

export const getLocaleFromPathname = (pathname: string): SiteLocale => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment && isSiteLocale(firstSegment) ? firstSegment : defaultSiteLocale;
};

export const removeLocalePrefix = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return "/";
  }

  if (isSiteLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

export const withLocalePath = (locale: SiteLocale, href: string) => {
  if (!href) {
    return `/${locale}`;
  }

  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return href;
  }

  const normalized = removeLocalePrefix(href);
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
};

export const formatLocaleDate = (value: string, locale: SiteLocale) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeDateFormats[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const getShellLabName = (locale: SiteLocale) => shellLabNames[locale];

export const getShellFooterNote = (locale: SiteLocale) => shellFooterNotes[locale];

export const getShellAdminLabel = (locale: SiteLocale) => shellAdminLabels[locale];

export const getShellNavigationLabel = (locale: SiteLocale, href: string, fallback: string) =>
  shellNavigationLabels[locale][removeLocalePrefix(href)] ?? fallback;

export const getSiteUiText = (locale: SiteLocale) => siteUiText[locale];

const splitNameParts = (name: string) =>
  name
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

export const getLocalizedMemberName = (member: Member, locale: SiteLocale) => {
  const parts = splitNameParts(member.name);

  if (!parts.length) {
    return member.name;
  }

  if (locale === "en") {
    return parts[1] ?? parts[0];
  }

  return parts[0];
};

export const getLocalizedMemberNameParts = (member: Member, locale: SiteLocale) => {
  const parts = splitNameParts(member.name);

  if (!parts.length) {
    return {
      primaryName: member.name.trim(),
      secondaryName: "",
    };
  }

  if (locale === "en") {
    return {
      primaryName: parts[1] ?? parts[0],
      secondaryName: parts[0] ?? "",
    };
  }

  return {
    primaryName: parts[0],
    secondaryName: parts[1] ?? "",
  };
};
