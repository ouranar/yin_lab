<template>
  <header class="site-header">
    <div class="site-header__inner">
      <AppLink class-name="site-brand" :to="withLocalePath(locale, '/')">
        <span class="site-brand__mark">{{ shortName }}</span>
        <span class="site-brand__text">
          <strong>{{ brandName }}</strong>
          <small>{{ shortName }}</small>
        </span>
      </AppLink>

      <nav class="site-nav" :aria-label="navLabel">
        <AppLink
          v-for="item in navigation"
          :key="item.href"
          class-name="site-nav__link"
          :to="withLocalePath(locale, item.href)"
        >
          {{ getShellNavigationLabel(locale, item.href, item.label) }}
        </AppLink>
      </nav>

      <div class="site-header__controls">
        <div class="language-switcher" :aria-label="switcherLabel">
          <RouterLink
            v-for="targetLocale in siteLocales"
            :key="targetLocale"
            :class="['language-switcher__link', { 'is-active': targetLocale === locale }]"
            :href-lang="targetLocale"
            :lang="targetLocale"
            :to="withLocalePath(targetLocale, currentPath)"
          >
            {{ localeLabels[targetLocale] }}
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import AppLink from "@/components/site/AppLink.vue";
import {
  getShellLabName,
  getShellNavigationLabel,
  localeLabels,
  removeLocalePrefix,
  siteLocales,
  type SiteLocale,
  withLocalePath,
} from "@/lib/i18n";
import type { NavItem } from "@/types/site";

const props = defineProps<{
  labName: string;
  shortName: string;
  navigation: NavItem[];
  locale: SiteLocale;
}>();

const route = useRoute();
const currentPath = computed(() => removeLocalePrefix(route.fullPath));
const brandName = computed(() => getShellLabName(props.locale) || props.labName);
const navLabel = computed(() =>
  props.locale === "en" ? "Primary navigation" : props.locale === "ja" ? "メインナビゲーション" : "主导航",
);
const switcherLabel = computed(() =>
  props.locale === "en" ? "Language switcher" : props.locale === "ja" ? "言語切替" : "语言切换",
);
</script>
