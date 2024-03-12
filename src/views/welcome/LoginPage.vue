<template>
  <div style="text-align: center; margin: 0 20px">
    <div style="margin-top: 150px">
      <div style="font-size: 25px; font-weight: bold">Sign In</div>
      <div style="font-size: 14px; color: grey">
        Enter your email and password to enter the system.
      </div>
    </div>

    <!-- Sign in form -->
    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            maxlength="50"
            type="text"
            placeholder="Email"
          >
            <template #prefix>
              <el-icon>
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            maxlength="20"
            style="margin-top: 10px"
            placeholder="Password"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-row style="margin-top: 5px">
          <el-col :span="12" style="text-align: left">
            <el-form-item prop="remember">
              <el-checkbox v-model="form.remember" label="Remember me" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="text-align: right">
            <el-link @click="router.push('/forget')">Forgot Password?</el-link>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div style="margin-top: 40px">
      <el-button @click="userLogin()" style="width: 270px" type="success" plain
        >Login</el-button
      >
    </div>

    <el-divider>
      <span style="color: grey; font-size: 13px">No Account?</span>
    </el-divider>

    <div>
      <el-button
        style="width: 270px"
        @click="router.push('/register')"
        type="warning"
        plain
        >Sign Up</el-button
      >
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { useStore } from "vuex";
import { reactive, ref } from "vue";
import { login } from "@/net/index.js";
import { Message, Lock } from "@element-plus/icons-vue";

const store = useStore();
const formRef = ref();
const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const rules = {
  email: [
    {
      required: true,
      message: "Please enter your email",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter your password",
    },
  ],
};

function userLogin() {
  formRef.value.validate((isValid) => {
    if (isValid) {
      login(form.email, form.password, form.remember, (data) => {
        // Store user data in Vuex
        store.dispatch("loginUser", {
          username: data.username,
          email: data.email,
          roles: data.roles,
        });

        // Check if the user has an admin role
        if (data.roles && data.roles.includes("Admin")) {
          router.push("/admin");
        } else {
          router.push("/index");
        }
      });
    }
  });
}
</script>

<style scoped></style>
