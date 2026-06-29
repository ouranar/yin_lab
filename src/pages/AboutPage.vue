<template>
  <section class="about-hero">
    <div class="about-hero__content">
      <p class="page-hero__eyebrow">{{ data.about.hero.eyebrow }}</p>
      <h1>{{ data.about.hero.title }}</h1>
      <p class="about-hero__subtitle">{{ data.about.hero.subtitle }}</p>
      <p v-if="data.about.hero.description" class="about-hero__description">{{ data.about.hero.description }}</p>
    </div>
  </section>

  <section class="section-shell">
    <SectionHeading :title="data.about.introTitle" />
    <div class="about-intro">
      <div class="about-intro__main">
        <div class="about-intro__text">
          <p v-for="paragraph in data.about.introText" :key="paragraph">{{ paragraph }}</p>
        </div>
        <div v-if="data.about.introImage" class="about-intro__media">
          <img :alt="data.about.introImageAlt || data.about.introTitle" :src="data.about.introImage" />
        </div>
      </div>
      <div class="highlight-grid highlight-grid--intro">
        <article v-for="item in data.about.introHighlights" :key="item.id" class="info-chip">
          <strong>{{ item.value }}</strong>
          <span>{{ item.title }}</span>
          <p>{{ item.caption }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section-shell">
    <SectionHeading :description="data.about.timelineSubtitle" :title="data.about.timelineTitle" />
    <div class="timeline">
      <article v-for="item in data.about.timeline" :key="item.id" class="timeline__item">
        <div class="timeline__card">
          <span>{{ item.date }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="timeline__node">
          <img :alt="item.title" :src="item.image" />
        </div>
      </article>
    </div>
  </section>

  <section class="section-shell">
    <SectionHeading :description="data.about.goalsStatement" :title="data.about.goalsTitle" />
    <div class="goals-layout">
      <div class="goals-layout__text">
        <p v-for="paragraph in data.about.goalsText" :key="paragraph">{{ paragraph }}</p>
      </div>
      <div class="highlight-grid highlight-grid--goals">
        <article v-for="item in data.about.goalsCards" :key="item.id" class="info-chip">
          <strong>{{ item.value }}</strong>
          <span>{{ item.title }}</span>
          <p>{{ item.caption }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeading from "@/components/site/SectionHeading.vue";
import { useSiteContext } from "@/composables/useSiteContext";

const { data } = useSiteContext();
</script>
