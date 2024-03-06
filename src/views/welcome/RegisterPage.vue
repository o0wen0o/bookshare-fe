<template>
  <div style="text-align: center; margin: 0 20px">
    <div style="margin-top: 100px">
      <div style="font-size: 25px; font-weight: bold">Register new account</div>
      <div style="font-size: 14px; color: grey">
        Welcome to register BookShare, please fill in the relevant information below
      </div>
    </div>

    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            :maxlength="20"
            type="text"
            placeholder="Username"
          >
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            :maxlength="20"
            type="password"
            placeholder="Password"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password_repeat">
          <el-input
            v-model="form.password_repeat"
            :maxlength="20"
            type="password"
            placeholder="Repeat password"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            :maxlength="50"
            type="email"
            placeholder="Email address"
          >
            <template #prefix>
              <el-icon>
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row style="width: 100%">
            <el-col :span="11">
              <el-input
                v-model="form.code"
                :maxlength="6"
                type="text"
                placeholder="Verification code"
              >
                <template #prefix>
                  <el-icon>
                    <EditPen />
                  </el-icon>
                </template>
              </el-input>
            </el-col>

            <el-col :span="12" style="margin-left: 12px">
              <el-button
                type="success"
                @click="validateEmail"
                style="width: 100%"
                :disabled="!isEmailValid || coldTime > 0"
              >
                {{
                  coldTime > 0
                    ? "Please wait " + coldTime + " seconds"
                    : "Get verification code"
                }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-top: 80px">
      <el-button style="width: 270px" type="warning" @click="register" plain
        >Sign Up</el-button
      >
    </div>

    <div style="margin-top: 20px">
      <span style="font-size: 14px; line-height: 15px; color: grey"
        >Have an account?
      </span>
      <el-link type="primary" style="translate: 0 -2px" @click="router.push('/')"
        >Sign In</el-link
      >
    </div>
  </div>
</template>

<script setup>
import { EditPen, Lock, Message, User } from "@element-plus/icons-vue";
import router from "@/router";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { get, post } from "@/net";

const form = reactive({
  username: "",
  password: "",
  password_repeat: "",
  email: "",
  code: "",
});

const validateUsername = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please enter username"));
  } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error("Username can only be in Chinese/English"));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please enter again"));
  } else if (value !== form.password) {
    callback(new Error("The entered passwords are inconsistent"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    {
      validator: validateUsername,
      trigger: ["blur", "change"],
    },
    {
      min: 5,
      max: 20,
      message: "Username must be longer than 5 characters",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter password",
      trigger: "blur",
    },
    {
      min: 6,
      max: 20,
      message: "Password length must be between 6-20 characters",
      trigger: ["blur", "change"],
    },
  ],
  password_repeat: [
    {
      validator: validatePassword,
      trigger: ["blur", "change"],
    },
  ],
  email: [
    {
      required: true,
      message: "Please enter your email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please enter a valid email",
      trigger: ["blur", "change"],
    },
  ],
  code: [
    {
      required: true,
      message: "Please enter verification code",
      trigger: "blur",
    },
  ],
};

const formRef = ref();
const isEmailValid = ref(false);
const coldTime = ref(0);

const onValidate = (prop, isValid) => {
  if (prop === "email") isEmailValid.value = isValid;
};

const register = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/register",
        {
          username: form.username,
          password: form.password,
          email: form.email,
          code: form.code,
        },
        () => {
          ElMessage.success("Registration successful, welcome to join us!");
          router.push("/");
        }
      );
    } else {
      ElMessage.warning("Please fill in the registration form completely");
    }
  });
};

const validateEmail = () => {
  coldTime.value = 60;
  get(
    `/api/auth/ask-code?email=${form.email}&type=register`,
    () => {
      ElMessage.success({
        message: `The verification code has been sent to your email: ${form.email}, please check it`,
        duration: 5000,
      });

      const handle = setInterval(() => {
        coldTime.value--;
        if (coldTime.value === 0) {
          clearInterval(handle);
        }
      }, 1000);
    },
    undefined,
    (message) => {
      ElMessage.warning(message);
      coldTime.value = 0;
    }
  );
};
</script>

<style scoped></style>
