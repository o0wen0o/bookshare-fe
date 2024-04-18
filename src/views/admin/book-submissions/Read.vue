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
                <v-img :src="ossEndpoint + book.imgUrl"></v-img>
              </v-col>

              <v-col cols="12" sm="8">
                <div>
                  <v-card-title>{{ book.title }}</v-card-title>
                  <v-card-subtitle>{{ book.author }}</v-card-subtitle>
                </div>

                <div class="details">
                  <v-card-text>
                    <div class="form_group">
                      <strong>Publisher:</strong>
                      {{ book.publisher }}
                    </div>

                    <div class="form_group">
                      <strong>ISBN:</strong>
                      {{ book.isbn }}
                    </div>

                    <div class="form_group">
                      <strong>Publication Date:</strong>
                      {{ book.publicationDate }}
                    </div>

                    <div class="form_group">
                      <strong>Pages:</strong>
                      {{ book.page }}
                    </div>

                    <div class="form_group">
                      <strong>Language:</strong>
                      {{ book.language }}
                    </div>

                    <div class="form_group">
                      <strong>Description:</strong>
                      {{ book.description }}
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
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const book = ref({
  title: "",
  author: "",
  description: "",
  publisher: "",
  isbn: "",
  publicationDate: "",
  page: 0,
  language: "",
  imgUrl: "",
  createdDate: "",
  status: "",
  userId: "",
});

onMounted(() => {
  id.value = route.params.id;

  // Fetch book data based on id
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      book.value = data;
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