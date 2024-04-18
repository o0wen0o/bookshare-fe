<template>
  <div>
    <el-container class="admin_container">
      <el-aside width="auto">
        <navigation-menu :menuStatus="menuStatus" />
      </el-aside>

      <el-container style="flex-direction: column">
        <div>
          <admin-header :menuStatus="menuStatus" />
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
import { ref } from "vue";
import NavigationMenu from "@/views/admin/components/NavigationMenu.vue";
import AdminHeader from "@/views/admin/components/AdminHeader.vue";

const menuStatus = ref(true);
</script>

<style scoped>
.admin_container {
  min-height: 100vh;
  background-color: #f9f9f9;
}
</style>
