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
        title: "Director / Associate Professor",
        researchAreas: ["Learning analytics", "Educational technology design"],
        summary:
          "Associate Professor, Center for Information Infrastructure, Kobe University\nConcurrent faculty member, Graduate School of System Informatics\nPh.D. in Engineering",
      },
      "member-2": {
        title: "Faculty member",
        researchAreas: ["Teaching platforms", "Human-computer interaction", "Classroom feedback"],
        summary: "Focuses on tool design and interaction research for classroom-based educational settings.",
      },
      "member-1775750626605-d3f18": {
        title: "Faculty member",
        summary: "Faculty member contributing to the lab's teaching activities and collaborative research.",
      },
      "member-1775750628818-940ed": {
        title: "Faculty member",
        summary: "Faculty member at Northeast Normal University and collaborator on educational research projects.",
      },
      "member-3": {
        title: "Doctoral student",
        hometown: "Nanjing, China",
        researchAreas: ["Learning data analysis", "Visualization", "Instructional feedback"],
        summary: "Works on data governance, learning analytics, and visualization in the lab's research projects.",
      },
      "member-4": {
        title: "Doctoral student",
        hometown: "Suzhou, China",
        researchAreas: ["Content organization", "Course support", "Product prototyping"],
        summary: "Contributes to course resource organization and the development of teaching support tools.",
      },
      "member-1775750644840-9bda0": {
        title: "Doctoral student",
        summary: "Doctoral student working on long-term research tasks and collaborative lab activities.",
      },
      "member-1775750648160-e7d3b": {
        title: "Doctoral student",
        hometown: "Gansu, China",
        summary: "Doctoral student engaged in research support, data work, and project collaboration within the lab.",
      },
      "member-5": {
        title: "Research collaborator / Professor",
        hometown: "Anhui, China",
        researchAreas: ["Course evaluation", "Project collaboration"],
        summary: "Vice Dean, Shanghai Institute of Smart Education, East China Normal University\nProfessor",
      },
    },
    ja: {
      "member-1": {
        title: "代表者 / 准教授",
        researchAreas: ["ラーニングアナリティクス", "教育技術設計"],
        summary:
          "神戸大学情報基盤センター 准教授\n大学院システム情報学研究科 兼担\n博士（工学）",
      },
      "member-2": {
        title: "教員",
        researchAreas: ["教育プラットフォーム", "ヒューマンコンピュータインタラクション", "授業フィードバック"],
        summary: "教室場面に根ざしたツール設計とインタラクション研究に取り組んでいます。",
      },
      "member-1775750626605-d3f18": {
        title: "教員",
        summary: "研究室の教育活動と共同研究を支える教員メンバーです。",
      },
      "member-1775750628818-940ed": {
        title: "教員",
        summary: "東北師範大学の教員であり、教育研究プロジェクトに協力しています。",
      },
      "member-3": {
        title: "博士後期課程",
        hometown: "中国・南京",
        researchAreas: ["学習データ分析", "可視化", "授業フィードバック"],
        summary: "研究プロジェクトにおけるデータガバナンス、学習分析、可視化を担当しています。",
      },
      "member-4": {
        title: "博士後期課程",
        hometown: "中国・蘇州",
        researchAreas: ["コンテンツ構造化", "授業支援", "プロトタイプ設計"],
        summary: "教材資源の構造化と授業支援ツールの開発に取り組んでいます。",
      },
      "member-1775750644840-9bda0": {
        title: "博士後期課程",
        summary: "長期的な研究課題と研究室内の協働活動に取り組む博士後期課程の学生です。",
      },
      "member-1775750648160-e7d3b": {
        title: "博士後期課程",
        hometown: "中国・甘粛",
        summary: "研究支援、データ整理、プロジェクト協働に関わる博士後期課程の学生です。",
      },
      "member-5": {
        title: "共同研究者 / 教授",
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
  const heroOverrides: Record<SiteLocale, SiteData["research"]["hero"]> = {
    zh: {
      eyebrow: "研究内容",
      title: "研究方向与研究项目",
      subtitle: "围绕学习分析、教育技术设计与真实教学场景展开",
      description: "我们从研究方向与研究项目两个层面组织内容，展示实验室长期关注的问题与正在推进的实践。",
    },
    en: {
      eyebrow: "Research",
      title: "Research areas and projects",
      subtitle: "Work grounded in learning analytics, educational technology design, and authentic educational settings",
      description: "This page presents the lab's long-term research themes together with the projects that put those ideas into practice.",
    },
    ja: {
      eyebrow: "研究",
      title: "研究分野と研究プロジェクト",
      subtitle: "ラーニングアナリティクス、教育技術設計、実際の教育場面に根ざした取り組み",
      description: "研究室が継続的に取り組む研究分野と、それを具体化するプロジェクトを整理して紹介します。",
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
    hero: heroOverrides[locale],
    directionsTitle: locale === "zh" ? "研究方向" : locale === "en" ? "Research areas" : "研究分野",
    projectsTitle: locale === "zh" ? "研究项目" : locale === "en" ? "Research projects" : "研究プロジェクト",
    directions: locale === "zh" ? research.directions : applyById(research.directions, directionOverrides[locale]),
    projects: locale === "zh" ? research.projects : applyById(research.projects, directionOverrides[locale]),
  };
};

const localizeNews = (news: SiteData["news"], locale: SiteLocale) => {
  const heroOverrides: Record<SiteLocale, SiteData["news"]["hero"]> = {
    zh: {
      eyebrow: "新闻",
      title: "实验室动态",
      subtitle: "研究进展、讲座活动、合作交流与阶段成果",
      description: "这里集中展示实验室近期的重要更新，前台页面与后台维护使用同一组新闻数据。",
    },
    en: {
      eyebrow: "News",
      title: "Lab news and updates",
      subtitle: "Research progress, talks, events, and collaborations",
      description: "This page gathers the lab's recent updates. The public site and the admin panel share the same news dataset.",
    },
    ja: {
      eyebrow: "ニュース",
      title: "研究室ニュース",
      subtitle: "研究の進展、講演、イベント、共同研究の更新",
      description: "研究室の最新情報をまとめて掲載しています。公開ページと管理画面は同じニュースデータを共有しています。",
    },
  };

  const itemOverrides: Record<Exclude<SiteLocale, "zh">, Record<string, Partial<NewsItem>>> = {
    en: {
      "news-1": {
        label: "Event",
        title: "Spring open day successfully held",
        summary: "Visitors explored the lab's research themes, tools, and team activities through an open showcase and Q&A session.",
        content: [
          "The open day welcomed students and collaborators from both inside and outside the university and introduced the lab's current research themes, teaching tools, and project examples.",
          "The event also included conversations with team members, project briefings, and recruitment consultations, creating opportunities for future collaboration and applications.",
        ],
      },
      "news-2": {
        label: "Publication",
        title: "Lab paper accepted at an educational technology conference",
        summary: "The paper focuses on organizing multi-source evidence and designing feedback for evidence-based learning.",
        content: [
          "The paper examines how learning evidence chains can be organized, with a focus on connecting process data, assessment information, and feedback strategies in authentic teaching settings.",
          "The result will also inform the next iteration of the lab's teaching support platforms and research tools.",
        ],
      },
      "news-3": {
        label: "Collaboration",
        title: "Regional collaboration program launched",
        summary: "The lab is exploring a collaboration model grounded in authentic classroom activities and project-based work.",
        content: [
          "The lab will work with partners on educational data governance, classroom feedback, and the deployment of support tools in real learning settings.",
          "The program is expected to produce continuing outcomes for research presentations, publications, and outward-facing support activities.",
        ],
      },
      "news-4": {
        label: "Talk",
        title: "Invited talk highlights evidence design in learning analytics",
        summary: "The session focused on evidence structures, toolchains, and situated validation in teaching practice.",
        content: [
          "The talk introduced common ways of structuring evidence in learning analytics research and discussed how such studies can remain closely connected to concrete teaching settings.",
          "Participants also exchanged views on course implementation, data annotation, and the interpretability of analytical tools.",
        ],
      },
      "news-5": {
        label: "Seminar",
        title: "Winter seminar concludes with stage review",
        summary: "The team reviewed research goals, progress, and task assignments for the next phase.",
        content: [
          "The seminar summarized the lab's main research progress over the past year and clarified the division of work for the next stage.",
          "The meeting also reviewed the site's structure, content archiving workflow, and outward communication strategy.",
        ],
      },
    },
    ja: {
      "news-1": {
        label: "イベント",
        title: "春季オープンデーを開催",
        summary: "研究分野、ツール、チーム活動を紹介する公開展示と質疑応答を実施しました。",
        content: [
          "学内外の学生や連携先に向けて、研究室の研究テーマ、教育支援ツール、プロジェクト事例を紹介しました。",
          "当日はメンバー交流、プロジェクト紹介、募集相談も行い、今後の協働や応募につながる対面の機会となりました。",
        ],
      },
      "news-2": {
        label: "成果",
        title: "研究室論文が教育工学系会議に採択",
        summary: "エビデンスに基づく学習に向けた多元データの構成とフィードバック設計を扱った論文です。",
        content: [
          "本論文では、学習エビデンスチェーンの構成方法を中心に、実際の授業場面でプロセスデータ、評価情報、フィードバック戦略をどのように結び付けるかを議論しました。",
          "この成果は、研究室の教育支援プラットフォームと研究ツールの次の改善にも活用されます。",
        ],
      },
      "news-3": {
        label: "共同研究",
        title: "地域連携研究プログラムを開始",
        summary: "実際の授業とプロジェクト課題を基盤にした新しい協働モデルを検討しています。",
        content: [
          "研究室は連携機関とともに、教育データガバナンス、授業フィードバック、支援ツール導入に関する共同研究を進めます。",
          "この取り組みからは、研究発表、論文成果、対外支援につながる協働成果が継続的に蓄積される見込みです。",
        ],
      },
      "news-4": {
        label: "講演",
        title: "招待講演でラーニングアナリティクスのエビデンス設計を議論",
        summary: "授業エビデンス構造、ツールチェーン、文脈に即した検証について学術交流を行いました。",
        content: [
          "講演では、ラーニングアナリティクス研究で用いられるエビデンスの構成方法を紹介し、研究を具体的な授業場面に近づける視点が共有されました。",
          "会場では、授業実装、データアノテーション、分析ツールの解釈可能性についても議論が行われました。",
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
    hero: heroOverrides[locale],
    archiveTitle: locale === "zh" ? "新闻归档" : locale === "en" ? "Archive" : "アーカイブ",
    archiveSubtitle:
      locale === "zh"
        ? "较早的新闻会在这里保留，并同步导出为本地归档文件。"
        : locale === "en"
          ? "Archived news remains available here and is also exported to local files on the server."
          : "アーカイブ済みのニュースはここに保存され、サーバー上のローカルファイルにも書き出されます。",
    items: locale === "zh" ? news.items : applyById(news.items, itemOverrides[locale]),
    archivedItems: locale === "zh" ? news.archivedItems : applyById(news.archivedItems, itemOverrides[locale]),
  };
};

const localizeHome = (home: SiteData["home"], locale: SiteLocale) => {
  const activityOverrides = {
    zh: {
      "home-activity-1": {
        label: "开放日",
        title: "春季开放日交流顺利举行",
        summary: "围绕学习分析、智能学习支持与研究协作进行了展示与交流。",
      },
      "home-activity-2": {
        label: "论文",
        title: "实验室论文入选教育技术方向会议",
        summary: "展示了证据链建模、教学设计与学习分析方面的阶段性成果。",
      },
      "home-activity-3": {
        label: "招募",
        title: "研究助理与研究生招募持续开放",
        summary: "欢迎对教育技术、数据分析、人机交互与系统开发感兴趣的同学联系。",
      },
      "home-activity-4": {
        label: "合作",
        title: "区域合作研究项目启动",
        summary: "围绕真实教学场景中的数据采集、评价反馈与系统部署展开协作。",
      },
    },
    en: {
      "home-activity-1": {
        label: "Open Day",
        title: "Spring open day successfully held",
        summary: "Visitors explored learning analytics, intelligent learning support, and ongoing collaborative projects.",
      },
      "home-activity-2": {
        label: "Paper",
        title: "Lab paper accepted at an educational technology conference",
        summary: "The work highlights recent progress in evidence-chain modeling, instructional design, and learning analytics.",
      },
      "home-activity-3": {
        label: "Join Us",
        title: "Recruitment remains open for research assistants and graduate students",
        summary: "We welcome students interested in educational technology, data analysis, HCI, and system development.",
      },
      "home-activity-4": {
        label: "Collaboration",
        title: "Regional collaboration project launched",
        summary: "The team is working on data collection, evaluation, and feedback in authentic teaching settings.",
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
      locale === "zh"
        ? {
            eyebrow: "Yin-Lab",
            title: "Yin-Lab：人工智能教育实验室",
            subtitle: "围绕学习分析、教育技术设计与真实教学场景，探索人工智能如何支持教与学",
            description:
              "我们关注学习数据、教学过程与智能系统的结合，持续推进研究、工具开发与现场验证，希望让教育技术真正进入课程、课堂与长期学习实践。",
            primaryAction: { label: "了解实验室", href: "/about" },
            secondaryAction: { label: "查看研究内容", href: "/research" },
          }
        : locale === "en"
        ? {
            eyebrow: "Yin-Lab",
            title: "Yin-Lab: Artificial Intelligence in Education Lab",
            subtitle:
              "We explore how artificial intelligence can support teaching and learning through learning analytics, educational technology design, and research grounded in authentic educational settings.",
            description:
              "Our work connects learning data, instructional processes, and intelligent systems. We develop and validate research tools in close relation to courses, classrooms, and long-term educational practice.",
            primaryAction: { label: "About the lab", href: "/about" },
            secondaryAction: { label: "Explore research", href: "/research" },
          }
        : {
            eyebrow: "Yin-Lab",
            title: "Yin-Lab：教育における人工知能研究室",
            subtitle:
              "ラーニングアナリティクス、教育技術設計、実際の教育場面に根ざした研究を通して、人工知能が教えること・学ぶことをどう支えられるかを探究します。",
            description:
              "学習データ、授業過程、知的システムを結び付けながら、授業・コース・長期的な実践の中で使われる研究とツールを設計し、現場で検証しています。",
            primaryAction: { label: "研究室紹介", href: "/about" },
            secondaryAction: { label: "研究内容", href: "/research" },
          },
    activities: applyById(home.activities, activityOverrides[locale]),
    intro:
      locale === "zh"
        ? {
            ...home.intro,
            title: "实验室概览",
            description: "从研究问题、技术路径到真实应用场景，快速了解实验室的整体定位。",
            buttonLabel: "进一步了解",
            content: [
              "实验室以人工智能教育为核心，长期关注学习分析、教育技术设计、学习支持系统与数据驱动的教学改进。",
              "我们强调研究与实践并行，希望把问题、方法、系统与现场验证连接起来，而不是停留在概念层面。",
            ],
          }
        : locale === "en"
          ? {
              ...home.intro,
              title: "Lab overview",
              description: "A quick introduction to the lab's themes, methods, and practical orientation.",
              buttonLabel: "Learn more",
              content: [
                "The lab focuses on artificial intelligence in education, with long-term interests in learning analytics, educational technology design, learning support systems, and data-informed instructional improvement.",
                "We emphasize the connection between research and practice, linking questions, methods, systems, and field-based validation rather than stopping at abstract concepts.",
              ],
            }
          : {
              ...home.intro,
              title: "研究室概要",
              description: "研究テーマ、方法、実践とのつながりを短く紹介します。",
              buttonLabel: "詳しく見る",
              content: [
                "本研究室は教育における人工知能を中心に、ラーニングアナリティクス、教育技術設計、学習支援システム、データに基づく授業改善に継続的に取り組んでいます。",
                "研究と実践を切り離さず、問い、方法、システム、現場での検証を結び付けながら進めることを重視しています。",
              ],
            },
    newsLead:
      locale === "zh"
        ? { ...home.newsLead, title: "最新动态", description: "查看近期研究活动、论文消息与合作进展。", buttonLabel: "查看新闻" }
        : locale === "en"
          ? { ...home.newsLead, title: "Latest updates", description: "Follow recent news, talks, papers, and collaborations.", buttonLabel: "View news" }
          : { ...home.newsLead, title: "最新情報", description: "最近の研究活動、論文、共同研究の更新を確認できます。", buttonLabel: "ニュースを見る" },
    membersLead:
      locale === "zh"
        ? { ...home.membersLead, title: "团队成员", description: "认识支撑实验室研究、开发与合作工作的成员。", buttonLabel: "查看成员" }
        : locale === "en"
          ? { ...home.membersLead, title: "Team members", description: "Meet the people behind the lab's research, development, and collaborations.", buttonLabel: "View members" }
          : { ...home.membersLead, title: "メンバー", description: "研究、開発、共同研究を支えるメンバーを紹介します。", buttonLabel: "メンバーを見る" },
    recruitmentLead:
      locale === "zh"
        ? {
            ...home.recruitmentLead,
            title: "加入我们",
            description: "如果你希望在真实教育场景中做研究与系统开发，欢迎进一步了解。",
            buttonLabel: "查看招募",
          }
        : locale === "en"
          ? {
              ...home.recruitmentLead,
              title: "Join us",
              description: "If you want to work on research and systems grounded in real educational settings, we would be glad to hear from you.",
              buttonLabel: "View opportunities",
            }
          : {
              ...home.recruitmentLead,
              title: "募集情報",
              description: "実際の教育現場に根ざした研究やシステム開発に関心のある方はぜひご覧ください。",
              buttonLabel: "募集を見る",
            },
  };
};

const localizeAbout = (about: SiteData["about"], locale: SiteLocale) => {
  return locale === "zh"
    ? {
        ...about,
        hero: {
          eyebrow: "关于实验室",
          title: "面向智能教育的研究与实践",
          subtitle: "围绕学习分析、教育技术设计与真实教学环境，构建能够被使用、被验证的智能学习支持系统",
          description: "我们希望把教育问题、数据方法与系统实现真正连接起来，让研究成果在课程、课堂和长期学习活动中发生作用。",
        },
        introTitle: "实验室介绍",
        introText: [
          "实验室以人工智能教育为核心，持续关注知识传递、学习支持、问题发现与学习创造等过程，探索技术如何真正服务教与学。",
          "我们把教学与学习理解为一种持续发生的信息交互过程，因此会从真实教育场景中提出问题，再通过数据分析、系统设计与工具开发去回应这些问题。",
          "在移动与泛在学习方向，我们关注学习过程与情境的结合，研究如何让学习支持更贴近真实使用环境。",
          "在社会性学习方向，我们关注学习者之间的互动、互助与协作，希望通过平台与机制设计提升同伴支持的质量。",
          "在研究趋势支持与文本分析方向，我们尝试把信息检索、文本挖掘与学习活动结合起来，让“查找资料”本身也成为有支持的学习过程。",
          "在教育大数据与学习分析方向，我们通过课程日志、平台行为与学习证据的组织，推动教学改进与智能教育工具的长期建设。",
        ],
        introHighlights: [
          {
            id: "about-highlight-1",
            title: "AIE Research Lab",
            value: "以教育大数据与人工智能推动未来教育",
            caption:
              "实验室围绕教育大数据、人工智能与学习支持技术展开研究，并积极连接学校教育、健康、信息等不同应用场景。",
          },
          {
            id: "about-highlight-2",
            title: "Educational Technology",
            value: "把教育问题真正转化为可实践的方法",
            caption:
              "我们重视的不只是技术本身，而是这些技术能否在真实课堂、课程与学习活动中产生作用，并形成可持续的方法。",
          },
          {
            id: "about-highlight-3",
            title: "CSEL",
            value: "从信息科学重新理解教学与学习",
            caption:
              "实验室把教育与学习视作信息交互过程，通过 ICT、数据分析与系统实现，构建可验证、可应用的智能学习环境。",
          },
        ],
        timelineTitle: "发展经历",
        timelineSubtitle: "从移动学习到教育大数据与人工智能应用，实验室的研究主题持续扩展。",
        timeline: [
          {
            ...about.timeline[0],
            title: "移动学习与泛在学习",
            description: "以移动技术和情境感知为基础，探索更灵活、更贴近真实环境的学习支持方式。",
          },
          {
            ...about.timeline[1],
            title: "社会性学习",
            description: "围绕同伴协作、知识共享与互动支持，研究学习共同体中的协作机制。",
          },
          {
            ...about.timeline[2],
            title: "教育数据挖掘与研究趋势分析",
            description: "通过文本挖掘与教育数据分析，支持知识发现、研究整理与学习过程理解。",
          },
          {
            ...about.timeline[3],
            title: "教育大数据与智能教育应用",
            description: "将教育大数据、学习分析与智能系统结合起来，推动教学改进与知能化学习支持。",
          },
        ],
        goalsTitle: "发展目标",
        goalsStatement: "在真实教育场景中，让数据、系统与研究方法共同服务长期的教学与学习改进。",
        goalsText: [
          "实验室希望通过整合教育大数据、人工智能与信息技术，构建更灵活、更有效、也更能落地的教学与学习支持环境。",
          "我们关注的不只是模型和算法，还包括研究问题如何形成、系统如何实现、证据如何被组织，以及成果如何进入真实使用场景。",
          "基于移动学习、社会性学习、教育数据挖掘与学习分析等长期积累，我们希望推动教育研究从经验驱动走向证据驱动。",
          "我们重视技术创新，也同样重视在真实教育环境中的应用与验证，让研究成果能够真正服务学校、课程与学习者。",
          "未来，实验室会继续推动教育工学、信息科学、人工智能与跨学科合作的深度结合，形成更有持续性的研究生态。",
        ],
        goalsCards: [
          {
            id: "goal-card-1",
            title: "目标 1",
            value: "让数据解释学习",
            caption: "通过教育大数据与学习分析发现有意义的教学与学习模式，为改进提供可靠证据。",
          },
          {
            id: "goal-card-2",
            title: "目标 2",
            value: "让智能进入教育",
            caption: "把人工智能、ICT 与系统开发结合起来，构建真正能够被课堂与课程使用的教育环境。",
          },
          {
            id: "goal-card-3",
            title: "目标 3",
            value: "让研究连接未来",
            caption: "通过跨学科融合与国际合作，形成具有长期影响力的研究与创新网络。",
          },
        ],
        introImageAlt: "实验室介绍图片",
      }
    : locale === "en"
    ? {
        ...about,
        hero: {
          eyebrow: "About the Lab",
          title: "Research and practice for intelligent education",
          subtitle:
            "We build intelligent learning support environments by connecting learning analytics, educational technology design, and work grounded in authentic educational settings.",
          description:
            "The lab is interested in how educational questions, data methods, and system development can be brought together so that research outcomes remain usable in courses, classrooms, and long-term learning practice.",
        },
        introTitle: "About the lab",
        introText: [
          "The lab focuses on artificial intelligence in education, asking how intelligent information environments can support knowledge transmission, inquiry, reflection, and creative learning.",
          "We treat teaching and learning as ongoing processes of information interaction. Starting from real educational settings, we identify practical questions and respond through data analysis, system design, and tool development.",
          "In mobile and ubiquitous learning, we study how learning processes and contexts can be connected more closely so that support is available where learners actually work and communicate.",
          "In social learning, we examine peer interaction, collaboration, and mutual support, designing mechanisms that improve how learners find help and learn with one another.",
          "In text mining and research support, we combine information retrieval with learning activity design so that searching for prior work becomes part of a supported learning process.",
          "In educational big data and learning analytics, we organize learning evidence from authentic courses and platforms to support better instructional design and the long-term development of intelligent learning tools.",
        ],
        introHighlights: [
          {
            id: "about-highlight-1",
            title: "AIE Research Lab",
            value: "Advancing future education through educational big data and AI",
            caption:
              "The lab studies educational big data, artificial intelligence, and learning support technologies, while actively connecting school education with broader application contexts and international collaboration.",
          },
          {
            id: "about-highlight-2",
            title: "Educational Technology",
            value: "Turning educational questions into usable methods",
            caption:
              "We care not only about technology itself, but also about whether it can work in real courses and classrooms and become a sustainable way of improving teaching and learning.",
          },
          {
            id: "about-highlight-3",
            title: "CSEL",
            value: "Reframing teaching and learning through information science",
            caption:
              "The lab treats education and learning as information interaction processes and uses ICT, data analysis, and system implementation to build intelligent learning environments that can be validated in practice.",
          },
        ],
        timelineTitle: "Lab milestones",
        timelineSubtitle: "From mobile learning to educational big data and AI applications, the lab's agenda has expanded over time.",
        timeline: [
          {
            ...about.timeline[0],
            title: "Mobile and ubiquitous learning",
            description: "Exploring flexible learning support built on mobile technology and context-aware learning environments.",
          },
          {
            ...about.timeline[1],
            title: "Social learning",
            description: "Studying collaboration, knowledge sharing, and peer support in learner communities.",
          },
          {
            ...about.timeline[2],
            title: "Educational data mining and trend analysis",
            description: "Using text mining and educational data analysis to support knowledge discovery and research organization.",
          },
          {
            ...about.timeline[3],
            title: "Educational big data and intelligent education",
            description: "Connecting educational big data, learning analytics, and intelligent systems to support instructional improvement.",
          },
        ],
        goalsTitle: "Future directions",
        goalsStatement: "Bring data, systems, and research methods together so that they genuinely support long-term teaching and learning improvement.",
        goalsText: [
          "The lab aims to build educational and learning support environments that are more adaptive, effective, and usable by integrating educational big data, artificial intelligence, and information technologies.",
          "We are interested not only in models and algorithms, but also in how research questions are formed, how systems are implemented, how evidence is organized, and how outcomes enter authentic settings.",
          "Building on long-term work in mobile learning, social learning, educational data mining, and learning analytics, we seek to move educational research from experience-driven practice toward evidence-driven practice.",
          "We value technical innovation, but we give equal weight to application and validation in real educational environments so that research outcomes can serve schools, courses, and learners directly.",
          "The lab will continue to strengthen interdisciplinary integration and international collaboration across educational technology, information science, artificial intelligence, and related domains.",
        ],
        goalsCards: [
          {
            id: "goal-card-1",
            title: "Goal 1",
            value: "Let data explain learning",
            caption:
              "Use educational big data and learning analytics to reveal meaningful teaching and learning patterns and provide evidence for improvement.",
          },
          {
            id: "goal-card-2",
            title: "Goal 2",
            value: "Bring intelligence into education",
            caption:
              "Combine AI, ICT, and system development to build educational environments that can genuinely be used in classrooms and courses.",
          },
          {
            id: "goal-card-3",
            title: "Goal 3",
            value: "Connect research with the future",
            caption:
              "Develop a sustainable research and innovation network through interdisciplinary integration and international collaboration.",
          },
        ],
        introImageAlt: "Lab overview image",
      }
    : {
        ...about,
        hero: {
          eyebrow: "研究室紹介",
          title: "知能教育のための研究と実践",
          subtitle: "ラーニングアナリティクス、教育技術設計、実際の教育場面に根ざした取り組みを通して、使われる知的学習支援環境を構築します。",
          description: "教育課題、データ分析、システム開発を結び付け、研究成果が授業・コース・継続的な学びの中で機能することを重視しています。",
        },
        introTitle: "研究室概要",
        introText: [
          "本研究室では、知識伝達、気づき、創造を支える知的情報環境をどのように構築するかを中心課題として研究を進めています。",
          "教育と学習を情報相互作用の過程として捉え、実際の教育場面から課題を見つけ出し、データ分析、システム設計、ツール開発を通して応答します。",
          "モバイル・ユビキタス学習では、学習過程と状況のつながりに注目し、学習者が実際に活動する場に寄り添う支援を設計します。",
          "社会的学習では、学習者同士の相互作用、協働、相互支援に着目し、学び合いを支える仕組みを探究しています。",
          "研究動向調査支援やテキストマイニングでは、情報検索と学習活動を結び付け、『調べること』自体を支援された学習過程へと変えていきます。",
          "教育ビッグデータとラーニングアナリティクスでは、実際の授業・プラットフォームから得られる学習証拠を整理し、授業改善と知的学習支援ツールの発展につなげます。",
        ],
        introHighlights: [
          {
            id: "about-highlight-1",
            title: "AIE Research Lab",
            value: "教育ビッグデータと AI で教育の未来をひらく",
            caption:
              "教育ビッグデータ、AI、学習支援技術を基盤に、学校教育を中心としながら多様な応用場面へ広がる知的教育環境を探究しています。",
          },
          {
            id: "about-highlight-2",
            title: "Educational Technology",
            value: "教育課題を実際に使える方法へ変える",
            caption:
              "技術そのものだけでなく、それが授業やコースの中で本当に機能し、継続的に使える方法になるかを重視しています。",
          },
          {
            id: "about-highlight-3",
            title: "CSEL",
            value: "情報科学から教えること・学ぶことを再構成する",
            caption:
              "教育と学習を情報相互作用として捉え、ICT、データ分析、システム実装を通して、現場で検証できる知的学習環境を構築します。",
          },
        ],
        timelineTitle: "研究の歩み",
        timelineSubtitle: "モバイル学習から教育ビッグデータと人工知能応用へ、研究室のテーマは継続的に広がってきました。",
        timeline: [
          {
            ...about.timeline[0],
            title: "モバイル・ユビキタス学習",
            description: "モバイル技術と状況依存型の学習支援を通して、柔軟で現場に近い学習環境を探究。",
          },
          {
            ...about.timeline[1],
            title: "社会的学習",
            description: "SNS や協調学習を手がかりに、学習者同士の相互作用と学び合いを支援。",
          },
          {
            ...about.timeline[2],
            title: "教育データマイニングと研究動向調査",
            description: "教育データとテキスト分析を活用し、知識発見と研究整理を支援。",
          },
          {
            ...about.timeline[3],
            title: "教育ビッグデータと知能教育応用",
            description: "教育ビッグデータ、学習分析、知的システムを結び付け、授業改善と学習支援に応用。",
          },
        ],
        goalsTitle: "目標",
        goalsStatement: "データ、システム、研究方法が一体となって、長期的な教育改善を支える状態を目指します。",
        goalsText: [
          "教育ビッグデータ、人工知能、情報技術を統合し、より柔軟で実用的な教育・学習支援環境を構築することを目指します。",
          "モデルやアルゴリズムだけでなく、研究課題の立て方、システム実装、証拠の整理、現場導入までを一つの流れとして捉えています。",
          "モバイル学習、社会的学習、教育データマイニング、ラーニングアナリティクスの蓄積をもとに、教育研究を経験駆動からエビデンス駆動へと進めます。",
          "技術革新と同時に、実際の教育環境での応用と検証を重視し、研究成果が学校、コース、学習者に直接役立つことを大切にします。",
          "教育工学、情報科学、人工知能、関連分野を横断する学際的・国際的な研究ネットワークを育てていきます。",
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
            caption: "AI、ICT、システム開発を組み合わせ、授業やコースで実際に使われる知的教育環境を構築します。",
          },
          {
            id: "goal-card-3",
            title: "目標 3",
            value: "研究を未来へつなぐ",
            caption: "学際的な融合と国際協働を通して、持続的な研究とイノベーションのネットワークを育てます。",
          },
        ],
        introImageAlt: "研究室紹介画像",
      };
};

const localizeRecruitment = (recruitment: SiteData["recruitment"], locale: SiteLocale) => {
  return locale === "zh"
    ? {
        ...recruitment,
        hero: {
          eyebrow: "加入我们",
          title: "在真实教育场景中做研究",
          subtitle: "欢迎对教育技术、学习分析、数据分析与系统开发感兴趣的同学加入",
          description: "如果你希望把研究问题真正落到工具、数据和实践上，这里会是一个适合长期投入与成长的地方。",
        },
      }
    : locale === "en"
    ? {
        ...recruitment,
        hero: {
          eyebrow: "Join Us",
          title: "Join the lab",
          subtitle: "Develop research and systems that are evidence-based, human-centered, and grounded in real educational settings",
          description:
            "We welcome students and researchers who want to connect educational questions with data, systems, and long-term field-based practice.",
        },
        intro: [
          "We welcome students and researchers from educational technology, computer science, data science, design, HCI, and related fields.",
          "Research here does not stay at the conceptual level. We work in courses, platforms, and authentic learning processes to formulate questions, design methods, build tools, and validate them in practice.",
          "If you want to turn ideas into systems, observations into evidence, and studies into work that has real impact, the lab can be a place for long-term growth.",
        ],
        audience: {
          title: "Who we are looking for",
          intro: "We especially welcome people who:",
          points: [
            "Stay curious about authentic problems in learning behavior, instructional design, and educational settings",
            "Want to translate research ideas into testable methods, prototypes, or analytics workflows",
            "Are ready to keep investing in at least one of programming, system development, data analysis, or visualization",
            "Can collaborate across disciplines and connect educational questions with technical capability",
            "Hope to develop their own research themes and communication skills in an international academic environment",
          ],
          note: "Students from different academic backgrounds and international applicants are welcome. If you already have projects, a portfolio, or a research plan, feel free to share them with us.",
        },
        growth: {
          title: "What you can learn in the lab",
          intro: "Through research, collaboration, and validation in authentic settings, you will gradually build capability in the following areas:",
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
          title: "実際の教育現場で研究する",
          subtitle: "教育技術、ラーニングアナリティクス、データ分析、システム開発に関心のある方を歓迎します",
          description:
            "研究の問いをツール、データ、実践へと結び付けながら、長期的に成長したい方に向いた研究環境です。",
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
  return {
    ...contact,
    hero:
      locale === "zh"
        ? {
            eyebrow: "联系方式",
            title: "到访与联系",
            subtitle: "地址、邮箱、地图与来访说明",
            description: "如需联系研究室或安排来访，请优先通过邮件提前沟通，我们会根据实际情况进行回复。",
          }
        : locale === "en"
        ? {
            eyebrow: "Contact",
            title: "Contact and access",
            subtitle: "Address, email, map, and visitor notes",
            description: "If you would like to contact the lab or plan a visit, please reach out by email in advance so that we can coordinate with you.",
          }
        : {
          eyebrow: "アクセス",
          title: "連絡先とアクセス",
          subtitle: "住所、メール、地図、来訪案内",
          description: "研究室へご連絡いただく場合や訪問を予定される場合は、事前にメールでご相談ください。",
        },
    methods: contact.methods.map((method) => {
      if (method.id === "contact-email") {
        return { ...method, label: locale === "zh" ? "邮箱" : locale === "en" ? "Email" : "メール" };
      }

      if (method.id === "contact-address") {
        return { ...method, label: locale === "zh" ? "地址" : locale === "en" ? "Location" : "所在地" };
      }

      return method;
    }),
    mapAlt: locale === "zh" ? "校园来访地图" : locale === "en" ? "Campus access map" : "キャンパス案内図",
    transitTitle: locale === "zh" ? "到访说明" : locale === "en" ? "Visitor notes" : "訪問案内",
    transitText:
      locale === "zh"
        ? [
            "右侧地图标示了信息基盘中心及周边校园位置，可作为来访参考。",
            "如计划到访，请提前通过邮件联系。",
          ]
        : locale === "en"
        ? [
            "The map on the right highlights the information center and the surrounding campus area for reference.",
            "Please contact us in advance if you plan to visit the lab.",
          ]
        : [
            "右側の地図では、情報基盤センターと周辺キャンパスの位置関係を確認できます。",
            "研究室を訪問される場合は、事前にメールでご連絡ください。",
          ],
  };
};

const localizePublications = (publications: SiteData["publications"], locale: SiteLocale) => {
  const groupTitles =
    locale === "zh"
      ? {
          "journal-papers": { title: "原著论文", summary: "正式发表的学术期刊论文。" },
          "book-chapters": { title: "主要著书", summary: "著作、章节与研究性书稿成果。" },
          "international-conference": { title: "国际会议", summary: "国际会议论文与学术发表。" },
          "domestic-conference": { title: "国内会议", summary: "国内会议报告、发表与交流记录。" },
          "external-funding": { title: "外部研究资金", summary: "竞争性经费、项目资助与研究计划。" },
          "invited-panel": { title: "受邀专题讨论", summary: "受邀报告、专题讨论与组织活动。" },
          awards: { title: "奖项", summary: "获奖、表彰与代表性荣誉。" },
        }
      : locale === "en"
      ? {
          "journal-papers": { title: "Journal Papers (Refereed)", summary: "Peer-reviewed journal publications." },
          "book-chapters": { title: "Books and Book Chapters (Refereed)", summary: "Refereed books, edited volumes, and book chapters." },
          "international-conference": { title: "International Conferences (Refereed)", summary: "Peer-reviewed papers presented at international conferences." },
          "domestic-conference": { title: "Domestic Conferences (Non-Refereed)", summary: "Presentations, reports, and proceedings from domestic conferences." },
          "external-funding": { title: "External Research Funding", summary: "Competitive grants, funded projects, and externally supported research." },
          "invited-panel": { title: "Invited Panel Discussions", summary: "Invited talks, panel discussions, and organized sessions." },
          awards: { title: "Awards", summary: "Awards, distinctions, and representative honors." },
        }
      : {
          "journal-papers": { title: "原著論文", summary: "査読付き学術論文。" },
          "book-chapters": { title: "主要著書", summary: "著書、章、研究書としてまとめた成果。" },
          "international-conference": { title: "国際会議", summary: "国際会議における査読付き論文と発表。" },
          "domestic-conference": { title: "国内会議", summary: "国内会議での発表、報告、研究交流の記録。" },
          "external-funding": { title: "外部研究資金", summary: "競争的資金、採択課題、外部支援による研究。" },
          "invited-panel": { title: "招待パネルディスカッション", summary: "招待講演、パネル討論、企画セッション。" },
          awards: { title: "受賞", summary: "受賞、表彰、代表的な成果。" },
        };

  return {
    ...publications,
    hero:
      locale === "zh"
        ? {
            eyebrow: "出版物",
            title: "出版物与学术成果",
            subtitle: "论文、著作、会议发表、研究资金与获奖记录",
            description: "本页按照成果类型整理实验室的重要学术产出，便于长期追加、浏览与检索。",
          }
        : locale === "en"
        ? {
            eyebrow: "Publications",
            title: "Publications and scholarly output",
            subtitle: "Papers, books, conference presentations, funding, and awards",
            description: "The page organizes major academic outputs by category for long-term maintenance and browsing.",
          }
        : {
          eyebrow: "出版物",
          title: "出版物と学術成果",
          subtitle: "論文、著作、会議発表、研究資金、受賞記録",
          description: "研究室の主要な学術成果をカテゴリごとに整理し、継続的に追加・参照しやすい形でまとめています。",
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
        ? {
            eyebrow: "成员",
            title: "持续协作中的研究团队",
            subtitle: "教职员工、学生与合作伙伴",
            description: "围绕智能教育、学习分析与教育技术设计，实验室逐步形成了跨背景协作的研究团队。",
          }
        : locale === "en"
          ? {
              eyebrow: "Members",
              title: "People behind the lab",
              subtitle: "Faculty, students, and collaborators",
              description:
                "The lab brings together researchers and students working across learning analytics, educational technology design, data-informed teaching, and system development.",
            }
          : {
              eyebrow: "メンバー",
              title: "研究室を支えるメンバー",
              subtitle: "教職員・学生・共同研究者",
              description:
                "ラーニングアナリティクス、教育技術設計、データに基づく授業改善、システム開発に取り組むメンバーが協働しています。",
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

export const getLocalizedSiteData = (locale: SiteLocale) => {
  const data = readSiteData();
  return localizeSiteData(data, locale);
};
