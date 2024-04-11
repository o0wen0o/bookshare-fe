<template>
  <v-card class="mb-3" elevation="3">
    <v-card-title>Recommended Books</v-card-title>
    <v-divider></v-divider>

    <div class="recommended-book-container">
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="book in books" :key="book.id">
          <v-card class="book-card" @click="goToBook(book.id)">
            <v-img
              class="book-img"
              :src="ossEndpoint + book.imgUrl"
              cover
            ></v-img>
            <span class="book-title">{{ book.title }}</span>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";

const router = useRouter();
const store = useStore();
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;
const bookId = computed(() => store.state.bookId || {}); // Get the current book id from the store

const books = ref([
  {
    id: 1,
    title: "Title 1",
    imgUrl: "https://via.placeholder.com/150",
  },
]);

function goToBook(bookId) {
  // Navigate to the book details
  router.push(`/book-detail/${bookId}`);
}

const fetchItems = () => {
  get(
    `/api/book-detail/getRecommendedBooks/${bookId.value}`,
    (data) => {
      books.value = data;
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.recommended-book-container {
  display: flex;
  justify-content: center;
}

.book-card {
  margin: 30px 10px;
  width: 90px;
}

.book-img {
  height: 115px;
}

.book-title {
  padding: 5px;
  font-size: small;

  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>