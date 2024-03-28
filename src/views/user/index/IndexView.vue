<template>
  <div>
    <v-row>
      <!-- Main Column -->
      <v-col cols="8" class="main-column">
        <router-view v-slot="{ Component }">
          <transition name="el-fade-in-linear" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-col>

      <!-- Side Column -->
      <v-col cols="4" class="side-column">
        <content-side-column />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ContentSideColumn from "@/views/user/home/ContentSideColumn.vue";
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