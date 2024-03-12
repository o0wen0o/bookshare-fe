<template>
  <div>
    <h1>Books</h1>
    <v-btn color="primary" @click="">Add New</v-btn>
    <v-btn color="red" @click="">Bulk Delete</v-btn>

    <v-card>
      <!-- Added input fields for filters -->
      <!-- <input type="text" placeholder="Filter by title" v-model="titleFilter" /> -->
      <!-- <input type="text" placeholder="Filter by status" v-model="statusFilter" /> -->

      <v-data-table :headers="headers" :items="serverItems" :loading="loading" :items-per-page="itemsPerPage"
        :server-items-length="totalItems" @update:pagination="fetchItems">
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/net/index.js';

const serverItems = ref([]);
const loading = ref(false);
const totalItems = ref(0);
const itemsPerPage = ref(5);
const headers = ref([
  { text: 'ID', value: 'id' },
  { text: 'Username', value: 'username' },
  { text: 'Email', value: 'email' },
  { text: 'Phone Number', value: 'phoneNumber' },
  { text: 'Bookshelf Visibility', value: 'bookshelfVisible' },
  { text: 'Review Visibility', value: 'reviewVisible' },
  { text: 'Contribution Visibility', value: 'contributionVisible' },
  { text: 'Created Date', value: 'createdDate' },
  { text: 'Actions' },
]);

function fetchItems({ page, itemsPerPage }) {
  loading.value = true;
  const url = '/api/users/';
  const params = {
    page,
    size: itemsPerPage,
  };

  get(url, (data) => {
    serverItems.value = data.records;
    totalItems.value = data.total;
    loading.value = false;

  }, (error) => {
    console.error('Fetch error:', error);
    loading.value = false;
  }, params);
}

onMounted(() => {
  fetchItems({ page: 1, itemsPerPage: itemsPerPage.value });
});

</script>

<style></style>