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
          :model="user"
          ref="userForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Username" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>

          <el-form-item label="Role" prop="role">
            <v-autocomplete
              v-model="selectedRoles"
              label="Select your role"
              item-value="id"
              item-title="name"
              :items="roles"
              multiple
            ></v-autocomplete>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email"></el-input>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input v-model="user.password" type="password"></el-input>
            <template v-if="isEdit">
              <div style="color: #888">
                Leave blank to use the current password.
              </div>
            </template>
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
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { get, post, put } from "@/net/index.js";
import {
  capitalizeRouteName,
  getRouteNameForApi,
  getTextRequiredRule,
  validateNumber,
} from "@/assets/js/admin/common_edit_add.js";
import * as commonEditAddFunction from "@/assets/js/admin/common_edit_add.js";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const userForm = ref(null);

const selectedRoles = ref([]);
const roles = ref([]);

const store = useStore();
const userData = computed(() => store.state.user || {});
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const user = ref({
  id: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  bookshelfVisible: false,
  reviewVisible: false,
  contributionVisible: false,
  avatar: "", // this is url from database
  userPivotRoles: null,
});

const rules = {
  username: [getTextRequiredRule("Please enter the username")],
  email: [
    getTextRequiredRule("Please enter the email"),
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
  ],
  password: [getPasswordRules()],
  phoneNumber: [
    getTextRequiredRule("Please enter the phone number"),
    { validator: validateNumber, trigger: "blur" },
  ],
};

const previewImage = () =>
  commonEditAddFunction.previewImage(files, user.value.avatar, ossEndpoint);

const submitForm = () => {
  userForm.value.validate((valid) => {
    if (valid) {
      const formData = new FormData();

      // Append user data to formData
      Object.keys(user.value).forEach((key) => {
        if (key !== "userPivotRoles" && key !== "roleIds") {
          // Check to exclude userPivotRoles
          formData.append(key, user.value[key]);
        }
      });

      // Append role ids to formData
      formData.append("roleIds", selectedRoles.value);

      // Append file data if exists
      if (files && files.value.length > 0 && files.value[0].raw) {
        formData.append("image", files.value[0].raw);
      }

      const successCallbackForEdit = () => {
        ElMessage.success("Updated successfully");
        fetchItems(true);
        router.push(`/${getRouteNameForApi(route.name)}/${id.value}`);
      };

      const successCallbackForAdd = () => {
        ElMessage.success("Created successfully");
        router.push(`/${getRouteNameForApi(route.name)}`);
      };

      const errorCallback = (error) => {
        ElMessage.error(error);
      };

      if (isEdit.value) {
        put(
          `/api/${getRouteNameForApi(route.name)}/${id.value}/update`,
          formData,
          successCallbackForEdit,
          errorCallback,
          "multipart/form-data"
        );
      } else {
        post(
          `/api/${getRouteNameForApi(route.name)}/create`,
          formData,
          successCallbackForAdd,
          errorCallback,
          "multipart/form-data"
        );
      }
    } else {
      ElMessage.error("Please correct the errors in the form");
      return false;
    }
  });
};

function getPasswordRules() {
  if (isEdit.value) {
    // Rules for editing
    return [
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(); // Accepts empty value, meaning use the old password
          } else if (value.length < 6) {
            callback(new Error("The password must be at least 6 characters"));
          } else {
            callback(); // Passes validation
          }
        },
        trigger: "blur",
      },
    ];
  } else {
    // Rules for adding new entry
    return [
      getTextRequiredRule("Please enter the password"),
      {
        min: 6,
        message: "The password must be at least 6 characters",
        trigger: "blur",
      },
    ];
  }
}

// Fetch user data
const fetchItems = (isUpdateStore) => {
  get(
    `/api/${getRouteNameForApi(route.name)}/${id.value}`,
    (data) => {
      user.value = data;
      user.value.password = "";

      user.value.userPivotRoles.forEach((userPivotRole) => {
        selectedRoles.value.push(userPivotRole.roleId);
      });

      // Update the image preview
      if (user.value.avatar) {
        previewImage(user.value.avatar);
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

// Fetch role selections
const fetchRoleSelections = () => {
  get(
    `/api/roles/getAllRoles`,
    (data) => {
      roles.value = data;
    },
    (message) => {
      ElMessage.error(message);
    }
  );
};

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    fetchItems();
    fetchRoleSelections();
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

.el-switch {
  margin-left: 10px;
}
</style>
