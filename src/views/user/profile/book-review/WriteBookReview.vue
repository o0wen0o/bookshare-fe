<template>
  <v-card elevation="2">
    <v-card-title>Write a book review</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <ckeditor
        :editor="editor"
        v-model="content"
        :config="editorConfig"
      ></ckeditor>

      <v-btn
        color="success"
        :disabled="isSaveButtonDisabled"
        @click="submitBookReview"
      >
        Save
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ckeditor = CKEditor.component;
const editor = ClassicEditor;
const content = ref(
  "<p>Content of your book review...</p><br><br><br><br><br><br>"
);
const editorConfig = ref({
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "|",
      "outdent",
      "indent",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
    ],
  },
});

// Computed property to disable the Save button if content is empty or only contains empty tags
const isSaveButtonDisabled = computed(() => {
  return content.value.replace(/<[^>]*>/g, "").trim() === "";
});

function submitBookReview() {
  console.log("submit!", content.value);
}
</script>

<style scoped>
.v-card-title {
  background-color: rgb(180, 60, 0);
  color: #fff;
}

.v-btn {
  margin-top: 20px;
}
</style>