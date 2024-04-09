<template>
  <div>
    <v-card elevation="2" class="pa-3">
      <v-card-title>My Bookshelf</v-card-title>
      <v-divider></v-divider>

      <v-infinite-scroll side="end" @load="load">
        <template v-for="book in books" :key="book.id">
          <v-row align="center" class="book-item">
            <!-- Book Image -->
            <v-col cols="12" sm="3" @click="navigateToBookDetail(book.id)">
              <v-img
                :src="ossEndpoint + book.imgUrl"
                :alt="book.title"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-col>

            <!-- Book Info -->
            <v-col cols="12" sm="8" @click="navigateToBookDetail(book.id)">
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

            <!-- Book Actions -->
            <v-col cols="12" sm="1" class="book-actions" v-if="!routeUserId">
              <v-btn icon size="small" @click.stop="prepareDeleteItem(book.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </template>

        <template v-slot:empty>
          <v-alert icon="mdi-reload" type="warning">
            No more books available
          </v-alert>
        </template>
      </v-infinite-scroll>
    </v-card>

    <!-- Delete Dialog -->
    <v-dialog v-model="dialog" max-width="350">
      <v-card
        max-width="400"
        prepend-icon="mdi-alert-circle"
        text="Are you sure you want to remove it from bookshelf?"
        title="Confirm Remove"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="text-none" rounded="xl" @click="cancelDelete">
            Cancel
          </v-btn>
          <v-btn
            class="text-none"
            color="red"
            rounded="xl"
            variant="flat"
            @click="deleteItem"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { get, _delete } from "@/net/index.js";

const route = useRoute();
const router = useRouter();
const dialog = ref(false); // Controls the visible of the dialog
const deleteItemId = ref();
const page = ref(1);
const itemsPerPage = ref(10);
const books = ref([]);
const isVisible = ref(true);

const store = useStore();
const userData = computed(() => store.state.user || {});
const routeUserId = route.query.userId;
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

// Function to load more books
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    userId: routeUserId || userData.value.id,
  };

  get(
    `/api/profile-bookshelf/getFavouriteBooks`,
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

// Prepares delete action (opens dialog)
function prepareDeleteItem(id) {
  deleteItemId.value = id;
  dialog.value = true;
}

// Bulk delete after confirmation dialog
const deleteItem = () => {
  _delete(
    `/api/profile-bookshelf/deleteFromBookshelf`,
    `${deleteItemId.value}/${routeUserId || userData.value.id}`,
    () => {
      ElMessage.success("Items deleted successfully");
      dialog.value = false; // Close the dialog

      // Clear the current book list and reload from the first page
      books.value = []; // Reset books array to empty
      page.value = 1; // Reset to first page
      fetchItems(); // Fetch the initial set of books again
    }
  );
};

const cancelDelete = () => {
  dialog.value = false;
  deleteItemId.value = [];
};

const navigateToBookDetail = (bookId) => {
  router.push({ name: "book-detail", params: { id: bookId } });
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    fetchItems();
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

.v-img {
  height: 120px;
}

.chips-container {
  margin-top: 5px;
}

.chips-container > * {
  margin-right: 8px;
}

.book-actions {
  padding: 0;
}

.book-actions > * {
  color: rgb(180, 60, 0);
}
</style>
