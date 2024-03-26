<template>
  <div>
    <!-- Page Header -->
    <div>
      <page-header />
    </div>

    <!-- Page Body -->
    <v-container class="user_container" fluid>
      <v-row justify="center">
        <v-col cols="8">
          <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import PageHeader from "@/views/user/component/PageHeader.vue";
</script>

<style scoped>
.user_container {
  background-color: #f9f9f9;
  min-height: 90vh;
}
</style>
