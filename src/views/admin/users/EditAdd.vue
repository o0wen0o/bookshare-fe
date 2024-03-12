<template>
    <div>
        <span>{{ isEdit ? 'Edit' : 'Add' }} Page</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

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
