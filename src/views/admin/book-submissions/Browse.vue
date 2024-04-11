<template>
  <div>
    <div class="page_header">
      <h1 class="page_title" :style="{ textTransform: 'capitalize' }">
        {{ $route.name }}
      </h1>
    </div>

    <v-card class="page_body" elevation="3">
      <v-text-field
        class="search_field"
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        hide-details
        @keyup.enter="performSearch"
      ></v-text-field>

      <v-data-table-server
        :headers="headers"
        :loading="loading"
        :items="items"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        @update:items-per-page="updateItemsPerPage"
        @update:page="updatePage"
        show-current-page
        hover
      >
        <!-- Publication Date -->
        <template #item.publicationDate="{ item }">
          <div>
            {{ formatDate(item.publicationDate) }}
          </div>
        </template>

        <!-- Created Date -->
        <template #item.createdDate="{ item }">
          <div>
            {{ formatDatetime(item.createdDate) }}
          </div>
        </template>

        <!-- Visiblity -->
        <template #item.status="{ item }">
          <div>
            <v-chip
              variant="tonal"
              :color="
                item.status === 'Accepted'
                  ? 'success'
                  : item.status === 'Rejected'
                  ? 'red'
                  : 'primary'
              "
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="action_buttons">
            <router-link :to="`${route.path}/${item.id}`">
              <v-btn color="warning" prepend-icon="mdi-eye" size="small">
                View
              </v-btn>
            </router-link>

            <!-- Check if the status is 'pending' and display Accept/Reject buttons -->
            <template v-if="item.status === 'Pending'">
              <v-btn
                color="success"
                prepend-icon="mdi-check-bold"
                size="small"
                @click="acceptBookSubmission(item)"
              >
                Accept
              </v-btn>
              <v-btn
                color="red"
                prepend-icon="mdi-close-thick"
                size="small"
                @click="rejectBookSubmission(item)"
              >
                Reject
              </v-btn>
            </template>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { post } from "@/net/index.js";
import { formatDatetime, formatDate } from "@/assets/js/admin/common_browse.js";
import * as commonBrowseFunction from "@/assets/js/admin/common_browse.js";

const route = useRoute();
const search = ref([]);
const loading = ref(false);
const items = ref([]);
const totalItems = ref(0);
const page = ref(1);
const itemsPerPage = ref(5);

const itemsPerPageOptions = ref([
  { value: 5, title: "5" },
  { value: 10, title: "10" },
  { value: 25, title: "25" },
  { value: 50, title: "50" },
  // { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
]);

const headers = ref([
  { title: "ID", value: "id" },
  { title: "Title", value: "title" },
  { title: "Author", value: "author" },
  { title: "Publisher", value: "publisher" },
  { title: "ISBN", value: "isbn" },
  { title: "Publication Date", value: "publicationDate" },
  { title: "Language", value: "language" },
  { title: "Created Date", value: "createdDate" },
  { title: "Status", value: "status" },
  { title: "User ID", value: "userId" },
  { title: "Actions", value: "actions", sortable: false },
]);

// Wrap the functions to pass the router instance
const performSearch = () =>
  commonBrowseFunction.performSearch(page, fetchItems);

const updateItemsPerPage = (newItemsPerPage) =>
  commonBrowseFunction.updateItemsPerPage(
    itemsPerPage,
    newItemsPerPage,
    fetchItems
  );

const updatePage = (newPage) =>
  commonBrowseFunction.updatePage(page, newPage, fetchItems);

const fetchItems = () =>
  commonBrowseFunction.fetchItems(
    loading,
    items,
    totalItems,
    page,
    itemsPerPage,
    search,
    route.path
  );

onMounted(() => {
  fetchItems();
});

const acceptBookSubmission = async (item) => {
  const bookSubmissionId = item.id;

  post(
    `/api${route.path}/acceptBookSubmission`,
    bookSubmissionId,
    () => {
      ElMessage.success("Book submission approved successfully");
      fetchItems();
    },
    (message) => {
      ElMessage.error(message);
    }
  );
};

const rejectBookSubmission = async (item) => {
  const bookSubmissionId = item.id;

  post(
    `/api${route.path}/rejectBookSubmission`,
    bookSubmissionId,
    () => {
      ElMessage.success("Book submission rejected successfully");
      fetchItems();
    },
    (message) => {
      ElMessage.error(message);
    }
  );
};
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";

.action_buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 0;
}

.v-btn {
  width: 120px;
}
</style>