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
              <v-col cols="12">
                <div class="details">
                  <v-card-text>
                    <div class="form_group">
                      <strong>ID:</strong>
                      {{ fundraisingOrganizer.id }}
                    </div>
                    <div class="form_group">
                      <strong>Username:</strong>
                      {{ fundraisingOrganizer.username }}
                    </div>
                    <div class="form_group">
                      <strong>Email:</strong>
                      {{ fundraisingOrganizer.email }}
                    </div>
                    <div class="form_group">
                      <strong>Phone Number:</strong>
                      {{ fundraisingOrganizer.phoneNumber }}
                    </div>
                    <div class="form_group">
                      <strong>Created Date:</strong>
                      {{ formatDatetime(fundraisingOrganizer.createdDate) }}
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
  formatDatetime,
} from "@/assets/js/admin/common_read.js";

const route = useRoute();
const id = ref(null);
const tab = ref(null);

const fundraisingOrganizer = ref({
  id: "",
  username: "",
  email: "",
  phoneNumber: "",
  createdDate: "",
});

onMounted(() => {
  id.value = route.params.id;

  // Fetch fundraising organizer data based on id
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      fundraisingOrganizer.value = data;
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
  /* display: block; */
  margin-bottom: 4px;
}
</style>