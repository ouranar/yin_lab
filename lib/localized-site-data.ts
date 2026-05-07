import { withLocalePath, type SiteLocale } from "@/lib/i18n";
import { readSiteData } from "@/lib/site-data";
import type { Member, NewsItem, ResearchItem, SiteData } from "@/types/site";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const applyById = <T extends { id: string }>(items: T[], overrides: Record<string, Partial<T>>) =>
  items.map((item) => (overrides[item.id] ? { ...item, ...overrides[item.id] } : item));

const localizeLink = (href: string | undefined, locale: SiteLocale) => {
  if (!href) {
    return href;
  }

  return withLocalePath(locale, href);
};

const localizeMemberGroups = (groups: SiteData["members"]["groups"], locale: SiteLocale) => {
  const groupTitles: Record<Exclude<SiteLocale, "zh">, Record<string, string>> = {
    en: {
      faculty: "Faculty",
      students: "Students",
      collaborators: "Collaborators",
    },
    ja: {
      faculty: "教職員",
      students: "学生",
      collaborators: "共同研究者",
    },
  };

  const memberOverrides: Record<Exclude<SiteLocale, "zh">, Record<string, Partial<Member>>> = {
    en: {
      "member-1": {
        title: "Director / Professor",
        researchAreas: ["Learning analytics", "Educational technology design"],
        summary:
          "Associate Professor, Center for Information Infrastructure, Kobe University\nConcurrent faculty member, Graduate School of System Informatics\nPh.D. in Engineering",
      },
      "member-2": {
        researchAreas: ["Teaching platforms", "Human-computer interaction", "Classroom feedback"],
        summary: "Focuses on tool design and interaction research for classroom settings.",
      },
      "member-1775750628818-940ed": {
        summary: "Faculty member at Northeast Normal University.",
      },
      "member-3": {
        title: "Doctoral student",
        hometown: "Nanjing, China",
        researchAreas: ["Learning data analysis", "Visualization", "Instructional feedback"],
        summary: "Works on data governance and analytics in the lab's research projects.",
      },
      "member-4": {
        title: "Doctoral student",
        hometown: "Suzhou, China",
        researchAreas: ["Content organization", "Course support", "Product prototyping"],
        summary: "Participates in the structuring of course resources and the development of teaching support tools.",
      },
      "member-1775750644840-9bda0": {
        title: "Doctoral student",
      },
      "member-1775750648160-e7d3b": {
        title: "Doctoral student",
        hometown: "Gansu, China",
      },
      "member-5": {
        title: "Professor",
        hometown: "Anhui, China",
        researchAreas: ["Course evaluation", "Project collaboration"],
        summary: "Vice Dean of the Shanghai Institute of Smart Education, East China Normal University\nProfessor",
      },
    },
    ja: {
      "member-1": {
        title: "代表者 / 教授",
        researchAreas: ["ラーニングアナリティクス", "教育技術設計"],
        summary:
          "神戸大学情報基盤センター 准教授\n大学院システム情報学研究科 兼担\n博士（工学）",
      },
      "member-2": {
        researchAreas: ["教育プラットフォーム", "ヒューマンコンピュータインタラクション", "授業フィードバック"],
        summary: "教室場面に向けたツール設計とインタラクション研究に取り組んでいます。",
      },
      "member-1775750628818-940ed": {
        summary: "東北師範大学の教員。",
      },
      "member-3": {
        title: "博士後期課程",
        hometown: "中国・南京",
        researchAreas: ["学習データ分析", "可視化", "授業フィードバック"],
        summary: "研究プロジェクトにおけるデータガバナンスと分析を担当しています。",
      },
      "member-4": {
        title: "博士後期課程",
        hometown: "中国・蘇州",
        researchAreas: ["コンテンツ構造化", "授業支援", "プロトタイプ設計"],
        summary: "教材資源の構造化と授業支援ツール開発に参加しています。",
      },
      "member-1775750644840-9bda0": {
        title: "博士後期課程",
      },
      "member-1775750648160-e7d3b": {
        title: "博士後期課程",
        hometown: "中国・甘粛",
      },
      "member-5": {
        title: "教授",
        hometown: "中国・安徽",
        researchAreas: ["授業評価", "プロジェクト協働"],
        summary: "華東師範大学 上海スマート教育研究院 副院長\n教授",
      },
    },
  };

  return groups.map((group) => ({
    ...group,
    title: locale === "zh" ? group.title : groupTitles[locale][group.id] ?? group.title,
    items: locale === "zh" ? group.items : applyById(group.items, memberOverrides[locale]),
  }));
};

