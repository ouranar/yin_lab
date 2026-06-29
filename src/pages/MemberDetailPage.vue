<template>
  <section v-if="member" class="section-shell section-shell--detail">
    <AppLink class-name="member-profile__back" :to="withLocalePath(locale, '/members')">
      {{ ui.members.backToMembers }}
    </AppLink>

    <article class="member-profile">
      <div class="member-profile__hero">
        <div class="member-profile__portrait">
          <img :alt="member.name" :src="member.image" />
        </div>

        <div class="member-profile__intro">
          <p v-if="nameParts.secondaryName" class="member-profile__secondary-name">{{ nameParts.secondaryName }}</p>
          <h1>{{ nameParts.primaryName || member.name }}</h1>
          <p class="member-profile__title">{{ member.title || ui.members.defaultTitle }}</p>

          <div v-if="member.email || member.phone || member.profileLink" class="member-profile__actions">
            <AppLink
              v-if="member.email"
              class-name="button-link button-link--secondary"
              :to="`mailto:${member.email}`"
            >
              {{ ui.members.sendEmail }}
            </AppLink>
            <AppLink
              v-if="member.phone"
              class-name="button-link button-link--secondary"
              :to="`tel:${member.phone.replace(/\\s+/g, '')}`"
            >
              {{ ui.members.call }}
            </AppLink>
            <AppLink
              v-if="member.profileLink"
              class-name="button-link button-link--secondary"
              target="_blank"
              :to="member.profileLink"
            >
              {{ ui.members.personalWebsite }}
            </AppLink>
          </div>
        </div>
      </div>

      <section class="member-profile__section">
        <div class="member-profile__section-head">
          <h2>Profile</h2>
        </div>

        <dl v-if="hasProfileContent" class="member-profile__rows">
          <div v-if="member.hometown" class="member-profile__row">
            <dt>{{ ui.members.hometown }}</dt>
            <dd>{{ member.hometown }}</dd>
          </div>

          <div v-if="member.birthDate" class="member-profile__row">
            <dt>{{ ui.members.birthDate }}</dt>
            <dd>{{ member.birthDate }}</dd>
          </div>

          <div v-if="member.researchAreas.length" class="member-profile__row">
            <dt>{{ ui.members.researchAreas }}</dt>
            <dd>{{ member.researchAreas.join(' / ') }}</dd>
          </div>

          <div v-if="member.email" class="member-profile__row">
            <dt>{{ ui.members.email }}</dt>
            <dd>
              <AppLink :to="`mailto:${member.email}`">{{ member.email }}</AppLink>
            </dd>
          </div>

          <div v-if="member.phone" class="member-profile__row">
            <dt>{{ ui.members.phone }}</dt>
            <dd>
              <AppLink :to="`tel:${member.phone.replace(/\\s+/g, '')}`">{{ member.phone }}</AppLink>
            </dd>
          </div>

          <div v-if="member.profileLink" class="member-profile__row">
            <dt>{{ ui.members.profileLink }}</dt>
            <dd>
              <AppLink target="_blank" :to="member.profileLink">{{ member.profileLink }}</AppLink>
            </dd>
          </div>

          <div v-if="summaryParagraphs.length" class="member-profile__row member-profile__row--summary">
            <dt>{{ ui.members.summary }}</dt>
            <dd>
              <p v-for="paragraph in summaryParagraphs" :key="paragraph">{{ paragraph }}</p>
            </dd>
          </div>
        </dl>
        <p v-else class="member-profile__empty">{{ ui.members.emptyProfile }}</p>
      </section>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppLink from "@/components/site/AppLink.vue";
import { useSiteContext } from "@/composables/useSiteContext";
import { getLocalizedMemberNameParts, withLocalePath } from "@/lib/i18n";
import { findMemberBySlug } from "@/lib/site-data";

const route = useRoute();
const { data, locale, ui } = useSiteContext();

const member = computed(() => {
  const slug = typeof route.params.slug === "string" ? decodeURIComponent(route.params.slug) : "";
  return findMemberBySlug(data.value, slug);
});

const nameParts = computed(() =>
  member.value ? getLocalizedMemberNameParts(member.value, locale.value) : { primaryName: "", secondaryName: "" },
);

const summaryParagraphs = computed(() =>
  member.value
    ? member.value.summary
        .split(/\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [],
);

const hasProfileContent = computed(() =>
  Boolean(
    member.value &&
      (member.value.birthDate ||
        member.value.hometown ||
        member.value.researchAreas.length ||
        member.value.email ||
        member.value.phone ||
        member.value.profileLink ||
        summaryParagraphs.value.length),
  ),
);
</script>
