<template>
  <v-card elevation="2" class="pa-3">
    <v-infinite-scroll side="end" @load="load">
      <template v-for="book in books" :key="book.id">
        <!-- Wrapped each book in router-link -->
        <router-link
          :to="{ name: 'book-detail', params: { id: book.id } }"
          class="router-link-exact-active router-link-active"
        >
          <v-row align="center" class="book-item">
            <!-- Book Image -->
            <v-col cols="12" sm="3">
              <v-img
                :src="ossEndpoint + book.imgUrl"
                :alt="book.title"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-col>

            <!-- Book Info -->
            <v-col cols="12" sm="9">
              <h4>{{ book.title }}</h4>
              <p>Author: {{ book.author }}</p>
              <p>Publication Date: {{ book.publicationDate }}</p>

              <!-- Inline Rating, Favourites, Reviews with Chips -->
              <div class="chips-container">
                <v-chip color="orange" size="small">
                  <v-icon icon="mdi-star" start></v-icon>
                  Rating: {{ book.rating }}
                </v-chip>

                <v-chip color="red" size="small">
                  <v-icon icon="mdi-heart" start></v-icon>
                  Favourites: {{ book.favourite }}
                </v-chip>

                <v-chip color="blue" size="small">
                  <v-icon icon="mdi-eye" start></v-icon>
                  Reviews: {{ book.review }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </router-link>
        <v-divider class="my-3"></v-divider>
      </template>

      <template v-slot:empty>
        <v-alert type="info" variant="tonal">
          No more books available
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";

const route = useRoute();
const search = ref(route.params.search || "");
const page = ref(1);
const itemsPerPage = ref(10);
const books = ref([]);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

// Function to load more books
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    filter: search.value,
  };

  get(
    `/api/home/getBooks`,
    (data) => {
      if (data.records.length) {
        books.value = [...books.value, ...data.records];
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
watch(() => route.query.search, (newSearch) => {
  search.value = newSearch;
  page.value = 1;
  books.value = [];
  fetchItems();
});
</script>

<style scoped>
.book-item {
  margin: -10px 10px;
}

.book-item:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.router-link-exact-active,
.router-link-active {
  text-decoration: none;
  color: inherit;
}

.v-img {
  height: 120px;
}

.chips-container {
  margin-top: 5px;
}

.chips-container > * {
  margin-right: 8px;
}
</style>
