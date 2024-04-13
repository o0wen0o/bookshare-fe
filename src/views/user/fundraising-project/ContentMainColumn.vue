<template>
  <v-infinite-scroll side="end" @load="load" style="margin-top: -16px">
    <v-row no-gutters>
      <template
        v-for="fundraisingProject in fundraisingProjects"
        :key="fundraisingProject.id"
      >
        <v-col cols="6">
          <!-- Wrapped each fundraisingProject in router-link -->
          <router-link
            :to="{
              name: 'fundraising-project-detail',
              params: { id: fundraisingProject.id },
            }"
            class="router-link-exact-active router-link-active"
          >
            <v-card elevation="2" class="fundraisingProject-item">
              <!-- FundraisingProject Image -->
              <div>
                <v-img
                  :src="ossEndpoint + fundraisingProject.imgUrl"
                  :alt="fundraisingProject.projectName"
                  aspect-ratio="1"
                  contain
                ></v-img>
              </div>

              <!-- FundraisingProject Info -->
              <div class="fundraisingProject-info">
                <h4>{{ fundraisingProject.projectName }}</h4>
                <p>Amount Raised: RM {{ fundraisingProject.amountRaised }}</p>
                <p>
                  Number of donations: {{ fundraisingProject.donationCount }}
                </p>
              </div>
            </v-card>
          </router-link>
        </v-col>
      </template>
    </v-row>

    <template v-slot:empty>
      <v-alert type="info" variant="tonal">
        No more fundraising projects available
      </v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";

const route = useRoute();
const search = ref(route.params.search || "");
const page = ref(1);
const itemsPerPage = ref(10);
const fundraisingProjects = ref([]);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

// Function to load more fundraisingProjects
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    filter: search.value,
  };

  get(
    `/api/fundraising-project/getFundraisingProjects`,
    (data) => {
      if (data.records.length) {
        fundraisingProjects.value = [
          ...fundraisingProjects.value,
          ...data.records,
        ];
      }
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    fetchItems();
    done("empty");
  }
};

// Watch for search query changes
watch(
  () => route.query.search,
  (newSearch) => {
    search.value = newSearch;
    page.value = 1;
    fundraisingProjects.value = [];
    fetchItems();
  }
);

onMounted(() => {
  // After the payment, it will redirect to this page
  if (
    route.query.redirect_status &&
    route.query.redirect_status === "succeeded"
  ) {
    ElMessage.success("Payment successful!");
  } else if (
    route.query.redirect_status &&
    route.query.redirect_status === "failed"
  ) {
    ElMessage.error("Payment failed!");
  }
});
</script>

<style scoped>
.fundraisingProject-item {
  margin: 0 10px 20px 10px;
  padding: 12px;
}

.fundraisingProject-item:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.router-link-exact-active,
.router-link-active {
  text-decoration: none;
  color: inherit;
}

.v-img {
  height: 150px;
  border-radius: 3px;
}

.fundraisingProject-info {
  margin: 10px 10px 0 10px;
}
</style>
