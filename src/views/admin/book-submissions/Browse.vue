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
        v-model="selected"
        :headers="headers"
        :loading="loading"
        :items="items"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        @update:items-per-page="updateItemsPerPage"
        @update:page="updatePage"
        show-select
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

        <!-- Actions -->
        <template #item.actions="{ item }">
          <router-link :to="`${route.path}/${item.id}`">
            <v-btn color="warning" prepend-icon="mdi-eye" size="small">
              View
            </v-btn>
          </router-link>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { formatDatetime, formatDate } from "@/assets/js/admin/common_browse.js";
import * as commonBrowseFunction from "@/assets/js/admin/common_browse.js";

const route = useRoute();
const dialog = ref(false); // Controls the visibility of the dialog
const deleteItemId = ref([]);

const selected = ref([]);
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
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";
</style>