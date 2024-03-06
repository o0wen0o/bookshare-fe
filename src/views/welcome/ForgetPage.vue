<template>
  <div>
    <div style="margin: 80px 20px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Verify Email" />
        <el-step title="Reset Password" />
      </el-steps>
    </div>

    <!-- Verify email -->
    <transition name="el-fade-in-linear" mode="out-in">
      <div style="text-align: center; margin: 0 20px; height: 100%" v-if="active === 0">
        <div style="margin-top: 80px">
          <div style="font-size: 25px; font-weight: bold">Reset Password</div>
          <div style="font-size: 14px; color: grey">
            Enter your email to reset password
          </div>
        </div>

        <div style="margin-top: 50px">
          <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
            <el-form-item prop="email">
              <el-input v-model="form.email" type="email" placeholder="Email address">
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

        <div style="margin-top: 70px">
          <el-button @click="confirmReset()" style="width: 270px" type="warning" plain>
            Next
          </el-button>
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
    </transition>

    <!-- Reset password -->
    <transition name="el-fade-in-linear" mode="out-in">
      <div style="text-align: center; margin: 0 20px; height: 100%" v-if="active === 1">
        <div style="margin-top: 80px">
          <div style="font-size: 25px; font-weight: bold">Reset Password</div>
          <div style="font-size: 14px; color: grey">
            Please fill in your new password and be sure to remember it to prevent loss
          </div>
        </div>

        <div style="margin-top: 50px">
          <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                :maxlength="20"
                type="password"
                placeholder="New Password"
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
                placeholder="Repeat new password"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <div style="margin-top: 70px">
          <el-button @click="doReset()" style="width: 270px" type="danger" plain
            >Reset password now</el-button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { EditPen, Lock, Message } from "@element-plus/icons-vue";
import { get, post } from "@/net";
import { ElMessage } from "element-plus";
import router from "@/router";

const active = ref(0);

const form = reactive({
  email: "",
  code: "",
  password: "",
  password_repeat: "",
});

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
      trigger: ["blur"],
    },
  ],
  password_repeat: [
    {
      validator: validatePassword,
      trigger: ["blur", "change"],
    },
  ],
};

const formRef = ref();
const isEmailValid = ref(false);
const coldTime = ref(0);

const onValidate = (prop, isValid) => {
  if (prop === "email") isEmailValid.value = isValid;
};

const validateEmail = () => {
  coldTime.value = 60;
  get(
    `/api/auth/ask-code?email=${form.email}&type=reset`,
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
    (message) => {
      ElMessage.warning(message);
      coldTime.value = 0;
    }
  );
};

const confirmReset = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/reset-confirm",
        {
          email: form.email,
          code: form.code,
        },
        () => active.value++
      );
    }
  });
};

const doReset = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/reset-password",
        {
          email: form.email,
          code: form.code,
          password: form.password,
        },
        () => {
          ElMessage.success("Password reset successful, please login again");
          router.push("/");
        }
      );
    }
  });
};
</script>

<style scoped></style>
