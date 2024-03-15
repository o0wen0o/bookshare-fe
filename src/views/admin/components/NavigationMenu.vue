<template>
  <el-row class="nav_row">
    <el-col>
      <div class="nav_header">
        <h1 class="nav_title" v-if="menuCollapsed ? !isCollapsed : true">Admin Panel</h1>
      </div>

      <el-menu
        default-active="1"
        class="navigation_menu"
        :collapse="menuCollapsed ? isCollapsed : menuCollapsed"
        @mouseenter="menuCollapsed ? isCollapsed = false : false"
        @mouseleave="menuCollapsed ? isCollapsed = true : false"
        background-color="rgb(180, 60, 0)"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>User</span>
          </template>

          <el-menu-item index="1-1" @click="navigateTo('/users')">
            Users
          </el-menu-item>

          <el-menu-item index="1-2" @click="navigateTo('/roles')">
            Roles
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>Book</span>
          </template>

          <el-menu-item index="2-1" @click="navigateTo('/books')">
            Books
          </el-menu-item>
          <el-menu-item index="2-2" @click="navigateTo('/book-comments')">
            Book Comments
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Menu as IconMenu, Location } from "@element-plus/icons-vue";

const router = useRouter();
const store = useStore();
const menuCollapsed = computed(() => store.state.menuCollapsed); // control by header
const isCollapsed = ref(true); // use for current file

function navigateTo(route) {
  router.push(route);
}
</script>

<style scoped>
.nav_row {
  height: 100%;
  background-color: rgb(180, 60, 0);
}

.nav_header {
  height: 58.4px;
  border: 1px solid #e6e6e6;
  background-image: url("https://bookshare-fyp.oss-ap-southeast-3.aliyuncs.com/mapple_leaf_background.jpg");
  background-size: cover;
}

.nav_title {
  text-align: center;
  line-height: 58.4px;
}

.navigation_menu {
  border: 0;
}

.navigation_menu:not(.el-menu--collapse) {
  width: 250px;
}
</style>
