<template>
  <PageHero :hero="data.contact.hero" />

  <section class="section-shell contact-access">
    <div class="contact-access__content">
      <div class="contact-access__details">
        <section v-for="method in data.contact.methods" :key="method.id" class="contact-detail">
          <p class="contact-detail__label">{{ method.label }}</p>
          <div class="contact-detail__value">
            <template v-for="line in splitLines(method.value)" :key="line">
              <p v-if="isEmail(method.label)">
                <AppLink :to="`mailto:${line}`">{{ line }}</AppLink>
              </p>
              <p v-else-if="isPhone(method.label)">
                <AppLink :to="`tel:${line.replace(/\\s+/g, '')}`">{{ line }}</AppLink>
              </p>
              <p v-else>{{ line }}</p>
            </template>
          </div>
          <p v-if="method.note" class="contact-detail__note">{{ method.note }}</p>
        </section>
      </div>

      <section class="contact-visit-guide">
        <h2>{{ data.contact.transitTitle }}</h2>
        <p v-for="paragraph in regularTransit" :key="paragraph">{{ paragraph }}</p>
        <p v-if="emphasisTransit" class="contact-visit-guide__emphasis">{{ emphasisTransit }}</p>
      </section>
    </div>

    <aside class="contact-access__map-panel">
      <div class="contact-map contact-map--feature">
        <img :alt="data.contact.mapAlt" :src="data.contact.mapImage" />
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppLink from "@/components/site/AppLink.vue";
import PageHero from "@/components/site/PageHero.vue";
import { useSiteContext } from "@/composables/useSiteContext";

const { data } = useSiteContext();

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const isEmail = (label: string) => /邮箱|email/i.test(label);
const isPhone = (label: string) => /电话|phone/i.test(label);

const regularTransit = computed(() =>
  data.value.contact.transitText.length > 1 ? data.value.contact.transitText.slice(0, -1) : data.value.contact.transitText,
);
const emphasisTransit = computed(() =>
  data.value.contact.transitText.length > 1 ? data.value.contact.transitText[data.value.contact.transitText.length - 1] : "",
);
</script>
