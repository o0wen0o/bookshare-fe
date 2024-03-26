<template>
  <div>
    <div class="page_header">
      <h1 class="page_title" :style="{ textTransform: 'capitalize' }">
        {{ $route.name }}
      </h1>

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
        <!-- Actions -->
        <template #item.actions="{ item }">
          <DataTableActions
            :item="item"
            @prepare-delete-item="prepareDeleteItem"
          ></DataTableActions>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Delete Confirmation -->
    <DeleteConfirmationDialog
      v-model="dialog"
      @confirm-delete="bulkDelete(deleteItemId)"
    ></DeleteConfirmationDialog>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import * as commonBrowseFunction from "@/assets/js/admin/common_browse.js";
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
  { title: "Name", value: "name" },
  { title: "Actions", value: "actions", sortable: false },
]);

// Wrap the functions to pass the router instance
const prepareDeleteItem = (id) =>
  commonBrowseFunction.prepareDeleteItem(deleteItemId, dialog, id);

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
    route
  );

const bulkDelete = (ids = selected.value) =>
  commonBrowseFunction.bulkDelete(route, ids, dialog, fetchItems);

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";
</style>