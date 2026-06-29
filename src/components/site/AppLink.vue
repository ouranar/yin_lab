<template>
  <a
    v-if="isExternal"
    :class="className"
    :href="to"
    :rel="target === '_blank' ? 'noreferrer' : undefined"
    :target="target"
  >
    <slot />
  </a>
  <RouterLink v-else :class="className" :to="to">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  to: string;
  className?: string;
  target?: string;
}>();

const isExternal = computed(() =>
  /^(https?:)?\/\//.test(props.to) ||
  props.to.startsWith("mailto:") ||
  props.to.startsWith("tel:") ||
  props.to.startsWith("#"),
);
</script>