const localizeResearch = (research: SiteData["research"], locale: SiteLocale) => {
  const heroOverrides: Record<Exclude<SiteLocale, "zh">, SiteData["research"]["hero"]> = {
    en: {
      eyebrow: "Research",
      title: "Research organized by themes and projects",
      subtitle: "Research areas / Research projects",
      description: "",
    },
    ja: {
      eyebrow: "研究",
      title: "研究分野とプロジェクト",
      subtitle: "研究分野 / 研究プロジェクト",
      description: "",
    },
  };

  const directionOverrides: Record<Exclude<SiteLocale, "zh">, Record<string, Partial<ResearchItem>>> = {
    en: {
      "direction-1": {
        title: "Learning analytics",
        summary:
          "Investigates the collection, modeling, and interpretation of behavioral data in learning processes to support data-informed learning support and instructional improvement.",
        tags: ["Learning analytics", "Evidence chains", "Feedback design"],
      },
      "direction-2": {
        title: "Educational robots",
        summary:
          "Studies learning and teaching activities supported by robots, focusing on how robots can mediate knowledge transmission, skill training, and learner motivation.",
        tags: ["Robotics", "Interactive teaching activities"],
      },
      "direction-1776773321575-6ce70": {
        title: "AR/VR-supported learning environments",
        summary:
          "Explores the design, application, and evaluation of augmented and virtual reality in educational settings to build immersive, interactive, and contextualized learning experiences.",
        tags: ["Augmented reality", "Educational settings", "Learning environment design"],
      },
      "direction-1776773322713-bae3b": {
        title: "Health promotion with wearable sensors",
        summary:
          "Uses health sensors and multimodal sensing technologies to study health promotion, behavior monitoring, and training support, extending educational technology into health and medical contexts.",
        tags: ["Health promotion", "Behavior monitoring", "Training support"],
      },
      "project-1": {
        summary:
          "A search-based learning support environment that applies text mining to help learners investigate prior studies, understand research trends, and learn effectively while searching.",
      },
      "project-2": {
        summary:
          "A ubiquitous SNS-based learning support service that helps learners find suitable peers, share knowledge, and receive context-aware support. It also serves as a foundation for the LANGEL language-learning environment.",
      },
      "project-1775796780231-2e8d1": {
        summary:
          "A mobile quiz and reflection system designed to deepen learners' understanding of the culture and environment behind the foreign language they are studying.",
      },
      "project-1775796817807-2528e": {
        summary:
          "An SNS environment for language learning that enables learners of different languages to teach, correct, and communicate with one another in real time.",
      },
      "project-1775796854588-197ea": {
        summary:
          "A learning framework that treats online searching as a learning activity, helping learners acquire knowledge, explore unknown domains, and develop search literacy as part of research practice.",
      },
      "project-1775796946505-30840": {
        summary:
          "A ubiquitous learning system for Japanese honorific expressions, designed to help international learners use appropriate polite expressions at the right time and in the right setting.",
      },
      "project-1775796983008-a4f0f": {
        summary:
          "A participatory simulation framework that combines scaffolding, mobile devices, and experiential learning to support active learning and AR-based educational activities.",
      },
      "project-1775797011519-7e37d": {
        title: "Educational big data",
        summary:
          "A project that collects and analyzes learning logs from systems such as Moodle and e-book platforms in order to feed evidence back into university teaching improvement and application development.",
      },
    },
    ja: {
      "direction-1": {
        title: "ラーニングアナリティクス研究",
        summary:
          "学習過程における行動データの収集・モデリング・解釈を通して、データ駆動型の学習支援と授業改善の方法を探究します。",
        tags: ["ラーニングアナリティクス", "エビデンスチェーン", "フィードバック設計"],
      },
      "direction-2": {
        title: "教育ロボット",
        summary:
          "ロボットが支援する学習・教育活動を対象に、知識伝達、技能訓練、学習意欲の喚起におけるロボットの役割を研究します。",
        tags: ["ロボット", "対話型授業活動"],
      },
      "direction-1776773321575-6ce70": {
        title: "AR/VR を活用した教育環境構築",
        summary:
          "拡張現実・仮想現実技術の設計、活用、評価を通して、没入感と相互作用に富んだ学習環境の構築を目指します。",
        tags: ["拡張現実", "教育場面", "学習環境構築"],
      },
      "direction-1776773322713-bae3b": {
        title: "健康センサーによる健康促進",
        summary:
          "健康センサーとマルチモーダルセンシングを活用し、健康促進、行動モニタリング、訓練支援に関する課題を研究します。",
        tags: ["健康促進", "行動モニタリング", "訓練支援"],
      },
      "project-1": {
        summary:
          "テキストマイニングを活用し、先行研究の調査や研究動向の把握を支援する『調べながら学ぶ』ための検索学習環境です。",
      },
      "project-2": {
        summary:
          "SNS を基盤に、学習者同士が助け合いながら学べるユビキタス学習支援サービスです。LANGEL の基盤環境としても活用されます。",
      },
      "project-1775796780231-2e8d1": {
        summary:
          "携帯端末を利用して外国語圏の文化や生活環境に関する理解を深めるためのクイズ・振り返りシステムです。",
      },
      "project-1775796817807-2528e": {
        summary:
          "異なる言語を学ぶ学習者同士が、教え合い・訂正し合い・リアルタイムで交流できる外国語学習支援 SNS 環境です。",
      },
      "project-1775796854588-197ea": {
        summary:
          "オンライン検索そのものを学習活動と捉え、未知の領域を調べながら理解を深める『Learning by Searching』の枠組みです。",
      },
      "project-1775796946505-30840": {
        summary:
          "日本語の敬語表現を学ぶ外国人学習者のために、適切な場面で適切な敬語を使えるよう支援するユビキタス学習システムです。",
      },
      "project-1775796983008-a4f0f": {
        summary:
          "Scaffolding、モバイル端末、体験学習モデルを組み合わせ、主体的な学びを促進する参加型シミュレーションフレームワークです。",
      },
      "project-1775797011519-7e37d": {
        title: "教育ビッグデータ",
        summary:
          "Moodle や電子教材システムの学習ログを収集・分析し、大学教育の改善と実用的な支援システム開発に活用する研究です。",
      },
    },
  };

  return {
    ...research,
    hero: locale === "zh" ? research.hero : heroOverrides[locale],
    directionsTitle: locale === "zh" ? research.directionsTitle : locale === "en" ? "Research areas" : "研究分野",
    projectsTitle: locale === "zh" ? research.projectsTitle : locale === "en" ? "Research projects" : "研究プロジェクト",
    directions: locale === "zh" ? research.directions : applyById(research.directions, directionOverrides[locale]),
    projects: locale === "zh" ? research.projects : applyById(research.projects, directionOverrides[locale]),
  };
};

