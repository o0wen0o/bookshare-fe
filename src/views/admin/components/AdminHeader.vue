<template>
  <el-header class="admin_header">
    <v-btn icon @click="toggleMenuCollapse">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-menu min-width="400px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="48px">
            <v-img
              alt="Avatar"
              src="https://bookshare-fyp.oss-ap-southeast-3.aliyuncs.com/default_avatar.png"
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
                src="https://bookshare-fyp.oss-ap-southeast-3.aliyuncs.com/default_avatar.png"
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
  </el-header>
</template>

<script setup>
import { ref, computed } from "vue";
import { logout } from "@/net";
import router from "@/router";
import { useStore } from "vuex";

const { menuStatus } = defineProps({
  menuStatus: Boolean,
});

const store = useStore();
const userData = computed(() => store.state.user || {});

function toggleMenuCollapse() {
  store.dispatch("toggleMenuCollapse");
}

function profileInfo() {
  router.push(`/users/${userData.value.id}`);
  // console.log(userData.value.id);
  // console.log(userData.value.username);
  // console.log(userData.value.email);
  // console.log(userData.value.roles);
}

function logoutAccount() {
  logout(() => {
    router.push("/user-auth");
  });
}
</script>

<style scoped>
.admin_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
</style>
