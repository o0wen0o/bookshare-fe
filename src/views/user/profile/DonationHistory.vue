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
            <p>Amount Donated: {{ donation.donationAmount }}</p>
            <p>Contribution Date: {{ donation.contributionDate }}</p>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
      </template>

      <template v-slot:empty>
        <v-alert icon="mdi-reload" type="warning">
          No more books available
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Simulate a larger dataset
const allDonations = ref([
  {
    id: 1,
    projectName: "Project One",
    donationAmount: "200.00",
    contributionDate: "2022-01-01 03:10:20",
  },
  {
    id: 2,
    projectName: "Project Two",
    donationAmount: "300.00",
    contributionDate: "2022-01-01 03:10:20",
  },
  {
    id: 3,
    projectName: "Project Three",
    donationAmount: "400.00",
    contributionDate: "2022-01-01 03:10:20",
  },
]);

// Ref for displayed donations
const donations = ref(allDonations.value.slice(0, 5));

// Function to load more donations
const loadMoreDonations = () => {
  const currentCount = donations.value.length;
  const moreDonations = allDonations.value.slice(
    currentCount,
    currentCount + 1
  );
  if (moreDonations.length) {
    donations.value = [...donations.value, ...moreDonations];
  }
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    loadMoreDonations();
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
