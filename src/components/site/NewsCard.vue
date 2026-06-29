<template>
  <article :class="classNames('news-card', !hasImage && 'news-card--text-only')">
    <div v-if="hasImage" class="news-card__media">
      <img :alt="item.title" :src="item.image" />
    </div>
    <div class="news-card__body">
      <div class="news-card__meta">
        <span>{{ formatDate(item.date, locale) }}</span>
        <b>{{ archived ? ui.news.archivedBadge : item.label }}</b>
      </div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.summary }}</p>
      <AppLink
        class-name="button-link button-link--ghost"
        :to="withLocalePath(locale, `/news/${item.slug}`)"
      >
        {{ ui.news.viewDetails }}
      </AppLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import { classNames, formatDate } from "@/lib/format";
import { defaultSiteLocale, getSiteUiText, type SiteLocale, withLocalePath } from "@/lib/i18n";
import type { NewsItem } from "@/types/site";

const props = withDefaults(
  defineProps<{
    item: NewsItem;
    archived?: boolean;
    locale?: SiteLocale;
  }>(),
  {
    archived: false,
    locale: defaultSiteLocale,
  },
);

const hasImage = computed(() => Boolean(props.item.image?.trim()));
const ui = computed(() => getSiteUiText(props.locale));
</script>
