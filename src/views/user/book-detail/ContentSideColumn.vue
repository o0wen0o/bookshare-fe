<template>
  <div>
    <!-- Recommended Book -->
    <recommended-book />

    <!-- Actions List -->
    <actions-list />

    <!-- Footer -->
    <page-footer />
  </div>
</template>

<script setup>
import ActionsList from "../component/ActionsList.vue";
import PageFooter from "../component/PageFooter.vue";
import RecommendedBook from "./RecommendedBook.vue";
</script>
