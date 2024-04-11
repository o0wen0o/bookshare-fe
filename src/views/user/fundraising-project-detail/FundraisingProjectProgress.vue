<template>
  <v-timeline density="comfortable" align="start" side="end">
    <template
      v-for="(
        fundraisingProjectProgress, index
      ) in fundraisingProjectProgresses"
      :key="fundraisingProjectProgress.id"
    >
      <v-timeline-item :dot-color="getDotColor(index)" size="small">
        <div class="d-flex">
          <div>
            <strong>{{ fundraisingProjectProgress.title }}</strong>

            <p class="progress-content">
              {{ fundraisingProjectProgress.description }}
            </p>

            <div v-if="hasValidImageUrl(fundraisingProjectProgress.imgUrl)">
              <v-img
                class="progress-img"
                :src="ossEndpoint + fundraisingProjectProgress.imgUrl"
                position="left"
              ></v-img>
            </div>

            <p class="progress-date">
              {{ formatDatetime(fundraisingProjectProgress.updatedDate) }}
            </p>
          </div>
        </div>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get } from "@/net/index.js";
import moment from "moment";

const store = useStore();
const fundraisingProjectId = computed(
  () => store.state.fundraisingProjectId || {}
); // Get the current fundraisingProjectId from the store
const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const fundraisingProjectProgresses = ref([]);

// If the image url is valid, return true, otherwise return false
const hasValidImageUrl = (imgUrl) => {
  return imgUrl && imgUrl !== "null";
};

const fetchItems = () => {
  get(
    `/api/fundraising-project-detail/getFundraisingProjectProgressesByProjectId/${fundraisingProjectId.value}`,
    (data) => {
      if (data.length) {
        fundraisingProjectProgresses.value = data;
      }
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const formatDatetime = (timestamp) => {
  return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const getDotColor = (index) => {
  return index % 2 === 0 ? "pink" : "teal-lighten-3";
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.progress-content,
.progress-date {
  color: grey;
}

.progress-img {
  height: 100px;
}
</style>