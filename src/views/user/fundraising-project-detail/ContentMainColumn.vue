<template>
  <v-card elevation="2">
    <v-img
      :src="ossEndpoint + fundraisingProject.imgUrl"
      class="fundraisingProject-img"
    ></v-img>

    <v-container>
      <!-- Fundraising Project Info -->
      <div>
        <v-card-title>{{ fundraisingProject.projectName }}</v-card-title>
        <v-card-text>
          <p><strong>Start Date:</strong> {{ fundraisingProject.startDate }}</p>
          <p><strong>End Date:</strong> {{ fundraisingProject.endDate }}</p>
          <p>
            <strong>Goal Amount:</strong> {{ fundraisingProject.goalAmount }}
          </p>
          <p>
            <strong>Amount Raised:</strong>
            {{ fundraisingProject.amountRaised }}
          </p>
          <p>
            <strong>Donation Count:</strong>
            {{ fundraisingProject.donationCount }}
          </p>
          <p>
            <strong>Fundraising Organizer:</strong>
            {{ fundraisingProject.username }}
          </p>
        </v-card-text>
      </div>

      <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
        <v-tab :value="1">Project Detail</v-tab>
        <v-tab :value="2">Project Progress</v-tab>

        <!-- Donate Button -->
        <v-card-actions>
          <v-btn
            :prepend-icon="isHovering ? 'mdi-heart' : 'mdi-heart-outline'"
            class="donate-button"
            @mouseover="isHovering = true"
            @mouseleave="isHovering = false"
            @click="donate()"
          >
            Donate
          </v-btn>
        </v-card-actions>
      </v-tabs>

      <v-divider class="mb-3"></v-divider>

      <!-- Project Detail -->
      <v-window v-model="tab">
        <v-window-item :key="1" :value="1">
          <v-container>
            <div
              v-html="DOMPurify.sanitize(fundraisingProject.description)"
            ></div>
          </v-container>
        </v-window-item>

        <!-- Project Progress -->
        <v-window-item :key="2" :value="2">
          <v-container>
            <fundraising-project-progress
              :fundraisingProjectId="fundraisingProjectId"
            />
          </v-container>
        </v-window-item>
      </v-window>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { get, post } from "@/net/index.js";
import { ElMessage } from "element-plus";
import DOMPurify from "dompurify"; // Sanitize HTML prevent XSS attacks
import FundraisingProjectProgress from "./FundraisingProjectProgress.vue";

const route = useRoute();
const fundraisingProjectId = ref(null);
const isHovering = ref(false); // Control the donate button
const tab = ref(null);

const store = useStore();
const userData = computed(() => store.state.user || {});
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const fundraisingProject = ref({
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  goalAmount: 0,
  amountRaised: 0,
  donationCount: 0,
  username: "", // fundraising project organizer
  updatedDate: "",
  createdDate: "",
  imgUrl: "",
});

const fetchItems = () => {
  get(
    `/api/fundraising-project-detail/getFundraisingProjectDetail/${fundraisingProjectId.value}`,
    (data) => {
      fundraisingProject.value = data;
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

const donate = () => {
  console.log("donate");
  // post(
  //   `/api/fundraising-project-detail/donate/${fundraisingProjectId.value}`,
  //   {},
  //   (data) => {
  //     ElMessage.success(data);
  //   },
  //   (error) => {
  //     ElMessage.error(error);
  //   }
  // );
};

onMounted(() => {
  fundraisingProjectId.value = route.params.id;
  store.dispatch("setProjectId", fundraisingProjectId); // Store fundraisingProjectId in Vuex store
  fetchItems();
});
</script>

<style>
.fundraisingProject-img {
  height: 250px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0.4)
  );
}

.v-card-text > *,
.v-card-text div > * {
  margin-bottom: 0.5rem;
}

.donate-button.v-btn:hover {
  color: red;
}
</style>
