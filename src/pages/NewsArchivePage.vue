<template>
  <PageHero
    :hero="{
      eyebrow: 'News Archive',
      title: data.news.archiveTitle,
      subtitle: ui.news.archiveHeroSubtitle,
      description: data.news.archiveSubtitle,
    }"
  />

  <section class="section-shell">
    <div class="card-grid card-grid--news">
      <template v-if="items.length">
        <NewsCard v-for="item in items" :key="item.id" archived :item="item" :locale="locale" />
      </template>
      <p v-else>{{ ui.news.emptyArchive }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NewsCard from "@/components/site/NewsCard.vue";
import PageHero from "@/components/site/PageHero.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { getArchivedNews } from "@/lib/site-data";

const { data, locale, ui } = useSiteContext();

const items = computed(() => getArchivedNews(data.value));
</script>
