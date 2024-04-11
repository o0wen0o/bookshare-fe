<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">View {{ capitalizeRouteName(route.name) }}</h1>
      <div class="page_actions">
        <router-link :to="{ path: `/${getRouteNameForApi(route.name)}` }">
          <v-btn color="warning" prepend-icon="mdi-menu">Return to list</v-btn>
        </router-link>
      </div>
    </div>

    <v-card class="page_body" elevation="3">
      <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
        <v-tab :value="1">General</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item :key="1" :value="1">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="4">
                <v-img :src="ossEndpoint + fundraisingProject.imgUrl"></v-img>
              </v-col>

              <v-col cols="12" sm="8">
                <div class="details">
                  <v-card-text>
                    <div class="form_group">
                      <strong>ID:</strong>
                      {{ fundraisingProject.id }}
                    </div>

                    <div class="form_group">
                      <strong>Project Name:</strong>
                      {{ fundraisingProject.projectName }}
                    </div>

                    <div class="form_group">
                      <strong>Start Date:</strong>
                      {{ formatDate(fundraisingProject.startDate) }}
                    </div>

                    <div class="form_group">
                      <strong>End Date:</strong>
                      {{ formatDate(fundraisingProject.endDate) }}
                    </div>

                    <div class="form_group">
                      <strong>Goal Amount:</strong>
                      {{ fundraisingProject.goalAmount }}
                    </div>

                    <div class="form_group">
                      <strong>Amount Raised:</strong>
                      {{ fundraisingProject.amountRaised }}
                    </div>

                    <div class="form_group">
                      <strong>Donation Count:</strong>
                      {{ fundraisingProject.donationCount }}
                    </div>

                    <div class="form_group">
                      <strong>Status:</strong>
                      {{ fundraisingProject.status }}
                    </div>

                    <div class="form_group">
                      <strong>Fundraising Organizer ID:</strong>
                      {{ fundraisingProject.fundraisingOrganizerId }}
                    </div>

                    <div class="form_group">
                      <strong>Updated Date:</strong>
                      {{ formatDatetime(fundraisingProject.updatedDate) }}
                    </div>

                    <div class="form_group">
                      <strong>Created Date:</strong>
                      {{ formatDatetime(fundraisingProject.createdDate) }}
                    </div>

                    <div class="form_group">
                      <strong>Description:</strong>
                      <div
                        v-html="
                          DOMPurify.sanitize(fundraisingProject.description)
                        "
                      ></div>
                    </div>
                  </v-card-text>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";
import {
  capitalizeRouteName,
  getRouteNameForApi,
  formatDate,
  formatDatetime,
} from "@/assets/js/admin/common_read.js";
import DOMPurify from "dompurify"; // Sanitize HTML prevent XSS attacks

const route = useRoute();
const id = ref(null);
const tab = ref(1);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const fundraisingProject = ref({
  id: "",
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  goalAmount: 0,
  amountRaised: 0,
  donationCount: 0,
  status: "",
  fundraisingOrganizerId: "",
  updatedDate: "",
  createdDate: "",
  imgUrl: "",
});

onMounted(() => {
  id.value = route.params.id;

  // Fetch fundraising project data based on id
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      fundraisingProject.value = data; // Ensure your API returns an object structured like fundraisingProject
    },
    (error) => {
      ElMessage.error(error);
    }
  );
});
</script>

<style scoped>
@import "@/assets/css/admin/common_read.css";

.v-img {
  height: 300px;
  margin-top: 50px;
}

.v-card-subtitle {
  color: black !important;
}

.v-card-subtitle,
.v-card-text {
  font-size: 16px;
}

.form_group {
  margin-bottom: 16px;
}

.form_group > strong {
  margin-bottom: 4px;
}
</style>