const localizeNews = (news: SiteData["news"], locale: SiteLocale) => {
  const heroOverrides: Record<Exclude<SiteLocale, "zh">, SiteData["news"]["hero"]> = {
    en: {
      eyebrow: "News",
      title: "Lab updates",
      subtitle: "News, talks, events, and collaborations",
      description: "The public site and the admin panel share the same news dataset.",
    },
    ja: {
      eyebrow: "ニュース",
      title: "研究室ニュース",
      subtitle: "ニュース、講演、イベント、共同研究",
      description: "公開ページと管理画面は同じニュースデータを共有しています。",
    },
  };

  const itemOverrides: Record<Exclude<SiteLocale, "zh">, Record<string, Partial<NewsItem>>> = {
    en: {
      "news-1": {
        label: "Event",
        title: "Spring open day successfully held",
        summary: "Visitors explored research themes, tools, and team activities through an open showcase and Q&A session.",
        content: [
          "The open day welcomed students and collaborators from both inside and outside the university, presenting the lab's current research themes, teaching tools, and project examples.",
          "The event also included team conversations, project introductions, and recruitment consultations, creating opportunities for future collaboration and applications.",
        ],
      },
      "news-2": {
        label: "Publication",
        title: "Lab paper accepted at an educational technology conference",
        summary: "The paper focuses on organizing multi-source evidence and presenting feedback in evidence-based learning.",
        content: [
          "The paper examines how learning evidence chains can be organized, discussing how process data, assessment information, and feedback strategies can be connected in authentic teaching settings.",
          "The outcome will support further iterations of the lab's teaching support platforms and research tools.",
        ],
      },
      "news-3": {
        label: "Collaboration",
        title: "Regional collaboration program launched",
        summary: "The lab is exploring a new collaboration model grounded in authentic classroom activities and project tasks.",
        content: [
          "The lab will work with partners on educational data governance, classroom feedback, and the deployment of support tools.",
          "The program will continue to generate collaborative outcomes for research showcases, publications, and outreach support.",
        ],
      },
      "news-4": {
        label: "Talk",
        title: "Invited talk highlights evidence design in learning analytics",
        summary: "The session focused on evidence structures, toolchains, and situated validation in teaching practice.",
        content: [
          "The talk introduced common ways of structuring evidence in learning analytics research and discussed how studies can remain closely connected to concrete teaching settings.",
          "Participants exchanged views on course implementation, data annotation, and the interpretability of tools.",
        ],
      },
      "news-5": {
        label: "Seminar",
        title: "Winter seminar concludes with stage review",
        summary: "The team reviewed research goals and task assignments for the next phase.",
        content: [
          "The seminar summarized the lab's main research progress over the past year and clarified the division of work for the next stage.",
          "The meeting also reviewed the site's structure, content archiving, and outward communication strategy.",
        ],
      },
    },
    ja: {
      "news-1": {
        label: "イベント",
        title: "春季オープンデーを開催",
        summary: "研究分野、ツール、チーム活動を紹介する公開展示と質疑応答を行いました。",
        content: [
          "学内外の学生と連携先を対象に、研究室の研究テーマ、教育支援ツール、プロジェクト事例を集中的に紹介しました。",
          "当日はメンバー交流、プロジェクト紹介、募集相談も行い、今後の協働や応募につながる対面の機会となりました。",
        ],
      },
      "news-2": {
        label: "成果",
        title: "研究室論文が教育工学系会議に採択",
        summary: "エビデンスに基づく学習における多元データの構成とフィードバック提示を扱った論文です。",
        content: [
          "本論文では、学習エビデンスチェーンの構成方法を中心に、実際の授業場面でプロセスデータ、評価情報、フィードバック戦略をどのように結び付けるかを議論しました。",
          "この成果は、研究室の教育支援プラットフォームと研究ツールの継続的な改善にも活用されます。",
        ],
      },
      "news-3": {
        label: "共同研究",
        title: "地域連携研究プログラムを開始",
        summary: "実際の授業とプロジェクト課題を基盤にした新しい協働モデルを探っています。",
        content: [
          "研究室は連携機関とともに、教育データガバナンス、授業フィードバック、支援ツール導入に関する共同研究を進めます。",
          "この計画からは、研究発表、論文成果、対外支援に資する協働成果が継続的に蓄積される見込みです。",
        ],
      },
      "news-4": {
        label: "講演",
        title: "招待講演でラーニングアナリティクスのエビデンス設計を議論",
        summary: "授業エビデンス構造、ツールチェーン、文脈に即した検証について学術交流を行いました。",
        content: [
          "講演では、ラーニングアナリティクス研究で用いられるエビデンスの構成方法を紹介し、研究を具体的な授業場面に近づける視点が共有されました。",
          "会場では、授業実装、データアノテーション、ツールの解釈可能性についても議論が行われました。",
        ],
      },
      "news-5": {
        label: "研究会",
        title: "冬季セミナーで段階的な振り返りを実施",
        summary: "チームで研究目標と次段階の役割分担を整理しました。",
        content: [
          "セミナーでは、研究室のこの一年の主要な研究進展を整理し、次段階の取り組みについて役割分担を明確にしました。",
          "あわせて、サイト構成、コンテンツのアーカイブ、対外発信の方針も見直しました。",
        ],
      },
    },
  };

  return {
    ...news,
    hero: locale === "zh" ? news.hero : heroOverrides[locale],
    archiveTitle: locale === "zh" ? news.archiveTitle : locale === "en" ? "Archive" : "アーカイブ",
    archiveSubtitle:
      locale === "zh"
        ? news.archiveSubtitle
        : locale === "en"
          ? "Archived news remains available here and is also exported to local files on the server."
          : "アーカイブ済みのニュースはここに保存され、サーバー上のローカルファイルにも書き出されます。",
    items: locale === "zh" ? news.items : applyById(news.items, itemOverrides[locale]),
    archivedItems: locale === "zh" ? news.archivedItems : applyById(news.archivedItems, itemOverrides[locale]),
  };
};

