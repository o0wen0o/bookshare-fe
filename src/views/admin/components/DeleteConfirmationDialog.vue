<template>
  <v-dialog v-model="dialog" max-width="350">
    <v-card
      max-width="400"
      prepend-icon="mdi-alert-circle"
      text="Are you sure you want to delete it?"
      title="Confirm Delete"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="text-none" rounded="xl" @click="onCancelClick">
          Cancel
        </v-btn>
        <v-btn
          class="text-none"
          color="red"
          rounded="xl"
          variant="flat"
          @click="onDeleteClick"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "confirm-delete"]);

const dialog = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
  }
);

function onCancelClick() {
  dialog.value = false;
  emit("update:modelValue", false);
}

function onDeleteClick() {
  emit("confirm-delete");
}
</script>
