<template>
  <div>
    <v-card elevation="2" class="pa-3">
      <v-card-title class="d-flex">
        <span>My Book Review</span>
        <v-btn
          class="ml-auto"
          color="success"
          prepend-icon="mdi-plus"
          @click="navigateToAddBookReview"
          v-if="!routeUserId"
        >
          Create Book Review
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-infinite-scroll side="end" @load="load" v-if="isVisible">
        <template v-for="bookReview in bookReviews" :key="bookReview.id">
          <v-row align="center" class="book-review-item">
            <!-- Book Review Image -->
            <v-col
              cols="12"
              sm="3"
              @click="navigateToBookDetail(bookReview.id)"
            >
              <v-img
                :src="ossEndpoint + bookReview.imgUrl"
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
              <p class="book-review-text">
                Content: {{ stripHtml(bookReview.text) }}
              </p>
              <p>Updated Date: {{ bookReview.updatedDate }}</p>
              <p>Created Date: {{ bookReview.createdDate }}</p>
            </v-col>

            <!-- Book Review Actions -->
            <v-col
              cols="12"
              sm="1"
              class="book-review-actions"
              v-if="!routeUserId"
            >
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
                @click.stop="prepareDeleteItem(bookReview.id)"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </template>

        <template v-slot:empty>
          <v-alert type="info" variant="tonal">
            No more book reviews available.
          </v-alert>
        </template>
      </v-infinite-scroll>

      <div v-else>
        <v-alert type="info" variant="tonal">
          This book review is set to private.
        </v-alert>
      </div>
    </v-card>

    <!-- Delete Confirmation -->
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
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { get, _delete } from "@/net/index.js";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const dialog = ref(false); // Controls the visibility of the dialog
const deleteItemId = ref();
const page = ref(1);
const itemsPerPage = ref(10);
const bookReviews = ref([]);
const isVisible = ref(true);

const store = useStore();
const userData = computed(() => store.state.user || {});
const routeUserId = route.query.userId;
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

// Function to load more book reviews
const fetchItems = () => {
  // Check if the book review is visible
  if (routeUserId) {
    get(
      `/api/profile-book-review/checkBookReviewVisible/${routeUserId}`,
      (data) => {
        isVisible.value = data;

        if (!data) {
          return;
        }
      },
      (message) => {
        ElMessage.warning(message);
      }
    );
  }

  // Get book reviews if the book review is visible
  fetchBookReviews();
};

// Function to load book reviews
const fetchBookReviews = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    userId: routeUserId || userData.value.id,
  };

  get(
    `/api/profile-book-review/getBookReviewsByUserId`,
    (data) => {
      if (data.records.length) {
        // Format dates
        data.records.forEach((bookReview) => {
          bookReview.updatedDate = moment(bookReview.updatedDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          bookReview.createdDate = moment(bookReview.createdDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });

        bookReviews.value = [...bookReviews.value, ...data.records];
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
    `/api/profile-book-review/deleteBookReview`,
    `${deleteItemId.value}`,
    () => {
      ElMessage.success("The book review is deleted successfully");
      dialog.value = false; // Close the dialog

      // Clear the current book list and reload from the first page
      bookReviews.value = []; // Reset books array to empty
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

const navigateToAddBookReview = () => {
  const newTab = window.open("", "_blank"); // Open a new tab
  newTab.location.href = `/write-book-review/create`;
};

const navigateToEditBookReview = (bookReviewId) => {
  const newTab = window.open("", "_blank"); // Open a new tab
  newTab.location.href = `/write-book-review/${bookReviewId}/edit`;
};

// Method to strip HTML tags from a string
const stripHtml = (htmlString) => {
  if (!htmlString) return "";
  // First replace &nbsp; with a space, then remove HTML tags
  return htmlString.replace(/&nbsp;/gi, " ").replace(/<[^>]*>?/gm, "");
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