const localizeHome = (home: SiteData["home"], locale: SiteLocale) => {
  if (locale === "zh") {
    return home;
  }

  const activityOverrides = {
    en: {
      "home-activity-1": {
        label: "Talk",
        title: "Spring open day held",
        summary: "A live showcase introduced learning analytics, AI-supported learning, and research collaboration.",
      },
      "home-activity-2": {
        label: "News",
        title: "Paper accepted in educational technology",
        summary: "The lab reported progress in evidence-chain modeling and instructional design.",
      },
      "home-activity-3": {
        label: "Join Us",
        title: "Recruitment for research assistants and graduate students opens",
        summary: "We welcome students interested in educational technology, data analysis, and human-computer interaction.",
      },
      "home-activity-4": {
        label: "Collaboration",
        title: "Regional research collaboration launched",
        summary: "The team is collaborating on data collection, evaluation, and feedback in authentic teaching settings.",
      },
    },
    ja: {
      "home-activity-1": {
        label: "講演",
        title: "春季オープンデーを開催",
        summary: "ラーニングアナリティクス、AI 学習支援、研究協働を現場で紹介しました。",
      },
      "home-activity-2": {
        label: "ニュース",
        title: "教育工学分野の会議に論文採択",
        summary: "エビデンスチェーン設計と授業デザインに関する進展を紹介しました。",
      },
      "home-activity-3": {
        label: "募集",
        title: "研究補助者・大学院生の募集開始",
        summary: "教育技術、データ分析、HCI に関心のある学生を歓迎します。",
      },
      "home-activity-4": {
        label: "共同研究",
        title: "地域連携研究を開始",
        summary: "実際の授業場面におけるデータ収集、評価、フィードバックを軸に協働します。",
      },
    },
  } as const;

  return {
    ...home,
    hero:
      locale === "en"
        ? {
            eyebrow: "AIE-Lab",
            title: "Yin-Lab: Artificial Intelligence in Education Lab",
            subtitle:
              "The Artificial Intelligence in Education Lab advances research and development that uses big data and AI to create better learning environments in collaboration with universities in Japan and abroad.",
            description:
              "We investigate infrastructures for learning data collected from learning systems, course registration systems, and sensors, and explore how those data can improve learning and teaching. Students interested in AI- and ICT-supported education are welcome to join us.",
            primaryAction: { label: "About us", href: "/about" },
            secondaryAction: { label: "Research", href: "/research" },
          }
        : {
            eyebrow: "AIE-Lab",
            title: "Yin-Lab：教育における人工知能研究室",
            subtitle:
              "教育における人工知能研究室は、ビッグデータと AI を活用し、より先進的な学習環境の実現に向けた研究開発を進めています。国内外の大学と連携し、学校教育、農業、医療、健康、情報分野など多様な場面で研究を展開しています。",
            description:
              "学習システム、履修登録システム、各種センサーから得られるデータ基盤の研究と、それらを学習支援や教育改善へ活用する方法を探究しています。AI と情報通信技術による教育支援に関心のある学生を歓迎します。",
            primaryAction: { label: "研究室紹介", href: "/about" },
            secondaryAction: { label: "研究内容", href: "/research" },
          },
    activities: applyById(home.activities, activityOverrides[locale]),
    intro:
      locale === "en"
        ? { ...home.intro, title: "Lab overview", buttonLabel: "Learn more" }
        : { ...home.intro, title: "研究室概要", buttonLabel: "詳しく見る" },
    newsLead:
      locale === "en"
        ? { ...home.newsLead, title: "Recent news", buttonLabel: "View news" }
        : { ...home.newsLead, title: "最新ニュース", buttonLabel: "ニュースを見る" },
    membersLead:
      locale === "en"
        ? { ...home.membersLead, title: "Team members", buttonLabel: "View members" }
        : { ...home.membersLead, title: "メンバー", buttonLabel: "メンバーを見る" },
    recruitmentLead:
      locale === "en"
        ? {
            ...home.recruitmentLead,
            title: "Open positions",
            description: "Contact us if you are interested in research grounded in authentic educational settings.",
            buttonLabel: "View opportunities",
          }
        : {
            ...home.recruitmentLead,
            title: "募集情報",
            description: "実際の教育現場に根ざした研究に関心のある方はぜひご連絡ください。",
            buttonLabel: "募集を見る",
          },
  };
};

