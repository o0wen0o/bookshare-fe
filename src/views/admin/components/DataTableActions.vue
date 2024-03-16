<template>
  <div class="action_buttons">
    <router-link :to="`${routePath}/${item.id}`">
      <v-btn color="warning" prepend-icon="mdi-eye" size="small">
        View
      </v-btn>
    </router-link>

    <router-link :to="`${routePath}/${item.id}/edit`">
      <v-btn color="blue" prepend-icon="mdi-pencil" size="small">
        Edit
      </v-btn>
    </router-link>

    <v-btn
      color="red"
      prepend-icon="mdi-delete"
      size="small"
      @click="onDeleteClick"
    >
      Delete
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  item: Object,
});

const emit = defineEmits(["prepare-delete-item"]);

const route = useRoute();
const routePath = ref(route.path);

function onDeleteClick() {
  // Emit an event to the parent component
  emit("prepare-delete-item", props.item.id);
}
</script>

<style scoped>
/* Include any specific styles for action buttons if needed */
</style>

<style scoped>
.action_buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 0;
}

.v-btn {
  width: 120px;
}
</style>