<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">Users</h1>
      <div class="page_actions">
        <router-link :to="`${$route.path}/create`">
          <v-btn color="primary" prepend-icon="mdi-plus">Add New</v-btn>
        </router-link>

        <v-btn
          color="red"
          prepend-icon="mdi-delete"
          @click="prepareDeleteItem(selected)"
        >
          Bulk Delete
        </v-btn>
      </div>
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
        class="data_table"
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
        <!-- Visiblity -->
        <template #item.bookshelfVisible="{ item }">
          <div>
            <v-chip
              variant="tonal"
              :color="item.bookshelfVisible ? 'success' : 'primary'"
            >
              {{ item.bookshelfVisible ? "Yes" : "No" }}
            </v-chip>
          </div>
        </template>

        <template #item.reviewVisible="{ item }">
          <div>
            <v-chip
              variant="tonal"
              :color="item.reviewVisible ? 'success' : 'primary'"
            >
              {{ item.reviewVisible ? "Yes" : "No" }}
            </v-chip>
          </div>
        </template>

        <template #item.contributionVisible="{ item }">
          <div>
            <v-chip
              variant="tonal"
              :color="item.contributionVisible ? 'success' : 'primary'"
            >
              {{ item.contributionVisible ? "Yes" : "No" }}
            </v-chip>
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
          <DataTableActions
            :item="item"
            @prepare-delete-item="prepareDeleteItem(ids)"
          ></DataTableActions>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Delete Confirmation -->
    <DeleteConfirmationDialog
      v-model="dialog"
      @confirm-delete="bulkDelete"
    ></DeleteConfirmationDialog>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { formatDatetime } from "@/assets/js/admin/common_browse.js";
import * as useTableActions from "@/assets/js/admin/common_browse.js";
import DataTableActions from "@/views/admin/components/DataTableActions.vue";
import DeleteConfirmationDialog from "@/views/admin/components/DeleteConfirmationDialog.vue";

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
  { title: "Username", value: "username" },
  { title: "Email", value: "email" },
  { title: "Phone Number", value: "phoneNumber" },
  { title: "Bookshelf Visibility", value: "bookshelfVisible" },
  { title: "Review Visibility", value: "reviewVisible" },
  { title: "Contribution Visibility", value: "contributionVisible" },
  { title: "Created Date", value: "createdDate" },
  { title: "Actions", value: "actions", sortable: false },
]);

// Wrap the functions to pass the router instance
const prepareDeleteItem = (id) =>
  useTableActions.prepareDeleteItem(deleteItemId, dialog, id);

const performSearch = () => useTableActions.performSearch(page, fetchItems);

const updateItemsPerPage = (newItemsPerPage) =>
  useTableActions.updateItemsPerPage(itemsPerPage, newItemsPerPage, fetchItems);

const updatePage = (newPage) =>
  useTableActions.updatePage(page, newPage, fetchItems);

const fetchItems = () =>
  useTableActions.fetchItems(
    loading,
    items,
    totalItems,
    page,
    itemsPerPage,
    search,
    route
  );

const bulkDelete = (ids = selected.value) =>
  useTableActions.bulkDelete(route, ids, dialog, fetchItems);

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";
</style>