const localizeAbout = (about: SiteData["about"], locale: SiteLocale) => {
  if (locale === "zh") {
    return about;
  }

  return locale === "en"
    ? {
        ...about,
        hero: {
          eyebrow: "About the Lab",
          title: "Research on intelligent education and learning support",
          subtitle:
            "Building intelligent information environments for knowledge transmission, inquiry, and creativity through ICT, learning analytics, and authentic educational practice",
          description: "",
        },
        introTitle: "About the lab",
        introText: [
          "The lab studies how intelligent information environments can support knowledge transmission, inquiry, and creativity. We continuously introduce new educational methods, materials, and technologies, and improve learning support through evidence-based research.",
          "We understand teaching and learning as processes of information interaction. Using ICT, we identify real problems in education, propose solutions, develop systems for authentic settings, and validate their effectiveness in practice.",
          "In mobile and ubiquitous learning, we focus on the integration of learning processes and contexts, including systems that support Japanese honorific learning for international students.",
          "In social learning, we investigate peer-support mechanisms based on SNS and collaborative learning, including matching appropriate learning partners and recommending help-seeking paths.",
          "In research trend support, we use text mining to build learning-oriented search engines that help learners explore trends more efficiently while improving the learning effect of information retrieval.",
          "In educational big data, we analyze learning logs from authentic courses to understand the relationship between learner behavior and learning outcomes, providing evidence for better instructional design.",
        ],
        introHighlights: [
          {
            id: "about-highlight-1",
            title: "AIE Research Lab",
            value: "Driving future education with educational big data and AI",
            caption:
              "We study educational big data, artificial intelligence, and learning support technologies across school education as well as agriculture, healthcare, and information contexts, while actively advancing international collaboration.",
          },
          {
            id: "about-highlight-2",
            title: "Educational Technology",
            value: "Making education more effective",
            caption:
              "Educational technology asks how scientific methods and technical tools can make educational improvement work in practice, turning effective ideas into reusable and systematic approaches.",
          },
          {
            id: "about-highlight-3",
            title: "CSEL",
            value: "Reframing teaching and learning through information science",
            caption:
              "CSEL treats education and learning as information interaction processes. We use ICT to identify problems, design methods, and validate systems in real educational settings.",
          },
        ],
        timelineTitle: "Lab milestones",
        timeline: [
          {
            ...about.timeline[0],
            title: "Mobile and ubiquitous learning",
            description: "Context-aware learning environments based on mobile technologies and new forms of learning support.",
          },
          {
            ...about.timeline[1],
            title: "Social learning",
            description: "Learner interaction, mutual support, and collaborative growth grounded in SNS and collaborative learning.",
          },
          {
            ...about.timeline[2],
            title: "Educational data mining and trend analysis",
            description: "Knowledge discovery and research trend analysis supported by educational data mining.",
          },
          {
            ...about.timeline[3],
            title: "Educational data mining and big data applications",
            description: "Analysis and application of educational big data for instructional improvement and intelligent education.",
          },
        ],
        goalsTitle: "Goals",
        goalsText: [
          "The lab responds to the development of intelligent education by integrating educational big data, artificial intelligence, and information technologies to build more adaptive and effective learning support environments.",
          "We aim to address key problems across knowledge transmission, learning support, inquiry, and creation, and to produce practical solutions through data analysis, system design, and technical development.",
          "Building on long-term work in mobile learning, social learning, educational data mining, and educational big data, we aim to move education research from experience-driven to data-driven approaches.",
          "We value technical innovation, but we place equal importance on application and validation in authentic educational settings, so that research outcomes truly serve schools and diverse learning contexts.",
          "We will continue to promote interdisciplinary integration and international collaboration, connecting educational technology, information science, learning analytics, and artificial intelligence.",
        ],
        goalsCards: [
          {
            id: "goal-card-1",
            title: "Goal 1",
            value: "Let data explain learning",
            caption:
              "Use educational big data and learning analytics to discover meaningful patterns in teaching and learning, supporting instruction, improvement, and decision making.",
          },
          {
            id: "goal-card-2",
            title: "Goal 2",
            value: "Bring intelligence into education",
            caption:
              "Combine AI, ICT, and system development to build intelligent educational environments that genuinely serve real classrooms and courses.",
          },
          {
            id: "goal-card-3",
            title: "Goal 3",
            value: "Connect research with the future",
            caption:
              "Promote deep integration across educational technology, information science, and interdisciplinary application to build an innovation ecosystem with long-term impact.",
          },
        ],
        introImageAlt: "Lab overview image",
      }
    : {
        ...about,
        hero: {
          eyebrow: "研究室紹介",
          title: "知能教育と学習支援の研究",
          subtitle: "ICT、ラーニングアナリティクス、実際の教育実践を基盤とする知的情報環境の探究",
          description: "",
        },
        introTitle: "研究室概要",
        introText: [
          "本研究室では、知識伝達・気づき・創造を促進する知的情報環境をどのように構築するかを中心課題として研究を進めています。新しい教育方法、教材、技術を継続的に取り入れ、科学的根拠に基づいて学習支援を改善します。",
          "教育と学習を情報相互作用の過程として捉え、ICT を用いて実際の教育課題を発見し、解決策を提案し、現場で使えるシステムを開発し、その有効性を実践的に検証します。",
          "モバイル・ユビキタス学習では、学習過程と学習状況の統合に注目し、日本語敬語学習支援など留学生の実際のニーズに合った言語学習支援を行います。",
          "社会的学習では、SNS と協調学習の視点から、学習者同士の相互支援、適切な学習パートナーの推薦、支援要請の経路設計を探究します。",
          "研究動向調査支援では、テキストマイニングを用いた学習志向型検索エンジンを構築し、調べながら学ぶ活動をより効果的に支援します。",
          "教育ビッグデータ研究では、実際の授業ログを分析し、学習行動と成果の関係を明らかにすることで、授業設計改善のための証拠を提供します。",
        ],
        introHighlights: [
          {
            id: "about-highlight-1",
            title: "AIE Research Lab",
            value: "教育ビッグデータと AI で未来の教育を拓く",
            caption:
              "教育ビッグデータ、AI、学習支援技術を基盤に、学校教育だけでなく農業、医療、健康、情報分野にも広がる知的教育環境を探究しています。",
          },
          {
            id: "about-highlight-2",
            title: "Educational Technology",
            value: "教育をより効果的にする",
            caption:
              "教育工学は、教育改善の理念を実際の教育実践へ落とし込み、再利用可能な方法として体系化することを重視します。",
          },
          {
            id: "about-highlight-3",
            title: "CSEL",
            value: "情報科学から教えること・学ぶことを再構成する",
            caption:
              "CSEL は教育と学習を情報相互作用として捉え、ICT を通して課題発見、方法設計、システム検証を行い、現場に根ざした知的学習環境を構築します。",
          },
        ],
        timelineTitle: "研究の歩み",
        timeline: [
          {
            ...about.timeline[0],
            title: "モバイル・ユビキタス学習",
            description: "モバイル技術を活用した文脈的学習環境と新たな学習支援の形を探究。",
          },
          {
            ...about.timeline[1],
            title: "社会的学習",
            description: "SNS と協調学習の視点から、学習者同士の相互作用と成長を支援。",
          },
          {
            ...about.timeline[2],
            title: "教育データマイニングと研究動向調査",
            description: "教育データマイニングにより知識発見と研究動向分析を支援。",
          },
          {
            ...about.timeline[3],
            title: "教育データマイニングと教育ビッグデータ応用",
            description: "教育ビッグデータの分析・応用を通して授業改善と知能教育を支援。",
          },
        ],
        goalsTitle: "目標",
        goalsText: [
          "本研究室は、教育ビッグデータ、人工知能、情報技術を統合し、より知的で柔軟な教育・学習支援環境を構築することを目指します。",
          "知識伝達、学習支援、気づき、創造の全体過程から教育の重要課題を捉え、データ分析、システム設計、技術開発を通して実行可能な解決策を提示します。",
          "モバイル学習、社会的学習、教育データマイニング、教育ビッグデータ研究の蓄積をもとに、経験駆動からデータ駆動への転換を進めます。",
          "技術革新だけでなく、実際の教育現場での応用と検証を重視し、研究成果が学校教育や多様な学習・研修場面に貢献することを目指します。",
          "教育工学、情報科学、ラーニングアナリティクス、人工知能を結ぶ学際的・国際的な研究生態系を育てていきます。",
        ],
        goalsCards: [
          {
            id: "goal-card-1",
            title: "目標 1",
            value: "データで学びを読み解く",
            caption: "教育ビッグデータとラーニングアナリティクスを通じて、教育改善に役立つ学習パターンを明らかにします。",
          },
          {
            id: "goal-card-2",
            title: "目標 2",
            value: "知能を教育へ届ける",
            caption: "AI、ICT、システム開発を組み合わせ、現場で本当に使われる知的教育環境を構築します。",
          },
          {
            id: "goal-card-3",
            title: "目標 3",
            value: "研究を未来へつなぐ",
            caption: "学際連携と国際協働を通じて、実践価値と継続的な影響力を持つ研究基盤を形成します。",
          },
        ],
        introImageAlt: "研究室紹介画像",
      };
};

