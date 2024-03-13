<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">{{ isEdit ? "Edit" : "Add" }} Book</h1>

      <div class="page_actions">
        <router-link :to="{ path: '/books' }">
          <v-btn color="warning" prepend-icon="mdi-menu">
            Return to list
          </v-btn>
        </router-link>
      </div>
    </div>

    <v-card class="page_body" elevation="3">
      <v-container>
        <el-form
          :model="book"
          ref="bookForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Title" prop="title">
            <el-input v-model="book.title"></el-input>
          </el-form-item>

          <el-form-item label="Author" prop="author">
            <el-input v-model="book.author"></el-input>
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <el-input type="textarea" v-model="book.description"></el-input>
          </el-form-item>

          <el-form-item label="Publisher" prop="publisher">
            <el-input v-model="book.publisher"></el-input>
          </el-form-item>

          <el-form-item label="ISBN" prop="isbn">
            <el-input v-model="book.isbn"></el-input>
          </el-form-item>

          <el-form-item label="Publication Date" prop="publicationDate">
            <el-date-picker
              v-model="book.publicationDate"
              type="date"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="Page Count" prop="page">
            <el-input v-model="book.page" type="number"></el-input>
          </el-form-item>

          <el-form-item label="Language" prop="language">
            <el-select v-model="book.language" placeholder="Select Language">
              <el-option
                v-for="item in languages"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Image URL" prop="imgUrl">
            <el-input v-model="book.imgUrl" @change="previewImage"></el-input>
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Image Preview"
              class="preview_image"
            />
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
import { get, post, put } from "@/net/index.js";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const bookForm = ref(null);
const imagePreview = ref("");

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
];

const book = ref({
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  publicationDate: "",
  page: 0,
  language: "",
  imgUrl: "",
});

const rules = {
  title: [
    { required: true, message: "Please enter the title", trigger: "blur" },
  ],
  author: [
    { required: true, message: "Please enter the author", trigger: "blur" },
  ],
  description: [
    {
      required: true,
      message: "Please enter the description",
      trigger: "blur",
    },
  ],
  publisher: [
    { required: true, message: "Please enter the publisher", trigger: "blur" },
  ],
  isbn: [
    { required: true, message: "Please enter the ISBN", trigger: "blur" },
    {
      pattern: /^\d{10}(\d{3})?$/,
      message: "Please enter a valid ISBN",
      trigger: "blur",
    },
  ],
  publicationDate: [
    {
      required: true,
      message: "Please select the publication date",
      trigger: "change",
    },
  ],
  page: [
    { required: true, message: "Please enter the page count", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/, // Positive integers greater than zero
      message: "Page count must greater than zero",
      trigger: "blur",
    },
  ],
  language: [
    {
      required: true,
      message: "Please select the language",
      trigger: "change",
    },
  ],
  imgUrl: [
    { required: true, message: "Please enter the image URL", trigger: "blur" },
    { type: "url", message: "Please enter a valid URL", trigger: "blur" },
  ],
};

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    // Fetch book data based on id
    get(
      `/api/books/${id.value}`,
      (data) => {
        book.value = data;
        imagePreview.value = book.value.imgUrl; // Update the image preview
      },
      (error) => {
        ElMessage.error(error);
      }
    );
  }
});

function submitForm() {
  bookForm.value.validate((valid) => {
    if (valid) {
      const successCallback = () => {
        ElMessage.success("Saved successfully");
        router.push(`/books/${id.value}`);
      };

      const errorCallback = (error) => {
        ElMessage.error(error);
      };

      if (isEdit.value) {
        put(
          `/api/books/${id.value}/update`,
          book.value,
          successCallback,
          errorCallback
        );
      } else {
        post("/api/books/create", book.value, successCallback, errorCallback);
      }
    } else {
      ElMessage.error("Please correct the errors in the form");
      return false;
    }
  });
}

function previewImage() {
  // Set imagePreview to the URL entered by the user
  imagePreview.value = book.value.imgUrl;
}
</script>

<style scoped>
@import "@/assets/css/admin/common_edit_add.css";
</style>
