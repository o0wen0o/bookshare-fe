<template>
  <v-card>
    <v-container>
      <!-- Tabs -->
      <v-tabs v-model="currentProfileTab" background-color="primary" dark>
        <v-tab value="profile">Profile</v-tab>
        <v-tab value="genres">Favourite Genres</v-tab>
      </v-tabs>
    </v-container>

    <!-- Tab Contents -->
    <v-window v-model="currentProfileTab">
      <v-window-item :value="'profile'">
        <!-- Profile Form Component -->
        <ProfileDetailForm />
      </v-window-item>

      <v-window-item :value="'genres'">
        <!-- Favourite Genres Component -->
        <ProfileDetailGenres />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import ProfileDetailForm from "../profile-detail/ProfileDetailForm.vue";
import ProfileDetailGenres from "../profile-detail/ProfileDetailGenres.vue";

const currentProfileTab = ref("profile");
</script>
