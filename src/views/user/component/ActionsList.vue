<template>
  <v-card class="pa-3" elevation="2">
    <v-container>
      <v-row justify="space-between">
        <!-- Icons Navigation -->
        <v-col cols="auto" class="actions bookshelf">
          <v-btn to="/bookshelf" icon>
            <v-icon color="orange darken-2">mdi-bookshelf</v-icon>
          </v-btn>
          <span>Bookshelf</span>
        </v-col>

        <v-col cols="auto" class="actions review">
          <v-btn to="/book-review" icon>
            <v-icon color="blue darken-2">mdi-notebook-edit-outline</v-icon>
          </v-btn>
          <span>Review</span>
        </v-col>

        <v-col cols="auto" class="actions contribute">
          <v-btn to="/book-contribution" icon>
            <v-icon color="green darken-2">mdi-book-plus-outline</v-icon>
          </v-btn>
          <span>Contribute</span>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-5">
        <v-btn
          to="/create"
          color="primary"
          prepend-icon="mdi-plus"
          variant="outlined"
        >
          Create a Post
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.actions span {
  transition: color 0.3s;
}

.bookshelf:hover span {
  color: #f57c00;
}

.review:hover span {
  color: #1976d2;
}

.contribute:hover span {
  color: #388e3c;
}
</style>
