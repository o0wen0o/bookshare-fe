<template>
  <v-card class="mb-3" elevation="3">
    <v-card-title>Recommended Books</v-card-title>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="book in books"
        :key="book.id"
        @click="goToBook(book.id)"
      >
        <v-list-item-avatar>
          <v-img :src="book.imgUrl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ book.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ book.author }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const books = ref([
  {
    id: 1,
    title: "Book One",
    author: "Author A",
    imgUrl: "https://via.placeholder.com/150",
  },
  // Add more recommended books here
]);
const router = useRouter();

function goToBook(bookId) {
  // Navigate to the book details. Adjust the route as needed.
  router.push(`/books/${bookId}`);
}
</script>
