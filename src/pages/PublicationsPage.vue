<template>
  <PageHero :hero="data.publications.hero" />

  <section class="section-shell">
    <RecordDirectory :groups="data.publications.groups" :locale="locale" />
  </section>
</template>

<script setup lang="ts">
import PageHero from "@/components/site/PageHero.vue";
import RecordDirectory from "@/components/site/RecordDirectory.vue";
import { useSiteContext } from "@/composables/useSiteContext";

const { data, locale } = useSiteContext();
</script>
