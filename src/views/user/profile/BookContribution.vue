<template>
  <v-card elevation="2" class="pa-3">
    <v-card-title>Book Contribution</v-card-title>
    <v-divider></v-divider>

    <v-container>
      <el-form :model="book" ref="bookForm" :rules="rules" label-position="top">
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

        <el-form-item label="Image Upload" prop="imgUrl">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="files"
            @change="handlePictureChange"
          >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div style="display: contents">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="() => handlePictureRemove(file)"
                  >
                    <el-icon><delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="submitForm">Save</el-button>
        </el-form-item>
      </el-form>

      <el-dialog v-model="dialogImageVisible">
        <img :src="dialogImageUrl" alt="Preview Image" class="dialog_image" />
      </el-dialog>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { get } from "@/net/index.js";
import {
  capitalizeRouteName,
  getRouteNameForApi,
  getTextRequiredRule,
} from "@/assets/js/admin/common_edit_add.js";
import * as commonEditAddFunction from "@/assets/js/admin/common_edit_add.js";
import moment from "moment";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const bookForm = ref(null);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

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
  title: [getTextRequiredRule("Please enter the title")],
  author: [getTextRequiredRule("Please enter the author")],
  description: [getTextRequiredRule("Please enter the description")],
  publisher: [getTextRequiredRule("Please enter the publisher")],
  isbn: [
    getTextRequiredRule("Please enter the ISBN"),
    {
      pattern: /^\d{10}(\d{3})?$/,
      message: "Please enter a valid ISBN",
      trigger: "blur",
    },
  ],
  publicationDate: [
    getTextRequiredRule("Please select the publication date", "change"),
  ],
  page: [
    getTextRequiredRule("Please enter the page count"),
    {
      pattern: /^[1-9]\d*$/, // Positive integers greater than zero
      message: "Page count must greater than zero",
      trigger: "blur",
    },
  ],
  language: [getTextRequiredRule("Please select the language", "change")],
};

const previewImage = () =>
  commonEditAddFunction.previewImage(files, book.value.imgUrl, ossEndpoint);

const submitForm = () => {
  // Check and format publicationDate if it exists
  if (book.value.publicationDate) {
    book.value.publicationDate = moment(book.value.publicationDate).format(
      "YYYY-MM-DD"
    );
  }

  commonEditAddFunction.submitForm(
    bookForm,
    book,
    id,
    isEdit,
    router,
    route,
    files,
    "multipart/form-data"
  );
};

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    // Fetch book data based on id
    get(
      `/api/${getRouteNameForApi(route.name)}/${id.value}`,
      (data) => {
        book.value = data;

        // Update the image preview
        if (book.value.imgUrl) {
          previewImage(book.value.imgUrl);
        }
      },
      (error) => {
        ElMessage.error(error);
      }
    );
  }
});

// Below are for Image upload
const dialogImageUrl = ref("");
const dialogImageVisible = ref(false);
const disabled = ref(false);
const files = ref([]);

const handlePictureChange = (file, fileList) => {
  // Ensure only the last selected file is in the list
  files.value = [fileList.at(-1)];
};

const handlePictureRemove = (file) => {
  files.value.splice(files.value.indexOf(file), 1);
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogImageVisible.value = true;
};
</script>

<style scoped>
@import "@/assets/css/admin/common_edit_add.css";
</style>
