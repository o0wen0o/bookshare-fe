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
          :model="role"
          ref="roleForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Role ID" prop="id" v-if="isEdit">
            <el-input v-model="role.id" disabled></el-input>
          </el-form-item>

          <el-form-item label="Role Name" prop="name">
            <el-input v-model="role.name"></el-input>
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

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(null);
const roleForm = ref(null);

const role = ref({
  id: "",
  name: "",
});

const rules = {
  name: [getTextRequiredRule("Please enter the name")],
};

const submitForm = () =>
  commonEditAddFunction.submitForm(roleForm, role, id, isEdit, router, route);

onMounted(() => {
  id.value = route.params.id;
  isEdit.value = Boolean(id.value);

  if (isEdit.value) {
    // Fetch role data based on id
    get(
      `/api/${getRouteNameForApi(route.name)}/${id.value}`,
      (data) => {
        role.value = data;
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
