<template>
  <div>
    <v-row>
      <!-- Side Column -->
      <v-col cols="3" class="side-column">
        <el-menu
          class="navigation_menu"
          background-color="rgb(180, 60, 0)"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            index="1"
            :class="{ 'is-active': currentTab === '1' }"
            @click="navigateTo('/profile-detail')"
          >
            <v-icon>mdi-account</v-icon>
            Profile
          </el-menu-item>

          <el-menu-item
            index="2"
            :class="{ 'is-active': currentTab === '2' }"
            @click="navigateTo('/bookshelf')"
          >
            <v-icon>mdi-bookshelf</v-icon>
            Bookshelf
          </el-menu-item>

          <el-menu-item
            index="3"
            :class="{ 'is-active': currentTab === '3' }"
            @click="navigateTo('/book-review')"
          >
            <v-icon>mdi-notebook-edit</v-icon>
            Book Review
          </el-menu-item>

          <el-menu-item
            index="4"
            :class="{ 'is-active': currentTab === '4' }"
            @click="navigateTo('/book-contribution')"
          >
            <v-icon>mdi-book-plus</v-icon>
            Book Contribution
          </el-menu-item>

          <el-menu-item
            index="5"
            :class="{ 'is-active': currentTab === '5' }"
            @click="navigateTo('/donation-history')"
          >
            <v-icon>mdi-hand-coin</v-icon>
            Donation History
          </el-menu-item>
        </el-menu>
      </v-col>

      <!-- Main Column -->
      <v-col cols="" class="main-column">
        <router-view v-slot="{ Component }">
          <transition name="el-fade-in-linear" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();
const userData = computed(() => store.state.user || {});

// Computes the currentTab value based on the current route.
// This function finds the tab number (1, 2, 3) that corresponds to the current route name.
const currentTab = ref(null);
const tabsToRoutes = {
  1: "/profile-detail",
  2: "/bookshelf",
  3: "/book-review",
  4: "/book-contribution",
  5: "/donation-history",
};

const updateTab = () => {
  const tab = Object.keys(tabsToRoutes).find(
    (key) => tabsToRoutes[key] === route.path
  );
  currentTab.value = tab ? tab : "1";
};

// Call updateTab initially and whenever the route changes.
updateTab();
watch(() => route.path, updateTab, { immediate: true });

function navigateTo(route) {
  router.push(route);
}
</script>

<style scoped>
.side-column {
  padding: 12px 0;
}

.main-column {
  overflow-y: auto;
}

.v-icon {
  margin-right: 8px;
}

.is-active {
  color: orange; /* Active text color or any other styling */
}
</style>