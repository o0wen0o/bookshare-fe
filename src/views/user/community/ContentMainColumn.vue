<template>
  <v-card elevation="3" class="pa-3">
    <v-card-title>Community</v-card-title>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

// Example book data
const books = ref([
  {
    id: 1,
    title: "Book One",
    author: "Author A",
    publicationDate: "2022-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.5,
    favourite: 100,
    review: 200,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author B",
    publicationDate: "2023-01-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.7,
    favourite: 140,
    review: 230,
  },
]);
</script>

<style scoped>
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
