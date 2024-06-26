<template>
  <el-row class="nav_row">
    <el-col>
      <div class="nav_header">
        <h1 class="nav_title" v-if="menuCollapsed ? !isCollapsed : true">
          Admin Panel
        </h1>
      </div>

      <el-menu
        :default-active="currentTab"
        class="navigation_menu"
        :collapse="menuCollapsed ? isCollapsed : menuCollapsed"
        @mouseenter="menuCollapsed ? (isCollapsed = false) : false"
        @mouseleave="menuCollapsed ? (isCollapsed = true) : false"
        background-color="rgb(180, 60, 0)"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <!-- User -->
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <user-filled />
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

        <!-- Book -->
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <management />
            </el-icon>
            <span>Book</span>
          </template>

          <el-menu-item index="2-1" @click="navigateTo('/books')">
            Books
          </el-menu-item>
          <el-menu-item index="2-2" @click="navigateTo('/genres')">
            Genres
          </el-menu-item>
          <el-menu-item index="2-3" @click="navigateTo('/book-submissions')">
            Book Submissions
          </el-menu-item>
        </el-sub-menu>

        <!-- Post -->
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <comment />
            </el-icon>
            <span>Post</span>
          </template>

          <el-menu-item index="3-1" @click="navigateTo('/posts')">
            Posts
          </el-menu-item>
        </el-sub-menu>

        <!-- Fundraising -->
        <el-sub-menu index="4">
          <template #title>
            <el-icon>
              <list />
            </el-icon>
            <span>Fundraising</span>
          </template>

          <el-menu-item
            index="4-1"
            @click="navigateTo('/fundraising-organizers')"
          >
            Fundraising Organizers
          </el-menu-item>
          <el-menu-item
            index="4-2"
            @click="navigateTo('/fundraising-projects')"
          >
            Fundraising Projects
          </el-menu-item>
          <el-menu-item
            index="4-3"
            @click="navigateTo('/fundraising-project-progress')"
          >
            Fundraising Project Progress
          </el-menu-item>
          <el-menu-item index="4-4" @click="navigateTo('/donations')">
            Donations
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserFilled, Management, Comment, List } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const menuCollapsed = computed(() => store.state.menuCollapsed); // control by header
const isCollapsed = ref(true); // use for current file

function navigateTo(route) {
  router.push(route);
}

// Computes the currentTab value based on the current route.
// This function finds the tab number (1, 2, 3) that corresponds to the current route name.
const currentTab = ref("1-1");
const tabsToRoutes = {
  "1-1": "users",
  "1-2": "roles",
  "2-1": "books",
  "2-2": "genres",
  "2-3": "book-submissions",
  "3-1": "posts",
  "4-1": "fundraising-organizers",
  "4-2": "fundraising-projects",
  "4-3": "fundraising-project-progress",
  "4-4": "donations",
};

const updateTab = () => {
  const tab = Object.keys(tabsToRoutes).find(
    (key) => tabsToRoutes[key] === route.name
  );
  currentTab.value = tab ? tab : ""; // Defaults to the first tab if no match is found.
};

// Call updateTab initially and whenever the route changes.
updateTab();
watch(() => route.name, updateTab);
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
