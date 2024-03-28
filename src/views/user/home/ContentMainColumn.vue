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
              <p>
                <strong>Publication Date:</strong> {{ book.publicationDate }}
              </p>

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
        <v-alert icon="mdi-reload" type="warning">
          No more books available
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

// Simulate a larger dataset
const allBooks = ref([
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
    id: 3,
    title: "Book Three",
    author: "Author C",
    publicationDate: "2021-05-01",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.2,
    favourite: 120,
    review: 300,
  },
  {
    id: 4,
    title: "Book Four",
    author: "Author D",
    publicationDate: "2020-11-15",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.8,
    favourite: 200,
    review: 220,
  },
  {
    id: 5,
    title: "Book Five",
    author: "Author E",
    publicationDate: "2019-06-21",
    imgUrl: "https://via.placeholder.com/150",
    rating: 3.9,
    favourite: 90,
    review: 100,
  },
  {
    id: 6,
    title: "Book Six",
    author: "Author F",
    publicationDate: "2018-02-14",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.6,
    favourite: 150,
    review: 190,
  },
  {
    id: 7,
    title: "Book Seven",
    author: "Author G",
    publicationDate: "2017-09-09",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.3,
    favourite: 110,
    review: 210,
  },
  {
    id: 8,
    title: "Book Eight",
    author: "Author H",
    publicationDate: "2023-03-03",
    imgUrl: "https://via.placeholder.com/150",
    rating: 5.0,
    favourite: 300,
    review: 400,
  },
  {
    id: 9,
    title: "Book Nine",
    author: "Author I",
    publicationDate: "2022-12-12",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.1,
    favourite: 80,
    review: 90,
  },
  {
    id: 10,
    title: "Book Ten",
    author: "Author J",
    publicationDate: "2021-07-07",
    imgUrl: "https://via.placeholder.com/150",
    rating: 4.9,
    favourite: 250,
    review: 320,
  },
]);

// Ref for displayed books
const books = ref(allBooks.value.slice(0, 5));

// Function to load more books
const loadMoreBooks = () => {
  const currentCount = books.value.length;
  const moreBooks = allBooks.value.slice(currentCount, currentCount + 1);
  if (moreBooks.length) {
    books.value = [...books.value, ...moreBooks];
  }
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    loadMoreBooks();
    done("empty");
  }
};
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
