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
              <v-avatar size="48px" @click="goToProfile(post.userId)">
                <v-img alt="Avatar" :src="ossEndpoint + post.avatar"></v-img>
              </v-avatar>

              <div class="ml-2">
                <strong @click="goToProfile(post.userId)">{{
                  post.username
                }}</strong>
                <div style="color: grey">{{ post.createdDate }}</div>
              </div>
            </div>

            <!-- Post Content -->
            <div class="mt-2" v-html="DOMPurify.sanitize(post.content)"></div>

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
                  <v-col cols="1" @click="goToProfile(comment.userId)">
                    <v-avatar size="36px">
                      <v-img
                        alt="Avatar"
                        :src="ossEndpoint + comment.avatar"
                      ></v-img>
                    </v-avatar>
                  </v-col>

                  <v-col cols="11">
                    <div class="comment_header">
                      <strong @click="goToProfile(comment.userId)">
                        {{ comment.username }}
                      </strong>
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
        <v-alert type="info" variant="tonal">
        No more posts available
      </v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { get, post, _delete } from "@/net/index.js";
import moment from "moment";
import DOMPurify from "dompurify"; // Sanitize HTML prevent XSS attacks

const router = useRouter();
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
        createdDate: formatCreatedDate(post.createdDate),
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
          createdDate: formatCreatedDate(comment.createdDate),
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

const togglePostLike = async (postItem) => {
  const requestMethod = postItem.thumbed ? _delete : post; // Determine the request method
  const action = postItem.thumbed ? "unlike" : "like"; // Determine the action for url
  const url = `/api/community/${action}Post`;

  const data = `${postItem.id}/${userData.value.id}`;
  const formData = new FormData();
  formData.append("postId", postItem.id);
  formData.append("userId", userData.value.id);

  requestMethod(
    url,
    postItem.thumbed ? data : formData,
    (data) => {
      postItem.thumbed = !postItem.thumbed; // Toggle the thumbed state
      postItem.likes += postItem.thumbed ? 1 : -1; // Update the likes count
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const toggleCommentLike = (comment) => {
  const requestMethod = comment.thumbed ? _delete : post; // Determine the request method
  const action = comment.thumbed ? "unlike" : "like"; // Determine the action for url
  const url = `/api/community/${action}PostComment`;

  const data = `${comment.id}/${userData.value.id}`;
  const formData = new FormData();
  formData.append("postCommentId", comment.id);
  formData.append("userId", userData.value.id);

  requestMethod(
    url,
    comment.thumbed ? data : formData,
    (data) => {
      comment.thumbed = !comment.thumbed; // Toggle the thumbed state
      comment.likes += comment.thumbed ? 1 : -1; // Update the likes count
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

const addComment = (postItem) => {
  if (postItem.newComment.trim()) {
    const newComment = {
      id: 0, // should get from backend
      username: userData.value.username,
      avatar: userData.value.avatar,
      text: postItem.newComment,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new comment
      thumbed: false,
      userId: userData.value.id,
      postId: postItem.id,
    };

    const url = `/api/community/createPostComment`;
    post(
      url,
      newComment,
      (data) => {
        newComment.id = data;
        newComment.createdDate = formatCreatedDate(newComment.createdDate);

        postItem.comments.push(newComment);
        postItem.newComment = "";
      },
      (message) => {
        ElMessage.warning(message);
      }
    );
  }
};

// Helper function to format the created date
function formatCreatedDate(createdDate) {
  const date = moment(createdDate);
  const now = moment();

  const diffSeconds = now.diff(date, "seconds");
  const diffMinutes = now.diff(date, "minutes");
  const diffHours = now.diff(date, "hours");
  const diffDays = now.diff(date, "days");

  if (diffSeconds < 60) {
    // Less than 60 seconds ago
    return `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    // Less than 60 minutes ago
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    // Less than 24 hours ago
    return `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    // Less than 7 days ago
    return `${diffDays} days ago`;
  } else {
    // Any time before this week
    return date.format("YYYY-MM-DD HH:mm:ss");
  }
}

function goToProfile(userId) {
  // Navigate to the user profile
  if (userId === userData.value.id) {
    router.push({ name: "profile-detail" });
  } else {
    router.push({ name: "profile-detail", query: { userId: userId } });
  }
}

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
