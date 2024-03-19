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

          <el-form-item label="Bookshelf Visible" prop="bookshelfVisible">
            <el-switch v-model="user.bookshelfVisible"></el-switch>
          </el-form-item>

          <el-form-item label="Review Visible" prop="reviewVisible">
            <el-switch v-model="user.reviewVisible"></el-switch>
          </el-form-item>

          <el-form-item label="Contribution Visible" prop="contributionVisible">
            <el-switch v-model="user.contributionVisible"></el-switch>
          </el-form-item>

          <el-form-item label="Avatar" prop="avatar">
            <el-input v-model="user.avatar"></el-input>
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
  validateNumber,
} from "@/assets/js/admin/common_edit_add.js";
import * as commonEditAddFunction from "@/assets/js/admin/common_edit_add.js";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const userForm = ref(null);

const user = ref({
  id: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  bookshelfVisible: false,
  reviewVisible: false,
  contributionVisible: false,
  avatar: "",
});

const rules = {
  username: [getTextRequiredRule("Please enter the username")],
  email: [
    getTextRequiredRule("Please enter the email"),
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
  ],
  password: [
    getPasswordRules(),
  ],
  phoneNumber: [
    getTextRequiredRule("Please enter the phone number"),
    { validator: validateNumber, trigger: "blur" },
  ],
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

const submitForm = () =>
  commonEditAddFunction.submitForm(userForm, user, id, isEdit, router, route);

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    // Fetch user data based on id
    get(
      `/api/${getRouteNameForApi(route.name)}/${id.value}`,
      (data) => {
        user.value = data;
        console.log(user.value);
      },
      (error) => {
        ElMessage.error(error);
      }
    );
  }
});
</script>

<style scoped>
@import "@/assets/css/admin/common_edit_add.css";
</style>
