<template>
  <v-card class="mb-3" elevation="3">
    <v-card-title>Recommended Books</v-card-title>
    <v-divider></v-divider>

    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="book in books"
        :key="book.id"
        v-slot="{ active, toggle }"
      >
        <v-card class="book-card" @click="goToBook(book.id)">
          <v-img class="book-img" :src="book.imgUrl"></v-img>
          <span class="book-title">{{ book.title }}</span>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const books = ref([
  {
    id: 1,
    title: "Title 1Title 1Title 1Title 1Title 1Title 1",
    imgUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Title 2",
    imgUrl: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Title 3",
    imgUrl: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    title: "Title 4",
    imgUrl: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    title: "Title 5",
    imgUrl: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    title: "Title 6Title 6Title 6Title 6",
    imgUrl: "https://via.placeholder.com/150",
  },
]);

function goToBook(bookId) {
  // Navigate to the book details
  router.push(`/book-detail/${bookId}`);
}
</script>

<style scoped>
.book-card {
  margin: 30px 10px;
  width: 90px;
}

.book-title {
  padding: 5px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>