<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">
        {{ isEdit ? "Edit" : "Add" }} {{ capitalizeRouteName($route.name) }}s
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
          :model="fundraisingProjectProgress"
          ref="fundraisingProjectProgressForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Title" prop="title">
            <el-input v-model="fundraisingProjectProgress.title"></el-input>
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <el-input
              type="textarea"
              v-model="fundraisingProjectProgress.description"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="Fundraising Project ID"
            prop="fundraisingProjectId"
          >
            <el-select
              v-model="fundraisingProjectProgress.fundraisingProjectId"
              filterable
              placeholder="Select the related book"
              :loading="loading"
            >
              <el-option
                v-for="fundraisingProject in fundraisingProjects"
                :key="fundraisingProject.id"
                :label="fundraisingProject.projectName"
                :value="fundraisingProject.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Image URL" prop="imgUrl">
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

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const fundraisingProjectProgressForm = ref(null);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const fundraisingProjectProgress = ref({
  id: "",
  title: "",
  description: "",
  imgUrl: "",
  fundraisingProjectId: "",
});

const rules = {
  title: [getTextRequiredRule("Please enter the title")],
  description: [getTextRequiredRule("Please enter the description")],
  fundraisingProjectId: [getTextRequiredRule("Please select the project")],
};

const previewImage = () =>
  commonEditAddFunction.previewImage(
    files,
    fundraisingProjectProgress.value.imgUrl,
    ossEndpoint
  );

const submitForm = () => {
  commonEditAddFunction.submitForm(
    fundraisingProjectProgressForm,
    fundraisingProjectProgress,
    id,
    isEdit,
    router,
    route,
    files,
    "multipart/form-data"
  );
};

// Fetch fundraising project progress data from backend
const fetchItems = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      fundraisingProjectProgress.value = data;

      // Update the image preview
      if (fundraisingProjectProgress.value.imgUrl) {
        previewImage(fundraisingProjectProgress.value.imgUrl);
      }
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

// The pagination funciton is not implemented yet
const fundraisingProjects = ref([]);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(30);

const params = {
  current: page.value,
  size: itemsPerPage.value,
  // filter: search.value,
};

// Fetch fundraising project progress selection data
const fetchFundraisingProjectSelections = () => {
  get(
    `/api/${getRouteNameForApi(route.name)}/getFundraisingProjectSelections`,
    (data) => {
      if (data.records && data.records.length > 0) {
        fundraisingProjects.value = [
          ...fundraisingProjects.value,
          ...data.records,
        ];
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

  fetchFundraisingProjectSelections();
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

.el-switch {
  margin-left: 10px;
}
</style>
