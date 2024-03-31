<template>
  <div>
    <v-card elevation="2" class="pa-3">
      <v-card-title>My Book Review</v-card-title>
      <v-divider></v-divider>

      <v-infinite-scroll side="end" @load="load">
        <template v-for="bookReview in bookReviews" :key="bookReview.id">
          <v-row align="center" class="book-review-item">
            <!-- Book Review Image -->
            <v-col
              cols="12"
              sm="3"
              @click="navigateToBookDetail(bookReview.id)"
            >
              <v-img
                :src="bookReview.imgUrl"
                :alt="bookReview.title"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-col>

            <!-- Book Review Info -->
            <v-col
              cols="12"
              sm="8"
              @click="navigateToBookDetail(bookReview.id)"
            >
              <h4>{{ bookReview.title }}</h4>
              <p class="book-review-text">Content: {{ bookReview.text }}</p>
              <p>Updated Date: {{ bookReview.updatedDate }}</p>
              <p>Created Date: {{ bookReview.createdDate }}</p>
            </v-col>

            <!-- Book Review Actions -->
            <v-col cols="12" sm="1" class="book-review-actions">
              <v-btn
                icon
                size="small"
                @click.stop="navigateToEditBookReview(bookReview.id)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                @click.stop="prepareDeleteItem(bookReview)"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </template>

        <template v-slot:empty>
          <v-alert icon="mdi-reload" type="warning">
            No more bookReviews available
          </v-alert>
        </template>
      </v-infinite-scroll>
    </v-card>

    <v-dialog v-model="dialog" max-width="350">
      <v-card
        max-width="400"
        prepend-icon="mdi-alert-circle"
        text="Are you sure you want to delete it?"
        title="Confirm Delete"
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
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import * as commonBrowseFunction from "@/assets/js/admin/common_browse.js";

const route = useRoute();
const router = useRouter();
const dialog = ref(false); // Controls the visibility of the dialog
const deleteItemId = ref([]);

// Simulate a larger dataset
const allBookReviews = ref([
  {
    id: 1,
    title: "Book Review One",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imgUrl: "https://via.placeholder.com/150",
    updatedDate: "2022-01-01 03:01:40",
    createdDate: "2020-03-08 11:33:50",
  },
  {
    id: 2,
    title: "Book Review Two",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imgUrl: "https://via.placeholder.com/150",
    updatedDate: "2022-01-01 03:01:40",
    createdDate: "2020-03-08 11:33:50",
  },
  {
    id: 3,
    title: "Book Review Three",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imgUrl: "https://via.placeholder.com/150",
    updatedDate: "2022-01-01 03:01:40",
    createdDate: "2020-03-08 11:33:50",
  },
]);

// Ref for displayed bookReviews
const bookReviews = ref(allBookReviews.value.slice(0, 5));

// Wrap the functions to pass the router instance
const prepareDeleteItem = (ids) =>
  commonBrowseFunction.prepareDeleteItem(deleteItemId, dialog, ids);

const deleteItem = () =>
  commonBrowseFunction.bulkDelete(route, deleteItemId, dialog, fetchItems);

const cancelDelete = () => {
  dialog.value = false;
  deleteItemId.value = [];
};

const navigateToBookDetail = (bookId) => {
  router.push({ name: "book-detail", params: { id: bookId } });
};

const navigateToEditBookReview = (bookReviewId) => {
  const newTab = window.open("", "_blank"); // Open a new tab
  newTab.location.href = `/write-book-review/${bookReviewId}`;
};

// Function to load more bookReviews
const loadMoreBooks = () => {
  const currentCount = bookReviews.value.length;
  const moreBookReviews = allBookReviews.value.slice(
    currentCount,
    currentCount + 1
  );
  if (moreBookReviews.length) {
    bookReviews.value = [...bookReviews.value, ...moreBookReviews];
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
.book-review-item {
  margin: -10px 10px;
}

.book-review-item:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.book-review-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-img {
  height: 120px;
}

.book-review-actions {
  padding: 0;
}

.book-review-actions > * {
  color: rgb(180, 60, 0);
  margin-top: 8px;
}
</style>
