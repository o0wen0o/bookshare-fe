<template>
  <v-card elevation="2">
    <v-card-title>Create a post</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-autocomplete
        v-model="selectedBook"
        label="Select the related book"
        item-value="id"
        item-text="title"
        :items="items"
        :loading="loading"
        :search="search"
        return-object
      ></v-autocomplete>

      <ckeditor
        :editor="editor"
        v-model="content"
        :config="editorConfig"
      ></ckeditor>

      <v-btn
        color="success"
        :disabled="isPostButtonDisabled"
        @click="submitPost"
      >
        Post
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { get, post } from "@/net/index.js";
import { useStore } from "vuex";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import moment from "moment";

const ckeditor = CKEditor.component;
const editor = ClassicEditor;

const router = useRouter();
const store = useStore();
const userData = computed(() => store.state.user || {});
const content = ref("<p>Content of your new post...</p><p>&nbsp;</p>");

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

// Computed property to disable the Post button if content is empty or only contains empty tags
const isPostButtonDisabled = computed(() => {
  const isSelectEmpty = selectedBook.value === null;
  const isContentEmpty = content.value.replace(/<[^>]*>/g, "").trim() === "";
  return isSelectEmpty || isContentEmpty;
});

const selectedBook = ref(null);
const search = ref("");
const loading = ref(false);
const items = ref([]);
const page = ref(1);
const itemsPerPage = ref(30); // The pagination funciton is not implemented yet

// Fetch items (books) from backend
const fetchItems = () => {
  if (loading.value) return; // Prevent duplicate calls
  loading.value = true;

  const params = {
    current: page.value,
    size: itemsPerPage.value,
    filter: search.value,
  };

  get(
    `/api/community/getBookSelections`,
    (data) => {
      if (data.records && data.records.length > 0) {
        items.value = [...items.value, ...data.records];
      } else {
        // Handle the end of the list (no more items to load)
      }
      loading.value = false;
    },
    (message) => {
      ElMessage.warning(message);
      loading.value = false;
    },
    params
  );
};

function submitPost() {
  // Use regular expressions to remove <br> and <p>&nbsp;</p> from start and end
  let cleanedContent = content.value.trim();

  // Regular expressions for matching patterns to remove
  const leadingTagsPattern = /^(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+/;
  const trailingTagsPattern = /(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+$/;

  // Remove leading and trailing <br> and <p>&nbsp;</p>
  cleanedContent = cleanedContent.replace(leadingTagsPattern, "");
  cleanedContent = cleanedContent.replace(trailingTagsPattern, "");

  const formData = new FormData();
  formData.append("content", cleanedContent);
  formData.append("createdDate", moment().format("YYYY-MM-DD HH:mm:ss"));
  formData.append("userId", userData.value.id);
  formData.append("bookId", selectedBook.value.id);

  post(
    "/api/community/createPost",
    formData,
    () => {
      ElMessage.success("Post created successfully");
      router.push({ name: "community" });
    },
    (message) => {
      ElMessage.error(message);
    }
  );
}

onMounted(() => {
  fetchItems();
});
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