<template>
  <el-header class="admin_header">
    <div>
      <el-dropdown>
        <div class="admin_account">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="admin_info">
            Admin
            <el-icon>
              <ArrowDownBold />
            </el-icon>
          </span>
        </div>

        <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="danger" @click="userLogout">Logout</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { logout } from "@/net";
import router from "@/router";
import { ArrowDownBold } from "@element-plus/icons-vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton } from "element-plus";

function userLogout() {
  logout(() => router.push("/"));
}
</script>

<style scoped>
.admin_header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
}

.admin_account {
  display: flex;
  align-items: center;
}

.admin_info {
  margin-left: 8px;
}
</style>
