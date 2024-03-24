<template>
  <div>
    <v-card class="page_body" elevation="3">
      <v-row align="center" justify="center" style="padding: 15px 30px">
        <v-col cols="1" style="padding: 0">
          <!-- Logo Section -->
          <v-img
            :src="logo"
            alt="Logo"
            height="50"
            @click="navigateTo('home')"
          ></v-img>
        </v-col>

        <!-- Navigation Tabs -->
        <v-col cols="5" style="padding: 0">
          <v-tabs
            v-model="currentTab"
            align-tabs="start"
            color="deep-purple-accent-4"
          >
            <v-tab :value="1" @click="navigateTo('home')">Home</v-tab>
            <v-tab :value="2" @click="navigateTo('community')">Community</v-tab>
            <v-tab :value="3" @click="navigateTo('fundraising-project')">
              Fundraising Project
            </v-tab>
          </v-tabs>
        </v-col>

        <!-- Search Bar -->
        <v-col cols="3">
          <v-text-field
            class="search_field"
            v-model="search"
            density="compact"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            hide-details
            @keyup.enter="performSearch"
          ></v-text-field>
        </v-col>

        <!-- User Menu -->
        <v-col cols="1" style="padding: 0">
          <v-menu min-width="400px" rounded>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar size="48px">
                  <v-img alt="Avatar" :src="avatar"></v-img>
                </v-avatar>
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar size="40px">
                    <v-img alt="Avatar" :src="avatar"></v-img>
                  </v-avatar>

                  <h3>{{ userData.username || "John" }}</h3>

                  <p class="text-caption mt-1">
                    {{ userData.email || "john@hotmail.com" }}
                  </p>

                  <v-divider class="my-3"></v-divider>
                  <v-btn variant="text" rounded @click="profileInfo">
                    Profile Info
                  </v-btn>

                  <v-divider class="my-3"></v-divider>
                  <v-btn
                    variant="text"
                    rounded
                    color="red"
                    @click="logoutAccount"
                  >
                    Logout Account
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { logout } from "@/net";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();
const userData = computed(() => store.state.user || {});

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;
const avatar = ossEndpoint + userData.value.avatar;
const logo = ossEndpoint + "BookShare_logo.png";
const search = ref("");

function profileInfo() {
  router.push('/profile-detail');
}

function performSearch() {
  router.push(`/search/${search.value}`);
}

function logoutAccount() {
  logout(() => {
    router.push("/login");
  });
}

// Computes the currentTab value based on the current route.
// This function finds the tab number (1, 2, 3) that corresponds to the current route name.
const currentTab = ref(null);
const tabsToRoutes = {
  1: "home",
  2: "community",
  3: "fundraising-project",
};

const updateTab = () => {
  const tab = Object.keys(tabsToRoutes).find(
    (key) => tabsToRoutes[key] === route.name
  );
  currentTab.value = tab ? parseInt(tab, 10) : 1; // Defaults to the first tab if no match is found.
};

// Call updateTab initially and whenever the route changes.
updateTab();
watch(() => route.name, updateTab);

function navigateTo(route) {
  router.push({ name: route });
}
</script>

<style scoped>
.admin_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
</style>