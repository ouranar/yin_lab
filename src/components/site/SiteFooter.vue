<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>{{ labName }}</p>
      <span>{{ footerNote }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  labName: string;
  footerNote: string;
}>();
</script>
