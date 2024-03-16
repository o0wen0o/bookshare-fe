<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">View User</h1>

      <div class="page_actions">
        <router-link :to="{ path: '/users' }">
          <v-btn color="warning" prepend-icon="mdi-menu">
            Return to list
          </v-btn>
        </router-link>
      </div>
    </div>

    <v-card class="page_body" elevation="3"> </v-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import "@/assets/css/admin/common_read.css";
</style>