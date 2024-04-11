<template>
  <div>
    <div class="page_header">
      <h1 class="page_title">
        {{ isEdit ? "Edit" : "Add" }} {{ capitalizeRouteName(route.name) }}
      </h1>
      <div class="page_actions">
        <router-link :to="{ path: `/${getRouteNameForApi(route.name)}` }">
          <v-btn color="warning" prepend-icon="mdi-menu">Return to list</v-btn>
        </router-link>
      </div>
    </div>

    <v-card class="page_body" elevation="3">
      <v-container>
        <el-form
          :model="fundraisingOrganizer"
          ref="fundraisingOrganizerForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Username" prop="username">
            <el-input v-model="fundraisingOrganizer.username"></el-input>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="fundraisingOrganizer.email"></el-input>
          </el-form-item>

          <el-form-item label="Phone Number" prop="phoneNumber">
            <el-input v-model="fundraisingOrganizer.phoneNumber"></el-input>
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
  validatePhoneNumber,
} from "@/assets/js/admin/common_edit_add.js";
import * as commonEditAddFunction from "@/assets/js/admin/common_edit_add.js";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const fundraisingOrganizerForm = ref(null);

const fundraisingOrganizer = ref({
  id: "",
  username: "",
  email: "",
  phoneNumber: "",
});

const rules = {
  username: [getTextRequiredRule("Please enter the username")],
  email: [
    getTextRequiredRule("Please enter the email"),
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
  ],
  phoneNumber: [
    getTextRequiredRule("Please enter the phone number"),
    { validator: validatePhoneNumber, trigger: "blur" },
  ],
};

const submitForm = () => {
  commonEditAddFunction.submitForm(
    fundraisingOrganizerForm,
    fundraisingOrganizer,
    id,
    isEdit,
    router,
    route
  );
};

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    // Fetch fundraising organizer data based on id
    get(
      `/api/${getRouteNameForApi(route.name)}/${id.value}`,
      (data) => {
        fundraisingOrganizer.value = data;
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
