<template>
  <PageHero :hero="data.recruitment.hero" />

  <section class="section-shell recruitment-page">
    <article class="recruitment-story">
      <div class="recruitment-story__main">
        <p v-for="(paragraph, index) in data.recruitment.intro" :key="`intro-${index}`">{{ paragraph }}</p>
      </div>
    </article>

    <section class="recruitment-section recruitment-section--audience">
      <header class="recruitment-section__header">
        <p class="recruitment-section__eyebrow">{{ ui.recruitment.audienceEyebrow }}</p>
        <h2>{{ data.recruitment.audience.title }}</h2>
        <p>{{ data.recruitment.audience.intro }}</p>
      </header>

      <ul class="recruitment-targets">
        <li v-for="(point, index) in data.recruitment.audience.points" :key="`audience-${index}`" class="recruitment-target">
          <span aria-hidden="true" class="recruitment-target__icon" />
          <span>{{ point }}</span>
        </li>
      </ul>

      <p v-if="data.recruitment.audience.note" class="recruitment-section__note">{{ data.recruitment.audience.note }}</p>
    </section>

    <section class="recruitment-section recruitment-section--growth">
      <header class="recruitment-section__header">
        <p class="recruitment-section__eyebrow">{{ ui.recruitment.growthEyebrow }}</p>
        <h2>{{ data.recruitment.growth.title }}</h2>
        <p>{{ data.recruitment.growth.intro }}</p>
      </header>

      <div class="recruitment-skill-grid">
        <article v-for="card in data.recruitment.growth.cards" :key="card.id" class="recruitment-skill-card">
          <div class="recruitment-skill-card__header">
            <span aria-hidden="true" class="recruitment-skill-card__badge" />
            <h3>{{ card.title }}</h3>
          </div>
          <ul>
            <li v-for="(item, index) in card.items" :key="`${card.id}-${index}`">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="recruitment-cta">
      <div class="recruitment-cta__body">
        <p class="recruitment-section__eyebrow">{{ ui.recruitment.contactEyebrow }}</p>
        <h2>{{ data.recruitment.callToAction.title }}</h2>
        <p>{{ data.recruitment.callToAction.content }}</p>
      </div>

      <AppLink
        v-if="data.recruitment.callToAction.href && data.recruitment.callToAction.linkLabel"
        class-name="button-link button-link--primary"
        :to="data.recruitment.callToAction.href"
      >
        {{ data.recruitment.callToAction.linkLabel }}
      </AppLink>
    </section>
  </section>
</template>

<script setup lang="ts">
import AppLink from "@/components/site/AppLink.vue";
import PageHero from "@/components/site/PageHero.vue";
import { useSiteContext } from "@/composables/useSiteContext";

const { data, ui } = useSiteContext();
</script>
