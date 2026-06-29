export type NavItem = {
  label: string;
  href: string;
};

export type LinkAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type PageHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryAction?: LinkAction;
  secondaryAction?: LinkAction;
};

export type HomeActivity = {
  id: string;
  date: string;
  label: string;
  title: string;
  summary: string;
  href: string;
};

export type HomeLead = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  content?: string[];
};

export type HighlightCard = {
  id: string;
  title: string;
  value: string;
  caption: string;
};

export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

export type NewsItem = {
  id: string;
  slug: string;
  label: string;
  title: string;
  date: string;
  summary: string;
  content: string[];
  image: string;
  relatedLink?: string;
  pinned: boolean;
  visible: boolean;
};

export type Member = {
  id: string;
  slug: string;
  name: string;
  title: string;
  image: string;
  birthDate?: string;
  hometown?: string;
  researchAreas: string[];
  email: string;
  phone?: string;
  profileLink?: string;
  summary: string;
  visible: boolean;
};

export type MemberGroup = {
  id: string;
  title: string;
  items: Member[];
};

export type ResearchItem = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  image: string;
  link?: string;
  visible: boolean;
};

export type RecordItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  summary: string;
  link?: string;
  visible: boolean;
};

export type RecordGroup = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  items: RecordItem[];
};

export type RecruitmentAudience = {
  title: string;
  intro: string;
  points: string[];
  note: string;
};

export type RecruitmentSkillCard = {
  id: string;
  title: string;
  items: string[];
};

export type LegacyRecruitmentCard = {
  id: string;
  title: string;
  content: string;
  linkLabel?: string;
  href?: string;
};

export type RecruitmentGrowth = {
  title: string;
  intro: string;
  cards: RecruitmentSkillCard[];
};

export type RecruitmentCallToAction = {
  title: string;
  content: string;
  linkLabel: string;
  href: string;
};

export type ContactMethod = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

export type SiteData = {
  settings: {
    labName: string;
    shortName: string;
    description: string;
    footerNote: string;
    adminLabel: string;
    newsArchiveMonths: number;
    minimumNewsItems: number;
  };
  navigation: NavItem[];
  home: {
    hero: PageHero;
    activities: HomeActivity[];
    intro: HomeLead;
    newsLead: HomeLead;
    membersLead: HomeLead;
    recruitmentLead: HomeLead;
  };
  about: {
    hero: PageHero;
    introTitle: string;
    introText: string[];
    introImage: string;
    introImageAlt?: string;
    introHighlights: HighlightCard[];
    timelineTitle: string;
    timelineSubtitle: string;
    timeline: TimelineItem[];
    goalsTitle: string;
    goalsStatement: string;
    goalsText: string[];
    goalsCards: HighlightCard[];
  };
  news: {
    hero: PageHero;
    archiveTitle: string;
    archiveSubtitle: string;
    items: NewsItem[];
    archivedItems: NewsItem[];
  };
  members: {
    hero: PageHero;
    groups: MemberGroup[];
  };
  research: {
    hero: PageHero;
    directionsTitle: string;
    projectsTitle: string;
    directions: ResearchItem[];
    projects: ResearchItem[];
  };
  publications: {
    hero: PageHero;
    groups: RecordGroup[];
  };
  recruitment: {
    hero: PageHero;
    intro: string[];
    audience: RecruitmentAudience;
    growth: RecruitmentGrowth;
    callToAction: RecruitmentCallToAction;
    cards: LegacyRecruitmentCard[];
    notes: string[];
  };
  services: {
    hero: PageHero;
    groups: RecordGroup[];
  };
  contact: {
    hero: PageHero;
    methods: ContactMethod[];
    mapImage: string;
    mapAlt: string;
    transitTitle: string;
    transitText: string[];
  };
};