const localizeRecruitment = (recruitment: SiteData["recruitment"], locale: SiteLocale) => {
  if (locale === "zh") {
    return recruitment;
  }

  return locale === "en"
    ? {
        ...recruitment,
        hero: {
          eyebrow: "Join Us",
          title: "Join the lab",
          subtitle: "Build research and systems that are evidence-based, human-centered, and grounded in real educational settings",
          description:
            "If you are interested in learning analytics, educational technology design, data visualization, system implementation, or interdisciplinary collaboration, we would love to hear from you.",
        },
        intro: [
          "We welcome students and researchers from educational technology, computer science, data science, design, human-computer interaction, and related fields.",
          "Research here does not stay at the conceptual level. We work in courses, platforms, and authentic learning processes to formulate questions, design methods, build tools, and validate them in practice.",
          "If you want to turn ideas into systems, observations into evidence, and studies into work that has impact, the lab can be a place for long-term growth.",
        ],
        audience: {
          title: "Who we are looking for",
          intro: "We especially welcome people who:",
          points: [
            "Stay curious about authentic problems in learning behavior, instructional design, and educational settings",
            "Want to turn research ideas into testable methods, prototypes, or analytics workflows",
            "Are ready to keep investing in at least one of programming, system development, data analysis, or visualization",
            "Can collaborate across disciplines and connect educational questions with technical capability",
            "Hope to grow their own research themes and communication skills in an international academic environment",
          ],
          note: "Students from different academic backgrounds and international applicants are welcome. If you already have projects, a portfolio, or a research plan, feel free to contact us.",
        },
        growth: {
          title: "What you will learn in the lab",
          intro: "Through research, collaboration, and validation in authentic settings, you will gradually build capabilities in the following areas:",
          cards: [
            {
              id: "recruitment-growth-1",
              title: "Educational systems design and development",
              items: [
                "Design learning flows and support tools starting from real teaching problems",
                "Understand the constraints of educational settings and connect feature design with research goals",
                "Learn how to make systems genuinely useful for classes, courses, and learners through iteration",
              ],
            },
            {
              id: "recruitment-growth-2",
              title: "Data analysis and learning analytics",
              items: [
                "Organize, clean, and analyze educational data to understand meaningful learner behaviors",
                "Turn findings into evidence, feedback suggestions, and visual explanations",
                "Build the ability to support instructional improvement and research judgment with data",
              ],
            },
            {
              id: "recruitment-growth-3",
              title: "Application development and prototyping",
              items: [
                "Develop research ideas into interactive prototypes, experiment tools, or online systems",
                "Practice full-stack collaboration, interface design, and research-oriented implementation workflows",
                "Refine system structure, interaction, and scope through real-world feedback",
              ],
            },
            {
              id: "recruitment-growth-4",
              title: "Research communication and international collaboration",
              items: [
                "Learn to organize research questions, methods, and results into clear academic communication",
                "Improve collaboration, presentation, and writing skills through group meetings and projects",
                "Adapt to long-term accumulation and open exchange in international research environments",
              ],
            },
          ],
        },
        callToAction: {
          title: "How to contact us",
          content:
            "Please send us your CV, research interests, representative projects, or a sample of academic writing by email. The more specific the material, the easier it is for us to continue the conversation.",
          linkLabel: "View contact information",
          href: recruitment.callToAction.href,
        },
      }
    : {
        ...recruitment,
        hero: {
          eyebrow: "募集",
          title: "研究室に参加する",
          subtitle: "実際の教育現場に根ざした、エビデンスに基づく研究と開発を進めます",
          description:
            "ラーニングアナリティクス、教育技術設計、データ可視化、システム実装、学際的な共同研究に関心のある方を歓迎します。",
        },
        intro: [
          "教育工学、情報科学、データサイエンス、デザイン、HCI など多様な背景を持つ学生・研究者を歓迎します。",
          "ここでの研究は概念に留まりません。授業、プラットフォーム、学習過程に入り込み、問いを立て、方法を設計し、ツールを作り、現場で有効性を確かめます。",
          "アイデアをシステムに、観察をエビデンスに、研究を社会的な影響へつなげたい人にとって、長期的に成長できる場です。",
        ],
        audience: {
          title: "求める人物像",
          intro: "特に次のような方を歓迎します：",
          points: [
            "学習行動、授業設計、教育場面における実際の問題に対して敏感で好奇心がある",
            "研究アイデアを検証可能な方法、プロトタイプ、データ分析フローへ落とし込みたい",
            "プログラミング、システム開発、データ分析、可視化のいずれかに継続的に取り組む意欲がある",
            "学際的な環境で協働し、教育課題と技術力を結び付けられる",
            "国際的な研究環境で自分の研究テーマと発信力を育てたい",
          ],
          note: "専門分野を問わず応募可能です。国際学生も歓迎します。プロジェクト、ポートフォリオ、研究計画があればぜひ共有してください。",
        },
        growth: {
          title: "研究室で身に付くこと",
          intro: "研究、協働、実践的な検証を通して、次のような力を段階的に養います：",
          cards: [
            {
              id: "recruitment-growth-1",
              title: "教育システム設計と発展",
              items: [
                "実際の授業課題から学習支援ツールと学習フローを設計する",
                "教育現場の制約を理解し、機能設計と研究目的を結び付ける",
                "反復を通して、授業・科目・学習者に本当に役立つ仕組みをつくる",
              ],
            },
            {
              id: "recruitment-growth-2",
              title: "データ分析とラーニングアナリティクス",
              items: [
                "教育データを整理・洗浄・分析し、学習者行動の特徴を捉える",
                "分析結果を研究エビデンス、フィードバック提案、可視化表現へ変換する",
                "データに基づいて授業改善と研究判断を支える力を身に付ける",
              ],
            },
            {
              id: "recruitment-growth-3",
              title: "アプリケーション開発とプロトタイピング",
              items: [
                "研究アイデアを対話的なプロトタイプ、実験ツール、オンラインシステムへ発展させる",
                "フロントエンド・バックエンド協働、インタフェース設計、研究実装の流れを実践する",
                "実使用から得たフィードバックをもとにシステムを改善する",
              ],
            },
            {
              id: "recruitment-growth-4",
              title: "研究発信と国際協働",
              items: [
                "研究課題、方法、結果を整理し、明確な学術表現へまとめる",
                "ゼミ、論文執筆、共同プロジェクトを通して、報告・協働・執筆力を高める",
                "国際的な研究環境における長期的な蓄積と公開発信に適応する",
              ],
            },
          ],
        },
        callToAction: {
          title: "連絡方法",
          content:
            "履歴書、研究関心、代表的なプロジェクト、または論文執筆サンプルをメールでお送りください。具体的な情報が多いほど、その後のやり取りを進めやすくなります。",
          linkLabel: "連絡先を見る",
          href: recruitment.callToAction.href,
        },
      };
};

