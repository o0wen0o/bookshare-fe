<template>
  <div>
    <el-container style="height: 100vh">
      <el-aside width="auto">
        <navigation-menu />
      </el-aside>

      <el-container style="flex-direction: column;">
        <div>
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

<style scoped></style>
