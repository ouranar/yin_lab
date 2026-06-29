<template>
  <section class="page-hero">
    <div class="page-hero__content">
      <p class="page-hero__eyebrow">{{ hero.eyebrow }}</p>
      <h1>{{ hero.title }}</h1>
      <p v-if="hero.subtitle?.trim()" class="page-hero__subtitle">{{ hero.subtitle }}</p>
      <p v-if="hero.description?.trim()" class="page-hero__description">{{ hero.description }}</p>
      <div v-if="hero.primaryAction || hero.secondaryAction" class="page-hero__actions">
        <AppLink
          v-if="hero.primaryAction"
          class-name="button-link button-link--primary"
          :to="hero.primaryAction.href"
        >
          {{ hero.primaryAction.label }}
        </AppLink>
        <AppLink
          v-if="hero.secondaryAction"
          class-name="button-link button-link--secondary"
          :to="hero.secondaryAction.href"
        >
          {{ hero.secondaryAction.label }}
        </AppLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppLink from "@/components/site/AppLink.vue";
import type { PageHero as PageHeroType } from "@/types/site";

defineProps<{
  hero: PageHeroType;
}>();
</script>
