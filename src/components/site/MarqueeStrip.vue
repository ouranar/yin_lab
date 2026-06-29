<template>
  <section class="marquee-section">
    <div class="marquee-track">
      <AppLink
        v-for="(item, index) in loopItems"
        :key="`${item.id}-${index}`"
        class-name="marquee-card"
        :to="withLocalePath(locale, item.href)"
      >
        <span class="marquee-card__date">{{ formatDate(item.date, locale) }}</span>
        <b>{{ item.label }}</b>
        <strong>{{ item.title }}</strong>
        <p>{{ item.summary }}</p>
      </AppLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import { formatDate } from "@/lib/format";
import { defaultSiteLocale, type SiteLocale, withLocalePath } from "@/lib/i18n";
import type { HomeActivity } from "@/types/site";

const props = withDefaults(
  defineProps<{
    items: HomeActivity[];
    locale?: SiteLocale;
  }>(),
  {
    locale: defaultSiteLocale,
  },
);

const loopItems = computed(() => [...props.items, ...props.items]);
</script>
