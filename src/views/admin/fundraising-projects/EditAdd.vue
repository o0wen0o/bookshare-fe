<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">
        {{ isEdit ? "Edit" : "Add" }} {{ capitalizeRouteName(route.name) }}
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
          :model="fundraisingProject"
          ref="fundraisingProjectForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Project Name" prop="projectName">
            <el-input v-model="fundraisingProject.projectName"></el-input>
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <ckeditor
              :editor="editor"
              v-model="fundraisingProject.description"
              :config="editorConfig"
            ></ckeditor>
          </el-form-item>

          <el-form-item label="Start Date" prop="startDate">
            <el-date-picker
              v-model="fundraisingProject.startDate"
              type="date"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="End Date" prop="endDate">
            <el-date-picker
              v-model="fundraisingProject.endDate"
              type="date"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="Goal Amount" prop="goalAmount">
            <el-input-number
              v-model="fundraisingProject.goalAmount"
              :min="0"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="Status" prop="status">
            <el-select v-model="fundraisingProject.status" placeholder="Select">
              <el-option label="Active" value="Active"></el-option>
              <el-option label="Inactive" value="Inactive"></el-option>
              <el-option label="Completed" value="Completed"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Fundraising Organizer ID" prop="fundraisingOrganizerId">
            <el-select
              v-model="fundraisingProject.fundraisingOrganizerId"
              filterable
              placeholder="Select the related organizer"
              :loading="loading"
            >
              <el-option
                v-for="organizer in organizers"
                :key="organizer.id"
                :label="organizer.username"
                :value="organizer.id"
              >
              </el-option>
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
  </div>
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
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ckeditor = CKEditor.component;
const editor = ClassicEditor;

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const fundraisingProjectForm = ref(null);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const fundraisingProject = ref({
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  goalAmount: 0,
  status: "",
  fundraisingOrganizerId: "",
  imgUrl: "",
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
  projectName: [getTextRequiredRule("Please enter the project name")],
  description: [getTextRequiredRule("Please enter the description")],
  startDate: [getTextRequiredRule("Please select the start date")],
  endDate: [getTextRequiredRule("Please select the end date")],
  goalAmount: [getTextRequiredRule("Please enter the goal amount")],
  status: [getTextRequiredRule("Please select the status", "change")],
  fundraisingOrganizerId: [getTextRequiredRule("Please select the organizer")],
};

const previewImage = () =>
  commonEditAddFunction.previewImage(
    files,
    fundraisingProject.value.imgUrl,
    ossEndpoint
  );

const submitForm = () => {
  // Check and format startDate if it exists
  const startDate = fundraisingProject.value.startDate;
  if (startDate) {
    fundraisingProject.value.startDate = moment(startDate).format("YYYY-MM-DD");
  }

  // Check and format endDate if it exists
  const endDate = fundraisingProject.value.endDate;
  if (endDate) {
    fundraisingProject.value.endDate = moment(endDate).format("YYYY-MM-DD");
  }

  // Use regular expressions to remove <br> and <p>&nbsp;</p> from start and end
  let cleanedContent = fundraisingProject.value.description.trim();

  // Regular expressions for matching patterns to remove
  const leadingTagsPattern = /^(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+/;
  const trailingTagsPattern = /(<br\s*\/?>|<p>\&nbsp;<\/p>|\s)+$/;

  // Remove leading and trailing <br> and <p>&nbsp;</p>
  cleanedContent = cleanedContent.replace(leadingTagsPattern, "");
  cleanedContent = cleanedContent.replace(trailingTagsPattern, "");
  fundraisingProject.value.description = cleanedContent;

  commonEditAddFunction.submitForm(
    fundraisingProjectForm,
    fundraisingProject,
    id,
    isEdit,
    router,
    route,
    files,
    "multipart/form-data"
  );
};

// Fetch fundraisingProject data based on id
const fetchItems = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      fundraisingProject.value = data;

      // Update the image preview
      if (fundraisingProject.value.imgUrl) {
        previewImage(fundraisingProject.value.imgUrl);
      }
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

// The pagination funciton is not implemented yet
const organizers = ref([]);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(30);

const params = {
  current: page.value,
  size: itemsPerPage.value,
  // filter: search.value,
};

// Fetch user selection data
const fetchOrganizerSelections = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/getOrganizerSelections`,
    (data) => {
      if (data.records && data.records.length > 0) {
        organizers.value = [...organizers.value, ...data.records];
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

  fetchOrganizerSelections();
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
