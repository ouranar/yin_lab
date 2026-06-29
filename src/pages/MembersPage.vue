<template>
  <PageHero :hero="data.members.hero" />

  <section class="section-shell">
    <div class="member-tabs">
      <a v-for="group in groups" :key="group.id" class="button-link button-link--secondary" :href="`#${group.id}`">
        {{ group.title }}
      </a>
    </div>

    <section v-for="group in groups" :id="group.id" :key="group.id" class="member-group">
      <h2>{{ group.title }}</h2>
      <div class="card-grid card-grid--members">
        <MemberCard v-for="member in group.items" :key="member.id" :locale="locale" :member="member" />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MemberCard from "@/components/site/MemberCard.vue";
import PageHero from "@/components/site/PageHero.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { getVisibleMemberGroups } from "@/lib/site-data";

const { data, locale } = useSiteContext();
const groups = computed(() => getVisibleMemberGroups(data.value));
</script>
