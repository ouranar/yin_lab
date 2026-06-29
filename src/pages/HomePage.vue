<template>
  <section class="home-hero">
    <div class="home-hero__content home-hero__content--full">
      <div class="home-hero__main">
        <p class="home-hero__eyebrow">{{ data.home.hero.eyebrow }}</p>
        <h1>{{ data.home.hero.title }}</h1>
        <p class="home-hero__subtitle">{{ data.home.hero.subtitle }}</p>
        <p class="home-hero__description">{{ data.home.hero.description }}</p>
      </div>
      <div class="home-hero__actions">
        <AppLink
          v-if="data.home.hero.primaryAction"
          class-name="button-link button-link--primary"
          :to="data.home.hero.primaryAction.href"
        >
          {{ data.home.hero.primaryAction.label }}
        </AppLink>
        <AppLink
          v-if="data.home.hero.secondaryAction"
          class-name="button-link button-link--secondary"
          :to="data.home.hero.secondaryAction.href"
        >
          {{ data.home.hero.secondaryAction.label }}
        </AppLink>
      </div>
    </div>

    <MarqueeStrip :items="data.home.activities" :locale="locale" />

    <div aria-hidden="true" class="scroll-cue">
      <span class="scroll-cue__mouse" />
      <span class="scroll-cue__line" />
    </div>
  </section>

  <section class="section-shell">
    <SectionHeading :description="data.home.intro.description" :title="data.home.intro.title" />
    <div class="home-overview">
      <article class="highlight-panel">
        <div class="highlight-panel__text">
          <p v-for="paragraph in overviewParagraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
        <AppLink class-name="button-link button-link--ghost" :to="data.home.intro.href">
          {{ data.home.intro.buttonLabel }}
        </AppLink>
      </article>
      <div class="highlight-grid">
        <article v-for="item in data.about.introHighlights" :key="item.id" class="info-chip">
          <strong>{{ item.value }}</strong>
          <span>{{ item.title }}</span>
          <p>{{ item.caption }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section-shell">
    <div class="section-heading section-heading--split">
      <div>
        <p class="section-heading__eyebrow">{{ ui.home.researchEyebrow }}</p>
        <h2>{{ data.research.directionsTitle }}</h2>
      </div>
      <AppLink class-name="button-link button-link--secondary" :to="withLocalePath(locale, '/research')">
        {{ ui.home.viewResearchDirections }}
      </AppLink>
    </div>
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
            {{ ui.home.relatedLink }}
          </AppLink>
        </div>
      </article>
    </div>
  </section>

  <section class="section-shell">
    <div class="section-heading section-heading--split">
      <div>
        <p class="section-heading__eyebrow">{{ ui.home.membersEyebrow }}</p>
        <h2>{{ data.home.membersLead.title }}</h2>
        <p>{{ data.home.membersLead.description }}</p>
      </div>
      <AppLink class-name="button-link button-link--secondary" :to="data.home.membersLead.href">
        {{ data.home.membersLead.buttonLabel }}
      </AppLink>
    </div>
    <article v-if="leader" class="leader-card">
      <div class="leader-card__media">
        <img :alt="leader.name" :src="leader.image" />
      </div>
      <div class="leader-card__content">
        <p class="leader-card__eyebrow">{{ ui.home.leaderEyebrow }}</p>
        <h3>{{ leader.name }}</h3>
        <strong>{{ leader.title }}</strong>
        <p>{{ leader.summary }}</p>
        <ul v-if="leader.researchAreas.length" class="tag-list">
          <li v-for="tag in leader.researchAreas.slice(0, 3)" :key="tag">{{ tag }}</li>
        </ul>
        <div class="leader-card__actions">
          <AppLink
            class-name="button-link button-link--primary"
            :to="withLocalePath(locale, `/members/${getMemberRouteSlug(leader)}`)"
          >
            {{ ui.home.viewLeaderProfile }}
          </AppLink>
          <AppLink class-name="button-link button-link--secondary" :to="withLocalePath(locale, '/members')">
            {{ ui.home.viewAllMembers }}
          </AppLink>
        </div>
      </div>
    </article>
  </section>

  <section class="section-shell">
    <article class="recruitment-banner">
      <div>
        <p class="section-heading__eyebrow">{{ ui.home.recruitmentEyebrow }}</p>
        <h2>{{ data.home.recruitmentLead.title }}</h2>
        <p>{{ data.home.recruitmentLead.description }}</p>
      </div>
      <AppLink class-name="button-link button-link--primary" :to="data.home.recruitmentLead.href">
        {{ data.home.recruitmentLead.buttonLabel }}
      </AppLink>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import MarqueeStrip from "@/components/site/MarqueeStrip.vue";
import SectionHeading from "@/components/site/SectionHeading.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { withLocalePath } from "@/lib/i18n";
import { getFeaturedMember, getMemberRouteSlug } from "@/lib/site-data";

const { data, locale, ui } = useSiteContext();

const leader = computed(() => getFeaturedMember(data.value));
const directions = computed(() => data.value.research.directions.filter((item) => item.visible !== false));
const overviewParagraphs = computed(() =>
  data.value.home.intro.content?.length ? data.value.home.intro.content : data.value.about.introText.slice(0, 2),
);
</script>
