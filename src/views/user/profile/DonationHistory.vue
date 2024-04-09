<template>
  <v-card elevation="2" class="pa-3">
    <v-card-title>Donation History</v-card-title>
    <v-divider></v-divider>

    <v-infinite-scroll side="end" @load="load">
      <template v-for="donation in donations" :key="donation.id">
        <v-row align="center" class="book-item">
          <!-- Book Info -->
          <v-col cols="12">
            <h4>Project Name: {{ donation.title }}</h4>
            <p>Amount Donated: RM {{ donation.donationAmount }}.00</p>
            <p>Contribution Date: {{ donation.contributionDate }}</p>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
      </template>

      <template v-slot:empty>
        <v-alert icon="mdi-reload" type="warning">
          No more data available
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get, _delete } from "@/net/index.js";
import moment from "moment";

const route = useRoute();
const page = ref(1);
const itemsPerPage = ref(10);
const donations = ref([]);

const store = useStore();
const userData = computed(() => store.state.user || {});
const routeUserId = route.query.userId;

// Function to load more donations
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    userId: routeUserId || userData.value.id,
  };

  get(
    `/api/profile-donation/getDonationsByUserId`,
    (data) => {
      if (data.records.length) {
        // Format dates
        data.records.forEach((donation) => {
          donation.contributionDate = moment(donation.contributionDate).format(
            "DD-MM-YYYY HH:mm:ss"
          );
        });

        donations.value = [...donations.value, ...data.records];
      }
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
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

.router-link-exact-active,
.router-link-active {
  text-decoration: none;
  color: inherit;
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
