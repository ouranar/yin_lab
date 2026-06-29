import { computed } from "vue";
import { useRoute } from "vue-router";
import { defaultSiteLocale, getSiteUiText, isSiteLocale, type SiteLocale } from "@/lib/i18n";
import { getLocalizedSiteData } from "@/lib/localized-site-data";

export const useSiteContext = () => {
  const route = useRoute();

  const locale = computed<SiteLocale>(() => {
    const value = route.params.locale;
    return typeof value === "string" && isSiteLocale(value) ? value : defaultSiteLocale;
  });

  const data = computed(() => getLocalizedSiteData(locale.value));
  const ui = computed(() => getSiteUiText(locale.value));

  return {
    locale,
    data,
    ui,
  };
};
