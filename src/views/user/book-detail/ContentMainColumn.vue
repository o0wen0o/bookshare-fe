<template>
  <v-card elevation="2">
    <v-img :src="ossEndpoint + book.imgUrl" class="book-img"></v-img>

    <v-container>
      <!-- Book Info -->
      <v-card-title>{{ book.title }}</v-card-title>
      <v-card-text>
        <p>{{ book.description }}</p>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Page:</strong> {{ book.page }}</p>
        <p><strong>Language:</strong> {{ book.language }}</p>
        <p><strong>Genres:</strong> {{ book.genres.split(",").join(", ") }}</p>

        <!-- Toggleable Details -->
        <v-btn
          variant="text"
          size="small"
          style="padding: 0"
          append-icon="mdi-chevron-down"
          @click="showDetails = !showDetails"
        >
          {{ showDetails ? "Hide Details" : "Show Details" }}
        </v-btn>
        <div v-if="showDetails">
          <p><strong>Publisher:</strong> {{ book.publisher }}</p>
          <p><strong>Publication Date:</strong> {{ book.publicationDate }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn }}</p>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <v-btn
          :prepend-icon="book.isFavourite ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="book.isFavourite ? 'red' : ''"
          @click="toggleFavourite(book)"
        >
          {{ book.favourite }} Bookshelf
        </v-btn>

        <v-btn prepend-icon="mdi-comment-outline" @click="scrollToComments()">
          {{ book.commentCount }} Comment
        </v-btn>

        <v-btn prepend-icon="mdi-book-open-page-variant"> Get book </v-btn>
      </v-card-actions>

      <v-divider class="my-3"></v-divider>

      <!-- Rating -->
      <div class="d-flex justify-center mt-auto text-h5">Rating overview</div>

      <div class="d-flex align-center flex-column my-auto">
        <div class="text-h2 mt-5">
          {{ book.rating }}
          <span class="text-h6 ml-n3">/5</span>
        </div>

        <v-rating
          :model-value="book.rating"
          color="yellow-darken-3"
          half-increments
        ></v-rating>
        <div class="px-3">{{ book.ratingCount }} ratings</div>
      </div>

      <v-divider class="my-3"></v-divider>

      <!-- Comments -->
      <book-comments />
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { get, post, _delete } from "@/net/index.js";
import BookComments from "./BookComments.vue";

const route = useRoute();
const bookId = ref(null);
const showDetails = ref(false);

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;
const store = useStore();
const userData = computed(() => store.state.user || {});

const book = ref({
  title: "The Great Adventure",
  author: "John Doe",
  description: "Description of the book...",
  publisher: "Publisher Name",
  isbn: "1234567890",
  publicationDate: "2022-01-01",
  page: 300,
  language: "English",
  genres: "Adventure,Fantasy",
  imgUrl: "books/the_great_adventure_.jpg",
  rating: 4.5,
  favourite: 100,
  review: 200,

  isFavourite: false,
  commentCount: 456,
  ratingCount: 123,
});

function addToBookshelf(book) {
  console.log("Adding to bookshelf", book.title);
}

function scrollToComments() {
  console.log("Scrolling to comments");
}

function toggleFavourite(book) {
  book.isFavourite = !book.isFavourite;
  book.favourite += book.isFavourite ? 1 : -1;
}

const fetchItems = () => {
  get(
    `/api/book-detail/getBookDetail/${bookId.value}/${userData.value.id}`,
    (data) => {
      book.value = data;
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

onMounted(() => {
  bookId.value = route.params.id;
  store.dispatch("setBookId", bookId); // Store bookId in Vuex store
  fetchItems();
});
</script>

<style>
.book-img {
  height: 250px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0.4)
  );
}

.v-card-text > *,
.v-card-text div > * {
  margin-bottom: 0.5rem;
}
</style>
