<template>
  <section v-if="item" class="section-shell section-shell--detail">
    <div class="detail-header">
      <span>{{ formatDate(item.date, locale) }}</span>
      <b>{{ item.label }}</b>
      <h1>{{ item.title }}</h1>
      <p>{{ item.summary }}</p>
      <div class="page-hero__actions">
        <AppLink class-name="button-link button-link--secondary" :to="withLocalePath(locale, '/news')">
          {{ ui.news.backToNews }}
        </AppLink>
        <AppLink
          v-if="item.relatedLink"
          class-name="button-link button-link--primary"
          :target="getExternalTarget(item.relatedLink)"
          :to="item.relatedLink"
        >
          {{ ui.news.relatedLink }}
        </AppLink>
      </div>
    </div>

    <div class="detail-media">
      <img :alt="item.title" :src="item.image" />
    </div>

    <div class="detail-body">
      <p v-for="paragraph in splitParagraphs(item.content)" :key="paragraph">{{ paragraph }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppLink from "@/components/site/AppLink.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { formatDate, splitParagraphs } from "@/lib/format";
import { withLocalePath } from "@/lib/i18n";
import { findNewsBySlug } from "@/lib/site-data";

const route = useRoute();
const { data, locale, ui } = useSiteContext();

const item = computed(() => {
  const slug = typeof route.params.slug === "string" ? decodeURIComponent(route.params.slug) : "";
  return findNewsBySlug(data.value, slug);
});

const getExternalTarget = (href: string) => (/^(https?:)?\/\//.test(href) ? "_blank" : undefined);
</script>
