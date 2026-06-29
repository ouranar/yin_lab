<template>
  <section class="section-shell section-shell--detail">
    <div class="detail-header">
      <span>404</span>
      <h1>Page not found</h1>
      <p>The page you requested could not be found in this Vue version of the site.</p>
      <div class="page-hero__actions">
        <AppLink class-name="button-link button-link--primary" to="/zh">返回首页</AppLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppLink from "@/components/site/AppLink.vue";
</script>
