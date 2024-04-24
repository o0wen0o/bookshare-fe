<template>
  <v-card elevation="2">
    <v-card-title>Write a book review</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <el-form
        :model="bookReview"
        ref="bookReviewForm"
        :rules="rules"
        label-position="top"
      >
        <!-- Show autocomplete when creating a new review -->
        <el-form-item label="Selected Book" prop="bookId" v-if="!isEdit">
          <v-autocomplete
            v-model="bookReview.bookId"
            label="Select the related book"
            item-value="id"
            item-title="title"
            :items="books"
            :loading="loading"
            :search="searchBook"
          ></v-autocomplete>
        </el-form-item>

        <!-- Show text field with the book title when editing -->
        <el-form-item label="Selected Book" prop="bookId" v-else>
          <el-input v-model="bookReview.title" disabled></el-input>
        </el-form-item>

        <el-form-item label="Text" prop="text"
          ><ckeditor
            :editor="editor"
            v-model="bookReview.text"
            :config="editorConfig"
          ></ckeditor
        ></el-form-item>

        <el-form-item>
          <el-button
            type="success"
            :disabled="isSaveButtonDisabled"
            @click="submitBookReview"
            >Save</el-button
          >
        </el-form-item>
      </el-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get, post, put } from "@/net/index.js";
import { getTextRequiredRule } from "@/assets/js/admin/common_edit_add.js";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import moment from "moment";

const ckeditor = CKEditor.component;
const editor = ClassicEditor;

const store = useStore();
const userData = computed(() => store.state.user || {});

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const bookReviewId = ref(null);
const bookReviewForm = ref(null);

const bookReview = ref({
  id: "",
  title: "",
  text: "<p>Content of your new book review...</p><p>&nbsp;</p>",
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

// Computed property to disable the Save button if content is empty or only contains empty tags
const isSaveButtonDisabled = computed(() => {
  const isSelectEmpty =
    bookReview.value.bookId === null || bookReview.value.bookId === "";

  const isContentEmpty =
    bookReview.value.text.replace(/<[^>]*>/g, "").trim() === "";
    
  return isSelectEmpty || isContentEmpty;
});

function submitBookReview() {
  bookReviewForm.value.validate((valid) => {
    if (valid) {
      // Use regular expressions to remove <br> and <p>&nbsp;</p> from start and end
      let cleanedText = bookReview.value.text.trim();

      // Regular expressions for matching patterns to remove
      const leadingTagsPattern = /^(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+/;
      const trailingTagsPattern = /(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+$/;

      // Remove leading and trailing <br> and <p>&nbsp;</p>
      cleanedText = cleanedText.replace(leadingTagsPattern, "");
      cleanedText = cleanedText.replace(trailingTagsPattern, "");

      const formData = new FormData();
      formData.append("id", bookReview.value.id);
      formData.append("text", cleanedText);
      formData.append("userId", userData.value.id);
      formData.append("bookId", bookReview.value.bookId);

      if (isEdit.value) {
        // Append updated date to the form data
        formData.append("updatedDate", moment().format("YYYY-MM-DD HH:mm:ss"));

        put(
          "/api/profile-book-review/updateBookReview",
          formData,
          () => {
            ElMessage.success("Book review updated successfully");
            router.push({ name: "book-review" });
          },
          (message) => {
            ElMessage.error(message);
          }
        );
      } else {
        // Append created date to the form data
        formData.append("createdDate", moment().format("YYYY-MM-DD HH:mm:ss"));

        post(
          "/api/profile-book-review/createBookReview",
          formData,
          () => {
            ElMessage.success("Book review created successfully");
            router.push({ name: "book-review" });
          },
          (message) => {
            ElMessage.error(message);
          }
        );
      }
    }
  });
}

// Fetch book reviews from backend
const getBookReviewById = () => {
  const params = {
    id: bookReviewId.value,
  };

  get(
    `/api/profile-book-review/getBookReviewById`,
    (data) => {
      bookReview.value = data;
    },
    (error) => {
      ElMessage.error(error);
    },
    params
  );
};

// The pagination funciton is not implemented yet
const searchBook = ref("");
const books = ref([]);

const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(30);

// Fetch items (book selections) from backend
const fetchBookSelections = () => {
  if (loading.value) return; // Prevent duplicate calls
  loading.value = true;

  const params = {
    current: page.value,
    size: itemsPerPage.value,
    filter: searchBook.value,
  };

  get(
    `/api/profile-book-review/getBookSelections`,
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
  bookReviewId.value = route.params.id;
  isEdit.value = Boolean(bookReviewId.value);

  if (isEdit.value) {
    // Fetch book review based on book review id
    getBookReviewById();
  } else {
    fetchBookSelections();
  }
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