<template>
  <article class="member-card">
    <div class="member-card__media">
      <img :alt="displayName" :src="member.image" />
    </div>
    <div class="member-card__body">
      <p>{{ member.title }}</p>
      <h3>
        <AppLink :to="withLocalePath(locale, `/members/${getMemberRouteSlug(member)}`)">
          {{ displayName }}
        </AppLink>
      </h3>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import { defaultSiteLocale, getLocalizedMemberName, type SiteLocale, withLocalePath } from "@/lib/i18n";
import { getMemberRouteSlug } from "@/lib/site-data";
import type { Member } from "@/types/site";

const props = withDefaults(
  defineProps<{
    member: Member;
    locale?: SiteLocale;
  }>(),
  {
    locale: defaultSiteLocale,
  },
);

const displayName = computed(() => getLocalizedMemberName(props.member, props.locale));
</script>
