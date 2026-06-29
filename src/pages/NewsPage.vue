<template>
  <PageHero :hero="data.news.hero" />

  <section class="section-shell">
    <div class="archive-banner">
      <div>
        <p class="section-heading__eyebrow">{{ ui.news.archiveEyebrow }}</p>
        <h2>{{ data.news.archiveTitle }}</h2>
        <p>{{ data.news.archiveSubtitle }}</p>
      </div>
      <AppLink class-name="button-link button-link--secondary" :to="withLocalePath(locale, '/news/archive')">
        {{ `${ui.news.viewArchive} (${archivedCount})` }}
      </AppLink>
    </div>

    <div class="card-grid card-grid--news">
      <NewsCard v-for="item in items" :key="item.id" :item="item" :locale="locale" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import NewsCard from "@/components/site/NewsCard.vue";
import PageHero from "@/components/site/PageHero.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { withLocalePath } from "@/lib/i18n";
import { getArchivedNews, getVisibleNews } from "@/lib/site-data";

const { data, locale, ui } = useSiteContext();

const items = computed(() => getVisibleNews(data.value));
const archivedCount = computed(() => getArchivedNews(data.value).length);
</script>
