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
                      {{ post.id }}
                    </div>

                    <div class="form_group">
                      <strong>Content:</strong>
                      {{ post.content }}
                    </div>

                    <div class="form_group">
                      <strong>Created Date:</strong>
                      {{ post.createdDate }}
                    </div>

                    <div class="form_group">
                      <strong>Number of Likes:</strong>
                      {{ post.likes }}
                    </div>

                    <div class="form_group">
                      <strong>Number of Shares:</strong>
                      {{ post.shares }}
                    </div>

                    <div class="form_group">
                      <strong>User ID:</strong>
                      {{ post.userId }}
                    </div>

                    <div class="form_group">
                      <strong>Book ID:</strong>
                      {{ post.bookId }}
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
} from "@/assets/js/admin/common_read.js";

const route = useRoute();
const id = ref(null);
const tab = ref(null);

const post = ref({
  id: "",
  content: "",
  createdDate: "",
  likes: "",
  shares: "",
  userId: "",
  postId: 0,
});

onMounted(() => {
  id.value = route.params.id;

  // Fetch post data based on id
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      post.value = data;
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