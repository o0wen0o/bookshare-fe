<template>
  <v-container>
    <v-text-field
      class="search_field"
      v-model="search"
      density="compact"
      label="Search comments"
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
      <template #item.createdDate="{ item }">
        <div>
          {{ formatDatetime(item.createdDate) }}
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { formatDatetime } from "@/assets/js/admin/common_read.js";
import { get } from "@/net/index.js";
import * as commonBrowseFunction from "@/assets/js/admin/common_browse.js";

const search = ref("");
const loading = ref(false);
const items = ref([]);
const totalItems = ref(0);
const page = ref(1);
const itemsPerPage = ref(5);

// Define the props received from the parent component
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const itemsPerPageOptions = ref([
  { value: 5, title: "5" },
  { value: 10, title: "10" },
  { value: 25, title: "25" },
  { value: 50, title: "50" },
  // { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
]);

const headers = ref([
  { title: "ID", value: "id" },
  { title: "Parent ID", value: "parentId" },
  { title: "Text", value: "text" },
  { title: "Created Date", value: "createdDate" },
  { title: "Likes", value: "likes" },
  { title: "User ID", value: "userId" },
  { title: "Book ID", value: "bookId" },
]);

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

// Fetch items for data table
const fetchItems = () => {
  loading.value = true;
  const params = {
    current: page.value,
    size: itemsPerPage.value,
    filter: search.value,
    bookId: props.id,
  };

  get(
    `/api/book-comments/getBookCommentsByBookId`,
    (data) => {
      items.value = data.records;
      totalItems.value = data.total;
      loading.value = false;
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";
</style>