const localizeContact = (contact: SiteData["contact"], locale: SiteLocale) => {
  if (locale === "zh") {
    return contact;
  }

  return {
    ...contact,
    hero:
      locale === "en"
        ? {
            eyebrow: "Contact",
            title: "Contact",
            subtitle: "Address / Email / Static map / Visitor notes",
            description: "Please contact the lab by email or phone. If you plan to visit, we recommend confirming the time in advance.",
          }
        : {
            eyebrow: "アクセス",
            title: "アクセス",
            subtitle: "住所 / メール / 地図 / 訪問案内",
            description: "研究室へのご連絡はメールまたは電話でお願いします。訪問予定がある場合は事前連絡をおすすめします。",
          },
    methods: contact.methods.map((method) => {
      if (method.id === "contact-email") {
        return { ...method, label: locale === "en" ? "Email" : "メール" };
      }

      if (method.id === "contact-address") {
        return { ...method, label: locale === "en" ? "Location" : "所在地" };
      }

      return method;
    }),
    mapAlt: locale === "en" ? "Campus access map" : "キャンパス案内図",
    transitTitle: locale === "en" ? "Visitor notes" : "訪問案内",
    transitText:
      locale === "en"
        ? [
            "The map on the right highlights the route toward the information center and the nearby campus area.",
            "Please contact us in advance if you plan to visit the lab.",
          ]
        : [
            "右側の地図では、情報センターへ向かう経路と周辺キャンパスの位置を確認できます。",
            "研究室を訪問される場合は、事前にご連絡ください。",
          ],
  };
};

