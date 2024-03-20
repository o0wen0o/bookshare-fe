<template>
  <div style="width: 100vw; height: 100vh; overflow: hidden; display: flex">
    <div style="flex: 1">
      <el-image style="width: 100%; height: 100%;" fit="cover"
        src="https://bookshare-fyp.oss-ap-southeast-3.aliyuncs.com/welcome_background.jpg" />
    </div>

    <div class="welcome-title">
      <div style="font-size: 30px; font-weight: bold">Welcome to BookShare!</div>
      <div style="font-size: 30px; font-weight: bold">
        Your gateway to a world of literary wonders!
      </div>
      <div style="margin-top: 10px">
        Dive into an extensive collection of books, connect with fellow book enthusiasts,
        and embark on a journey of endless stories.
      </div>
      <div style="margin-top: 5px">
        Login now to unlock the magic of reading and sharing with our vibrant community.
      </div>
    </div>

    <div class="right-card">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <component :is="Component" style="height: 100%" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.right-card {
  width: 400px;
  z-index: 1;
  background-color: var(--el-bg-color);
}

.welcome-title {
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 0 10px black;
}
</style>
