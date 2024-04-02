<template>
  <v-container>
    <!-- Displaying Chips Separately -->
    <div class="selected-chips" v-if="selectedGenres.length">
      <v-chip
        v-for="(genre, index) in selectedGenres"
        :key="index"
        close
        @click:close="removeChip(index)"
        color="blue lighten-3"
      >
        {{ genre }}
      </v-chip>
    </div>

    <v-autocomplete
      v-model="selectedGenres"
      :items="genres"
      label="Select your favorite genres"
      multiple
      outlined
      :filter="customFilter"
      @change="updateChips"
    ></v-autocomplete>

    <v-btn color="success" @click="saveGenres">Save Genres</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const genres = ref([
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance12",
  "Fantasy",
  "Scie121nce Fiction",
  "Myst12ery",
  "Thriller",
  "R1oman122ce",
  "Fantasy4",
  "Science Fiction",
  "Mys212tery",
  "Thr3iller",
  "R4omance",
  "Fa4ntasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  // Add more genres as necessary
]);
const selectedGenres = ref([]);

function saveGenres() {
  console.log("Favorite genres saved:", selectedGenres.value);
}

// This is not needed if you are only displaying chips outside of the v-autocomplete
function updateChips() {
  // This function would be used if you need to perform an action right after the selection changes
}

function removeChip(index) {
  selectedGenres.value.splice(index, 1);
}

function customFilter(item, queryText, itemText) {
  const hasValue = (val) => (val != null ? val : "");
  const text = hasValue(itemText).toString().toLowerCase();
  const query = hasValue(queryText).toLowerCase();

  return text.indexOf(query) > -1;
}
</script>

<style scoped>
.selected-chips {
  margin-top: -16px;
  margin-bottom: 32px;
}

.selected-chips > * {
  margin-top: 16px;
  margin-right: 10px;
}
</style>
