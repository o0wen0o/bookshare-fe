<template>
  <v-container>
    <!-- Displaying Chips Separately -->
    <div class="selected-chips" v-if="selectedGenres.length">
      <v-chip
        v-for="genreId in selectedGenres"
        :key="genreId"
        closable
        color="blue lighten-3"
        @click:close="removeChip(genreId)"
      >
        {{ findGenreName(genreId) }}
      </v-chip>
    </div>

    <v-autocomplete
      v-model="selectedGenres"
      label="Select your favorite genres"
      item-value="id"
      item-title="name"
      :items="genres"
      multiple
    ></v-autocomplete>

    <v-btn color="success" @click="saveFavouriteGenres">Save Genres</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { get, post } from "@/net/index.js";
import { useStore } from "vuex";

const store = useStore();
const userData = computed(() => store.state.user || {});

const selectedGenres = ref([]);
const genres = ref([]);

const fetchGenres = () => {
  get(
    "/api/profile-favourite-genre/getAllGenres",
    (data) => {
      genres.value = data;
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const fetchFavouriteGenres = () => {
  const params = {
    userId: userData.value.id,
  };

  get(
    "/api/profile-favourite-genre/getFavouriteGenres",
    (data) => {
      data.forEach((userPivotGenre) => {
        selectedGenres.value.push(userPivotGenre.genreId);
      });
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
};

const saveFavouriteGenres = () => {
  const favouriteGenreDTO = {
    userId: userData.value.id,
    ids: selectedGenres.value,
  };

  post(
    "/api/profile-favourite-genre/saveFavouriteGenres",
    favouriteGenreDTO,
    () => {
      ElMessage.success("Favourite genres saved successfully");
    },
    (message) => {
      ElMessage.error(message);
    }
  );
};

function removeChip(genreId) {
  const index = selectedGenres.value.findIndex((id) => id === genreId);
  if (index !== -1) {
    selectedGenres.value.splice(index, 1);
  }
}

function findGenreName(genreId) {
  const genre = genres.value.find((genre) => genre.id === genreId);
  return genre ? genre.name : "Unknown";
}

onMounted(() => {
  fetchGenres();
  fetchFavouriteGenres();
});
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
