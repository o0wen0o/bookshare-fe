<template>
  <el-header class="admin_header">
    <div>
      <v-menu min-width="400px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="48px">
              <v-img
                alt="Avatar"
                src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar size="40px">
                <v-img
                  alt="Avatar"
                  src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                ></v-img>
              </v-avatar>

              <h3>{{ userData.username || "John" }}</h3>

              <p class="text-caption mt-1">
                {{ userData.email || "john@hotmail.com" }}
              </p>

              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="profileInfo">
                Profile Info
              </v-btn>

              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded color="red" @click="logoutAccount">
                Logout Account
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from "vue";
import { logout } from "@/net";
import router from "@/router";
import { useStore } from "vuex";

const store = useStore();
const userData = computed(() => store.state.user || {});

function profileInfo() {
  console.log(userData.value.username);
  console.log(userData.value.email);
  console.log(userData.value.roles);
}

function logoutAccount() {
  logout(() => {
    router.push("/");
  });
}
</script>

<style scoped>
.admin_header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
</style>
