<template>
  <div class="record-directory">
    <aside class="record-directory__sidebar">
      <div class="record-directory__sidebar-card">
        <p class="record-directory__eyebrow">{{ ui.publications.sectionNavigation }}</p>
        <nav class="record-directory__nav" :aria-label="ui.publications.navAriaLabel">
          <a
            v-for="group in visibleGroups"
            :key="group.id"
            class="record-directory__nav-link"
            :href="`#${group.id}`"
          >
            <span class="record-directory__nav-main">
              <span class="record-directory__nav-icon">{{ group.icon }}</span>
              <span class="record-directory__nav-text">
                <strong>{{ group.title }}</strong>
                <small v-if="group.summary">{{ group.summary }}</small>
              </span>
            </span>
            <span class="record-directory__nav-count">{{ group.items.length }}</span>
          </a>
        </nav>
      </div>
    </aside>

    <div class="record-directory__content">
      <section v-for="group in visibleGroups" :id="group.id" :key="group.id" class="record-section">
        <div class="record-section__header">
          <div class="record-section__title">
            <span class="record-section__icon">{{ group.icon }}</span>
            <div>
              <p class="record-section__eyebrow">{{ ui.publications.recordsCount(group.items.length) }}</p>
              <h2>{{ group.title }}</h2>
              <p v-if="group.summary">{{ group.summary }}</p>
            </div>
          </div>
        </div>

        <div class="record-section__list">
          <article v-for="item in group.items" :key="item.id" class="record-entry">
            <p class="record-entry__meta">{{ item.meta || "-" }}</p>
            <div class="record-entry__body">
              <h3>{{ item.title }}</h3>
              <p v-if="item.subtitle" class="record-entry__subtitle">{{ item.subtitle }}</p>
              <p v-if="item.summary" class="record-entry__summary">{{ item.summary }}</p>
              <AppLink
                v-if="item.link"
                class-name="record-entry__link"
                :target="getExternalTarget(item.link)"
                :to="item.link"
              >
                {{ ui.publications.viewSource }}
              </AppLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import { defaultSiteLocale, getSiteUiText, type SiteLocale } from "@/lib/i18n";
import type { RecordGroup } from "@/types/site";

const props = withDefaults(
  defineProps<{
    groups: RecordGroup[];
    locale?: SiteLocale;
  }>(),
  {
    locale: defaultSiteLocale,
  },
);

const visibleGroups = computed(() =>
  props.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.visible !== false),
    }))
    .filter((group) => group.items.length > 0),
);

const ui = computed(() => getSiteUiText(props.locale));

const getExternalTarget = (href: string) => (/^(https?:)?\/\//.test(href) ? "_blank" : undefined);
</script>
