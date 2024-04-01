<template>
  <v-infinite-scroll side="end" @load="load" style="margin-top: -16px">
    <v-card
      elevation="2"
      class="item_container"
      v-for="post in posts"
      :key="post.id"
    >
      <v-row>
        <v-col cols="12">
          <!-- Post Section -->
          <div class="post_container">
            <!-- Post User Info -->
            <div class="post_user_info">
              <v-avatar size="48px">
                <v-img alt="Avatar" :src="ossEndpoint + post.avatar"></v-img>
              </v-avatar>

              <div class="ml-2">
                <strong>{{ post.username }}</strong>
                <div>{{ post.createdDate }}</div>
              </div>
            </div>

            <!-- Post Content -->
            <div class="mt-2">
              <p>{{ post.content }}</p>
            </div>

            <!-- Post Actions -->
            <div class="post_actions">
              <span
                :class="{ 'action-active': post.thumbed }"
                @click="togglePostLike(post)"
              >
                <v-icon size="20px">
                  {{ post.thumbed ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}
                </v-icon>
                {{ post.likes }}
              </span>

              <span
                class="ml-auto mr-4"
                :class="{ 'action-active': post.showComments }"
                @click="toggleShowComments(post)"
              >
                <v-icon size="20px">mdi-comment-outline</v-icon>
                {{ post.commentCount }}
              </span>

              <span>
                <v-icon size="20px">mdi-share-variant</v-icon>
                {{ post.shares }}
              </span>
            </div>

            <v-divider class="my-3"></v-divider>
          </div>

          <!-- Comments Section -->
          <v-row v-if="post.showComments">
            <v-col cols="12" v-for="comment in post.comments" :key="comment.id">
              <div class="comment_container">
                <v-row>
                  <v-col cols="1">
                    <v-avatar size="36px">
                      <v-img
                        alt="Avatar"
                        :src="ossEndpoint + comment.avatar"
                      ></v-img>
                    </v-avatar>
                  </v-col>

                  <v-col cols="11">
                    <div class="comment_header">
                      <strong>{{ comment.username }}</strong>
                    </div>

                    <div class="comment_body">
                      <p>{{ comment.text }}</p>
                    </div>

                    <div class="comment_footer">
                      <span>{{ comment.createdDate }}</span>

                      <span
                        :class="{ 'action-active': comment.thumbed }"
                        @click="toggleCommentLike(comment)"
                      >
                        <v-icon size="16px">
                          {{
                            comment.thumbed
                              ? "mdi-thumb-up"
                              : "mdi-thumb-up-outline"
                          }}
                        </v-icon>
                        {{ comment.likes }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Write a comment..."
                solo
                dense
                flat
                hide-details
                v-model="post.newComment"
                @keyup.enter="addComment(post)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <template v-slot:empty>
      <v-alert icon="mdi-reload" type="warning">
        No more posts available
      </v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get, post, _delete } from "@/net/index.js";
import moment from "moment";

const page = ref(1);
const itemsPerPage = ref(10);
const posts = ref([]);

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;
const store = useStore();
const userData = computed(() => store.state.user || {});

// Function to load more posts
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    userId: userData.value.id,
  };

  get(
    `/api/community/getPosts`,
    (data) => {
      // Map through each record to add the new attributes
      const updatedPosts = data.records.map((post) => ({
        ...post,
        createdDate: moment(post.createdDate).format("YYYY-MM-DD HH:mm:ss"),
        showComments: false,
        newComment: "",
        commentsLoaded: false, // Mark comments as loaded to prevent future fetches
        comments: [],
      }));

      // Update the posts state with the newly formatted posts
      posts.value = [...posts.value, ...updatedPosts];
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
};

const toggleShowComments = async (post) => {
  // Check if comments are already loaded for the post
  if (!post.commentsLoaded) {
    const params = {
      postId: post.id,
      userId: userData.value.id,
    };

    get(
      `/api/community/getPostComments`,
      (data) => {
        // Map through each record to add the new attributes
        post.comments = data.map((comment) => ({
          ...comment,
          createdDate: moment(comment.createdDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        }));

        post.commentsLoaded = true; // Mark comments as loaded to prevent future fetches
      },
      (message) => {
        ElMessage.warning(message);
      },
      params
    );
  }

  // Toggle the visibility of the comments section for the post
  post.showComments = !post.showComments;
};

const togglePostLike = async (item) => {
  const requestMethod = item.thumbed ? _delete : post; // Determine the request method
  const action = item.thumbed ? "unlike" : "like"; // Determine the action for url
  const url = `/api/community/${action}Post`;

  const data = `${item.id}/${userData.value.id}`;
  const formData = new FormData();
  formData.append("postId", item.id);
  formData.append("userId", userData.value.id);

  requestMethod(
    url,
    item.thumbed ? data : formData,
    (data) => {
      item.thumbed = !item.thumbed; // Toggle the thumbed state
      item.likes += item.thumbed ? 1 : -1; // Update the likes count
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const toggleCommentLike = (item) => {
  const requestMethod = item.thumbed ? _delete : post; // Determine the request method
  const action = item.thumbed ? "unlike" : "like"; // Determine the action for url
  const url = `/api/community/${action}PostComment`;

  const data = `${item.id}/${userData.value.id}`;
  const formData = new FormData();
  formData.append("postCommentId", item.id);
  formData.append("userId", userData.value.id);

  requestMethod(
    url,
    item.thumbed ? data : formData,
    (data) => {
      item.thumbed = !item.thumbed; // Toggle the thumbed state
      item.likes += item.thumbed ? 1 : -1; // Update the likes count
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const addComment = (post) => {
  if (post.newComment.trim()) {
    const newComment = {
      id: Date.now(), // should get from backend
      username: userData.value.username,
      avatar: userData.value.avatar,
      text: post.newComment,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new comment
      thumbed: false,
    };
    post.comments.push(newComment);
    post.newComment = "";
  }
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    fetchItems();
    done("empty");
  }
};
</script>

<style scoped>
.item_container {
  padding: 12px;
  margin-bottom: 15px;
}

.post_container {
  padding: 10px;
}

.post_user_info {
  display: flex;
  align-items: center;
}

.post_actions {
  margin-top: 15px;
  display: flex;
  align-items: center;
}

.post_actions > span {
  gap: 5px;
  display: flex;
  align-items: center;
}

.post_actions > span:hover,
.action-active {
  color: rgb(0, 150, 255);
}

.comment_container {
  margin: 0 15px;
}

.comment_body {
  margin-top: 3px;
}

.comment_footer {
  margin-top: 3px;
  color: grey;
  font-size: small;

  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
