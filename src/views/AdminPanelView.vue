<template>
  <div>
    <el-container class="admin_container">
      <el-aside width="auto">
        <navigation-menu />
      </el-aside>

      <el-container style="flex-direction: column;">
        <div>
          <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb> -->
          <admin-header />
        </div>

        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear" mode="out-in">
              <component :is="Component" style="height: 100%" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import NavigationMenu from "@/views/admin/components/NavigationMenu.vue";
import AdminHeader from "@/views/admin/components/AdminHeader.vue";
</script>

<style scoped>
.admin_container {
  height: 100vh;
  background-color: #f9f9f9;
}
</style>