const localizePublications = (publications: SiteData["publications"], locale: SiteLocale) => {
  if (locale === "zh") {
    return publications;
  }

  const groupTitles =
    locale === "en"
      ? {
          "journal-papers": { title: "Journal papers", summary: "Refereed journal publications." },
          "book-chapters": { title: "Books and chapters", summary: "Refereed books and book chapters." },
          "international-conference": { title: "International conferences", summary: "Refereed international conference papers." },
          "domestic-conference": { title: "Domestic conferences", summary: "Domestic conference presentations and reports." },
          "external-funding": { title: "External funding", summary: "Competitive grants and funded projects." },
          "invited-panel": { title: "Invited panel discussion", summary: "Invited panels, talks, and organized sessions." },
          awards: { title: "Awards", summary: "Awards and distinctions." },
        }
      : {
          "journal-papers": { title: "原著論文", summary: "査読付き学術論文。" },
          "book-chapters": { title: "主要著書", summary: "査読付き書籍・章。" },
          "international-conference": { title: "国際会議", summary: "査読付き国際会議論文。" },
          "domestic-conference": { title: "国内会議", summary: "国内会議発表・報告。" },
          "external-funding": { title: "外部研究資金", summary: "競争的資金・受託研究。" },
          "invited-panel": { title: "招待パネルディスカッション", summary: "招待パネル、講演、企画セッション。" },
          awards: { title: "Awards", summary: "受賞・表彰。" },
        };

  return {
    ...publications,
    hero:
      locale === "en"
        ? {
            eyebrow: "Publications",
            title: "Publications",
            subtitle: "",
            description: "",
          }
        : {
            eyebrow: "出版物",
            title: "出版物",
            subtitle: "",
            description: "",
          },
    groups: publications.groups.map((group) => ({
      ...group,
      title: groupTitles[group.id as keyof typeof groupTitles]?.title ?? group.title,
      summary: groupTitles[group.id as keyof typeof groupTitles]?.summary ?? group.summary,
    })),
  };
};

export const localizeSiteData = (input: SiteData, locale: SiteLocale): SiteData => {
  const data = clone(input);

  data.home = localizeHome(data.home, locale);
  data.about = localizeAbout(data.about, locale);
  data.news = localizeNews(data.news, locale);
  data.members = {
    ...data.members,
    hero:
      locale === "zh"
        ? data.members.hero
        : locale === "en"
          ? {
              eyebrow: "Members",
              title: "A team built through sustained collaboration",
              subtitle: "",
              description: "",
            }
          : {
              eyebrow: "メンバー",
              title: "継続的な協働でつながるチーム",
              subtitle: "",
              description: "",
            },
    groups: localizeMemberGroups(data.members.groups, locale),
  };
  data.research = localizeResearch(data.research, locale);
  data.publications = localizePublications(data.publications, locale);
  data.recruitment = localizeRecruitment(data.recruitment, locale);
  data.contact = localizeContact(data.contact, locale);

  const localizeItemHref = <T extends { href: string }>(item: T) => ({ ...item, href: localizeLink(item.href, locale) ?? item.href });

  data.home.hero.primaryAction = data.home.hero.primaryAction
    ? { ...data.home.hero.primaryAction, href: localizeLink(data.home.hero.primaryAction.href, locale) ?? data.home.hero.primaryAction.href }
    : undefined;
  data.home.hero.secondaryAction = data.home.hero.secondaryAction
    ? { ...data.home.hero.secondaryAction, href: localizeLink(data.home.hero.secondaryAction.href, locale) ?? data.home.hero.secondaryAction.href }
    : undefined;
  data.home.activities = data.home.activities.map(localizeItemHref);
  data.home.intro = localizeItemHref(data.home.intro);
  data.home.newsLead = localizeItemHref(data.home.newsLead);
  data.home.membersLead = localizeItemHref(data.home.membersLead);
  data.home.recruitmentLead = localizeItemHref(data.home.recruitmentLead);
  data.recruitment.callToAction = {
    ...data.recruitment.callToAction,
    href: localizeLink(data.recruitment.callToAction.href, locale) ?? data.recruitment.callToAction.href,
  };

  data.news.items = data.news.items.map((item) => ({
    ...item,
    relatedLink: item.relatedLink && !/^(https?:)?\/\//.test(item.relatedLink) ? withLocalePath(locale, item.relatedLink) : item.relatedLink,
  }));
  data.news.archivedItems = data.news.archivedItems.map((item) => ({
    ...item,
    relatedLink: item.relatedLink && !/^(https?:)?\/\//.test(item.relatedLink) ? withLocalePath(locale, item.relatedLink) : item.relatedLink,
  }));

  data.research.directions = data.research.directions.map((item) => ({
    ...item,
    link: item.link ? localizeLink(item.link, locale) ?? item.link : item.link,
  }));
  data.research.projects = data.research.projects.map((item) => ({
    ...item,
    link: item.link ? localizeLink(item.link, locale) ?? item.link : item.link,
  }));

  return data;
};

export const readLocalizedSiteData = async (locale: SiteLocale) => {
  const data = await readSiteData();
  return localizeSiteData(data, locale);
};
