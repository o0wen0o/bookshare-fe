<template>
  <v-card elevation="3" class="pa-3">
    <div v-for="book in books" :key="book.id">
      <!-- Wrapped each book in router-link -->
      <router-link
        :to="{ name: 'book-detail', params: { id: book.id } }"
        class="router-link-exact-active router-link-active"
      >
        <v-row align="center" class="book-item">
          <!-- Book Image -->
          <v-col cols="12" sm="3">
            <v-img
              :src="book.imgUrl"
              :alt="book.title"
              aspect-ratio="1"
              contain
            ></v-img>
          </v-col>

          <!-- Book Info -->
          <v-col cols="12" sm="9">
            <h3>{{ book.title }}</h3>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Publication Date:</strong> {{ book.publicationDate }}</p>

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
    </div>
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
