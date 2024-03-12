<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">Users</h1>
      <div class="page_actions">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="createItem()">
          Add New
        </v-btn>
        <v-btn color="red" prepend-icon="mdi-delete" @click="bulkDelete()">
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
            {{ formatDate(item.createdDate) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="action_buttons">
            <v-btn
              color="warning"
              prepend-icon="mdi-eye"
              size="small"
              width="90%"
              @click="viewItem(item.id)"
            >
              View
            </v-btn>

            <v-btn
              color="blue"
              prepend-icon="mdi-pencil"
              size="small"
              width="90%"
              @click="editItem(item.id)"
            >
              Edit
            </v-btn>

            <v-btn
              color="red"
              prepend-icon="mdi-delete"
              size="small"
              width="90%"
              @click="prepareDeleteItem(item.id)"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
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
          <v-btn class="text-none" rounded="xl" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            class="text-none"
            color="red"
            rounded="xl"
            variant="flat"
            @click="bulkDelete(deleteItemId)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { get, _delete } from "@/net/index.js";
import { formatDate } from "@/assets/js/admin/common_dataTable.js";
import * as useTableActions from "@/assets/js/admin/common_dataTable.js";
import { ElMessage } from "element-plus";

const router = useRouter();
const dialog = ref(false); // Controls the visibility of the dialog
const deleteItemId = ref();

// Wrap the functions to pass the router instance
const createItem = () => useTableActions.createItem(router);
const viewItem = (id) => useTableActions.viewItem(router, id);
const editItem = (id) => useTableActions.editItem(router, id);
const prepareDeleteItem = (id) =>
  useTableActions.prepareDeleteItem(deleteItemId, dialog, id);

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

function fetchItems() {
  loading.value = true;
  const url = "/api/users/";
  const params = {
    current: page.value,
    size: itemsPerPage.value,
    filter: search.value,
  };

  get(
    url,
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
}

onMounted(() => {
  fetchItems();
});

const performSearch = () => {
  page.value = 1; // Reset to first page
  fetchItems();
};

// Update the items per page for data table
const updateItemsPerPage = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
  fetchItems();
};

// Update the page for data table
const updatePage = (newPage) => {
  page.value = newPage;
  fetchItems();
};

const bulkDelete = (ids = selected.value) => {
  _delete("/api/users/bulk-delete", ids, () => {
    ElMessage.success("Items deleted successfully");
  });

  dialog.value = false; // Close the dialog
};
</script>

<style scoped>
@import "@/assets/css/admin/common_browse.css";
</style>