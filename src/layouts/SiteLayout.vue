<template>
  <div class="page-shell">
    <SiteHeader
      :lab-name="data.settings.labName"
      :locale="locale"
      :navigation="data.navigation"
      :short-name="data.settings.shortName"
    />
    <main class="page-main">
      <RouterView />
    </main>
    <SiteFooter
      :footer-note="getShellFooterNote(locale) || data.settings.footerNote"
      :lab-name="getShellLabName(locale) || data.settings.labName"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SiteFooter from "@/components/site/SiteFooter.vue";
import SiteHeader from "@/components/site/SiteHeader.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { getShellFooterNote, getShellLabName } from "@/lib/i18n";

const { data, locale } = useSiteContext();
</script>
