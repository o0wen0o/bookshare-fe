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
.page_header {
  padding: 20px 0 40px 20px;
  display: flex;
  align-items: center;
}

.page_title {
  margin: 0 20px 0 50px;
}

.page_actions button {
  margin-right: 5px;
}

.page_body {
  padding: 20px;
  height: 500px;
  width: 100%;
}
</style>