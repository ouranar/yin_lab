<template>
  <PageHero :hero="data.research.hero" />

  <section class="section-shell">
    <SectionHeading :title="data.research.directionsTitle" />
    <div class="card-grid card-grid--research-directions">
      <article v-for="item in directions" :key="item.id" class="research-card research-card--direction">
        <div class="research-card__media research-card__media--direction">
          <img :alt="item.title" :src="item.image" />
        </div>
        <div class="research-card__content research-card__content--direction">
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <ul class="tag-list">
            <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
          </ul>
          <AppLink v-if="item.link" class-name="button-link button-link--ghost" :to="item.link">
            {{ ui.research.relatedLink }}
          </AppLink>
        </div>
      </article>
    </div>
  </section>

  <section class="section-shell">
    <SectionHeading :title="data.research.projectsTitle" />
    <div class="card-grid card-grid--projects">
      <article v-for="item in projects" :key="item.id" class="research-card research-card--stacked">
        <img :alt="item.title" :src="item.image" />
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <ul class="tag-list">
            <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import PageHero from "@/components/site/PageHero.vue";
import SectionHeading from "@/components/site/SectionHeading.vue";
import { useSiteContext } from "@/composables/useSiteContext";

const { data, ui } = useSiteContext();

const directions = computed(() => data.value.research.directions.filter((item) => item.visible !== false));
const projects = computed(() => data.value.research.projects.filter((item) => item.visible !== false));
</script>
