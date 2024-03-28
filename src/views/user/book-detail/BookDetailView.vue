<template>
  <div>
    <v-row>
      <!-- Main Column -->
      <v-col cols="8" class="main-column">
        <content-main-column />
      </v-col>

      <!-- Side Column -->
      <v-col cols="4" class="side-column">
        <content-side-column />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ContentMainColumn from "./ContentMainColumn.vue";
import ContentSideColumn from "./ContentSideColumn.vue";
</script>

<style scoped>
.main-column {
  padding: 12px 6px;
  overflow-y: auto;
}

.side-column {
  padding: 12px 6px;
  position: sticky;
  top: 0;
}
</style>