import { createRouter, createWebHistory } from "vue-router";
import SiteLayout from "@/layouts/SiteLayout.vue";
import AboutPage from "@/pages/AboutPage.vue";
import ContactPage from "@/pages/ContactPage.vue";
import HomePage from "@/pages/HomePage.vue";
import MemberDetailPage from "@/pages/MemberDetailPage.vue";
import MembersPage from "@/pages/MembersPage.vue";
import NewsArchivePage from "@/pages/NewsArchivePage.vue";
import NewsDetailPage from "@/pages/NewsDetailPage.vue";
import NewsPage from "@/pages/NewsPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import PublicationsPage from "@/pages/PublicationsPage.vue";
import RecruitmentPage from "@/pages/RecruitmentPage.vue";
import ResearchPage from "@/pages/ResearchPage.vue";
import { defaultSiteLocale, getShellLabName, getSiteUiText, isSiteLocale } from "@/lib/i18n";

const localeParam = "zh|en|ja";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      redirect: `/${defaultSiteLocale}`,
    },
    {
      path: `/:locale(${localeParam})`,
      component: SiteLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePage,
        },
        {
          path: "about",
          name: "about",
          component: AboutPage,
        },
        {
          path: "news",
          name: "news",
          component: NewsPage,
        },
        {
          path: "news/archive",
          name: "news-archive",
          component: NewsArchivePage,
        },
        {
          path: "news/:slug",
          name: "news-detail",
          component: NewsDetailPage,
        },
        {
          path: "members",
          name: "members",
          component: MembersPage,
        },
        {
          path: "members/:slug",
          name: "member-detail",
          component: MemberDetailPage,
        },
        {
          path: "research",
          name: "research",
          component: ResearchPage,
        },
        {
          path: "publications",
          name: "publications",
          component: PublicationsPage,
        },
        {
          path: "recruitment",
          name: "recruitment",
          component: RecruitmentPage,
        },
        {
          path: "contact",
          name: "contact",
          component: ContactPage,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundPage,
    },
  ],
});

router.afterEach((to) => {
  const localeParamValue = typeof to.params.locale === "string" && isSiteLocale(to.params.locale) ? to.params.locale : defaultSiteLocale;
  const ui = getSiteUiText(localeParamValue);
  const sectionMap: Record<string, string> = {
    home: getShellLabName(localeParamValue),
    about: "About",
    news: "News",
    "news-archive": ui.news.archiveHeroSubtitle,
    "news-detail": "News",
    members: "Members",
    "member-detail": "Members",
    research: "Research",
    publications: "Publications",
    recruitment: "Recruitment",
    contact: "Contact",
  };
  const routeName = typeof to.name === "string" ? to.name : "home";
  const sectionTitle = sectionMap[routeName] ?? getShellLabName(localeParamValue);
  document.title =
    sectionTitle === getShellLabName(localeParamValue)
      ? getShellLabName(localeParamValue)
      : `${sectionTitle} | ${getShellLabName(localeParamValue)}`;
});

export default router;
