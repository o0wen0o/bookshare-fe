<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">{{ isEdit ? "Edit" : "Add" }} User</h1>
    </div>
    
    <v-card class="page_body" elevation="3" style="height: 500px; width: 100%">
      
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isEdit = ref(false);
const id = ref(null);

onMounted(() => {
  // Access the 'id' parameter from the route
  id.value = route.params.id;

  // Determine if it's an edit based on the presence of 'id'
  isEdit.value = Boolean(id.value);
});
</script>

<style scoped>
.page_header {
    padding: 20px 0 40px 20px;
    display: flex;
    align-items: center;
}

.page_title {
    margin: 0 20px 0 50px;
}

.page_body {
    padding: 20px;
}
</style>