<template>
  <div>
    <v-container>
      <el-form :model="user" ref="userForm" :rules="rules" label-position="top">
        <el-form-item label="Username" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" disabled></el-input>
        </el-form-item>

        <el-form-item label="Phone Number" prop="phoneNumber">
          <el-input v-model="user.phoneNumber"></el-input>
        </el-form-item>

        <el-form-item prop="bookshelfVisible">
          <label>Set bookshelf visiblity to public</label>
          <el-switch v-model="user.bookshelfVisible"></el-switch>
        </el-form-item>

        <el-form-item prop="reviewVisible">
          <label>Set book review visiblity to public</label>
          <el-switch v-model="user.reviewVisible"></el-switch>
        </el-form-item>

        <el-form-item prop="contributionVisible">
          <label>Set charitable contribution visiblity to public</label>
          <el-switch v-model="user.contributionVisible"></el-switch>
        </el-form-item>

        <el-form-item label="Avatar" prop="avatar">
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { get, put } from "@/net/index.js";
import {
  getTextRequiredRule,
  validateNumber,
} from "@/assets/js/admin/common_edit_add.js";

const store = useStore();
const userData = computed(() => store.state.user || {});

const userForm = ref(null);
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const user = ref({
  id: "",
  username: "",
  email: "",
  phoneNumber: "",
  bookshelfVisible: false,
  reviewVisible: false,
  contributionVisible: false,
  avatar: "", // this is url from database
});

const rules = {
  username: [getTextRequiredRule("Please enter the username")],
  phoneNumber: [
    getTextRequiredRule("Please enter the phone number"),
    { validator: validateNumber, trigger: "blur" },
  ],
};

const submitForm = () => {
  userForm.value.validate((valid) => {
    if (valid) {
      const formData = new FormData();

      // Append user data to formData
      Object.keys(user.value).forEach((key) => {
        formData.append(key, user.value[key]);
      });

      // Append file data if exists
      if (files && files.value.length > 0 && files.value[0].raw) {
        formData.append("image", files.value[0].raw);
      }

      const successCallback = () => {
        ElMessage.success("Updated successfully");

        fetchItems(true);
      };

      const errorCallback = (error) => {
        ElMessage.error(error);
      };

      put(
        `/api/profile-detail/updateUserDetail/${user.value.id}`,
        formData,
        successCallback,
        errorCallback,
        "multipart/form-data"
      );
    } else {
      ElMessage.error("Please correct the errors in the form");
      return false;
    }
  });
};

const fetchItems = (isUpdateStore = false) => {
  get(
    `/api/profile-detail/getUserDetail/${userData.value.id}`,
    (data) => {
      user.value = data;
      user.value.password = "";

      // Update the image preview
      if (user.value.avatar) {
        previewImage();
      }

      // Update store
      if (isUpdateStore) {
        store.dispatch("loginUser", {
          id: user.value.id,
          username: user.value.username,
          email: user.value.email,
          avatar: user.value.avatar,
          roles: userData.value.roles,
        });
      }
    },
    (error) => {
      ElMessage.error(error);
    }
  );
};

const previewImage = () => {
  files.value = [
    {
      url: ossEndpoint + user.value.avatar,
    },
  ];
};

onMounted(() => {
  fetchItems();
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
