<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">
        {{ isEdit ? "Edit" : "Add" }} {{ capitalizeRouteName($route.name) }}
      </h1>

      <div class="page_actions">
        <router-link :to="{ path: `/${getRouteNameForApi(route.name)}` }">
          <v-btn color="warning" prepend-icon="mdi-menu">
            Return to list
          </v-btn>
        </router-link>
      </div>
    </div>

    <v-card class="page_body" elevation="3">
      <v-container>
        <el-form
          :model="post"
          ref="postForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="ID" prop="id" v-if="isEdit">
            <el-input v-model="post.id" disabled></el-input>
          </el-form-item>

          <el-form-item label="Content" prop="content">
            <ckeditor
              :editor="editor"
              v-model="post.content"
              :config="editorConfig"
            ></ckeditor>
          </el-form-item>

          <el-form-item label="User ID" prop="userId">
            <v-autocomplete
              v-model="post.userId"
              label="Select the related user"
              item-value="id"
              item-title="username"
              :items="users"
              :loading="loading"
              :search="searchUser"
            ></v-autocomplete>
          </el-form-item>

          <el-form-item label="Book ID" prop="bookId">
            <v-autocomplete
              v-model="post.bookId"
              label="Select the related book"
              item-value="id"
              item-title="title"
              :items="books"
              :loading="loading"
              :search="searchBook"
            ></v-autocomplete>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="submitForm">Save</el-button>
          </el-form-item>
        </el-form>
      </v-container>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";
import {
  capitalizeRouteName,
  getRouteNameForApi,
  getTextRequiredRule,
} from "@/assets/js/admin/common_edit_add.js";
import * as commonEditAddFunction from "@/assets/js/admin/common_edit_add.js";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ckeditor = CKEditor.component;
const editor = ClassicEditor;

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const postForm = ref(null);

const post = ref({
  id: "",
  content: "<p>Content of your new post...</p><p>&nbsp;</p>",
  userId: "",
  bookId: "",
});

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

const rules = {
  content: [getTextRequiredRule("Please enter the title")],
  userId: [getTextRequiredRule("Please select the user")],
  bookId: [getTextRequiredRule("Please select the book")],
};

const submitForm = () => {
  // Use regular expressions to remove <br> and <p>&nbsp;</p> from start and end
  let cleanedContent = post.value.content.trim();

  // Regular expressions for matching patterns to remove
  const leadingTagsPattern = /^(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+/;
  const trailingTagsPattern = /(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+$/;

  // Remove leading and trailing <br> and <p>&nbsp;</p>
  cleanedContent = cleanedContent.replace(leadingTagsPattern, "");
  cleanedContent = cleanedContent.replace(trailingTagsPattern, "");
  post.value.content = cleanedContent;

  commonEditAddFunction.submitForm(postForm, post, id, isEdit, router, route);
};

// The pagination funciton is not implemented yet
const searchUser = ref("");
const searchBook = ref("");

const books = ref([]);
const users = ref([]);

const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(30);

const params = {
  current: page.value,
  size: itemsPerPage.value,
  // filter: search.value,
};

// Fetch items (books) from backend
const fetchItems = () => {
  if (loading.value) return; // Prevent duplicate calls
  loading.value = true;

  // Fetch post data based on id
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      post.value = data;
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

// Fetch user selection data
const fetchUserSelections = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/getUserSelections`,
    (data) => {
      if (data.records && data.records.length > 0) {
        users.value = [...users.value, ...data.records];
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

// Fetch books selection data
const fetchBookSelections = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/getBookSelections`,
    (data) => {
      if (data.records && data.records.length > 0) {
        books.value = [...books.value, ...data.records];
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

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    fetchItems();
  }

  fetchUserSelections();
  fetchBookSelections();
});
</script>

<style scoped>
@import "@/assets/css/admin/common_edit_add.css";
</style>
