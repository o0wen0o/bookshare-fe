<template>
  <v-infinite-scroll side="end" @load="load">
    <h3 class="ml-3">Comments</h3>

    <!-- comment Input -->
    <v-col cols="12">
      <v-text-field
        label="Write a comment..."
        solo
        dense
        flat
        hide-details
        v-model="newComment"
        @keyup.enter="addCommment()"
      ></v-text-field>
    </v-col>

    <div class="item_container" v-for="comment in comments" :key="comment.id">
      <v-row>
        <v-col cols="12">
          <!-- comment Section -->
          <div class="comment_container">
            <!-- comment User Info -->
            <div class="comment_user_info">
              <v-avatar size="48px">
                <v-img
                  alt="Avatar"
                  :src="ossEndpoint + comment.avatar"
                  @click="goToProfile(comment.userId)"
                ></v-img>
              </v-avatar>

              <div class="ml-2">
                <strong @click="goToProfile(comment.userId)">
                  {{ comment.username }}
                </strong>
                <div>{{ comment.createdDate }}</div>
              </div>
            </div>

            <!-- comment Content -->
            <div class="mt-2">
              <p>{{ comment.text }}</p>
            </div>

            <!-- comment Actions -->
            <div class="comment_actions">
              <span
                :class="{ 'action-active': comment.thumbed }"
                @click="toggleLike(comment)"
              >
                <v-icon size="20px">
                  {{
                    comment.thumbed ? "mdi-thumb-up" : "mdi-thumb-up-outline"
                  }}
                </v-icon>
                {{ comment.likes }}
              </span>

              <span
                class="ml-auto mr-4"
                :class="{ 'action-active': comment.showReplies }"
                @click="toggleShowReplies(comment)"
              >
                <v-icon size="20px">mdi-comment-outline</v-icon>
                {{ comment.replyCount }}
              </span>

              <span>
                <v-icon size="20px">mdi-share-variant</v-icon>
                {{ comment.shares }}
              </span>
            </div>

            <v-divider class="mt-3"></v-divider>
          </div>

          <!-- replies Section -->
          <v-row v-if="comment.showReplies">
            <!-- reply Item -->
            <v-col cols="12" v-for="reply in comment.replies" :key="reply.id">
              <div class="reply_container">
                <v-row>
                  <v-col cols="1">
                    <v-avatar size="36px">
                      <v-img
                        alt="Avatar"
                        :src="ossEndpoint + reply.avatar"
                        @click="goToProfile(reply.userId)"
                      ></v-img>
                    </v-avatar>
                  </v-col>

                  <v-col cols="11">
                    <div class="reply_header">
                      <strong @click="goToProfile(reply.userId)">
                        {{ reply.username }}
                      </strong>
                    </div>

                    <div class="reply_body">
                      <p>{{ reply.text }}</p>
                    </div>

                    <div class="reply_footer">
                      <span>{{ reply.createdDate }}</span>

                      <span
                        :class="{ 'action-active': reply.thumbed }"
                        @click="toggleLike(reply)"
                      >
                        <v-icon size="16px">
                          {{
                            reply.thumbed
                              ? "mdi-thumb-up"
                              : "mdi-thumb-up-outline"
                          }}
                        </v-icon>
                        {{ reply.likes }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <!-- reply Input -->
            <v-col cols="12">
              <v-text-field
                label="Write a reply..."
                solo
                dense
                flat
                hide-details
                v-model="comment.newreply"
                @keyup.enter="addReply(comment)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <template v-slot:empty>
      <v-alert type="info" variant="tonal">
        No more comments available
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

const router = useRouter();
const page = ref(1);
const itemsPerPage = ref(10);
const comments = ref([]);
const newComment = ref("");

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;
const store = useStore();
const userData = computed(() => store.state.user || {});
const bookId = computed(() => store.state.bookId || {});

// Function to load more comments
const fetchItems = () => {
  const params = {
    current: page.value++,
    size: itemsPerPage.value,
    bookId: bookId.value,
    userId: userData.value.id,
  };

  get(
    `/api/book-detail/getComments`,
    (data) => {
      // Map through each record to add the new attributes
      const updatedComments = data.records.map((comment) => ({
        ...comment,
        createdDate: formatCreatedDate(comment.createdDate),
        showReplies: false,
        newReply: "",
        repliesLoaded: false, // Mark replies as loaded to prevent future fetches
        replies: [],
      }));

      // Update the comments state with the newly formatted comments
      comments.value = [...comments.value, ...updatedComments];
    },
    (message) => {
      ElMessage.warning(message);
    },
    params
  );
};

const toggleShowReplies = async (comment) => {
  // Check if replies are already loaded for the comment
  if (!comment.repliesLoaded) {
    const params = {
      bookCommentId: comment.id,
      userId: userData.value.id,
    };

    get(
      `/api/book-detail/getCommentReplies`,
      (data) => {
        // Map through each record to add the new attributes
        comment.replies = data.map((reply) => ({
          ...reply,
          createdDate: formatCreatedDate(reply.createdDate),
        }));

        comment.repliesLoaded = true; // Mark replies as loaded to prevent future fetches
      },
      (message) => {
        ElMessage.warning(message);
      },
      params
    );
  }

  // Toggle the visibility of the replies section for the comment
  comment.showReplies = !comment.showReplies;
};

const toggleLike = async (item) => {
  const requestMethod = item.thumbed ? _delete : post; // Determine the request method
  const action = item.thumbed ? "unlike" : "like"; // Determine the action for url
  const url = `/api/book-detail/${action}BookComment`;

  const data = `${item.id}/${userData.value.id}`;
  const formData = new FormData();
  formData.append("bookCommentId", item.id);
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

const addCommment = () => {
  if (newComment.value.trim()) {
    const comment = {
      id: 0, // should get from backend
      username: userData.value.username,
      avatar: userData.value.avatar,
      parentId: 0,
      text: newComment.value,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new comment
      thumbed: false,
      userId: userData.value.id,
      bookId: bookId.value,
    };

    const url = `/api/book-detail/createBookComment`;
    post(
      url,
      comment,
      (data) => {
        comment.id = data;
        comment.createdDate = formatCreatedDate(comment.createdDate);

        comments.value.unshift(comment);
        newComment.value = "";
      },
      (message) => {
        ElMessage.warning(message);
      }
    );
  }
};

const addReply = (comment) => {
  if (comment.newreply.trim()) {
    const newreply = {
      id: 0, // should get from backend
      username: userData.value.username,
      avatar: userData.value.avatar,
      parentId: comment.id,
      text: comment.newreply,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new comment
      thumbed: false,
      userId: userData.value.id,
      bookId: bookId.value,
    };

    const url = `/api/book-detail/createBookComment`;
    post(
      url,
      newreply,
      (data) => {
        newreply.id = data;
        newreply.createdDate = formatCreatedDate(newreply.createdDate);

        comment.replies.push(newreply);
        comment.newreply = "";
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

.comment_container {
  padding: 0 10px;
}

.comment_user_info {
  display: flex;
  align-items: center;
}

.comment_actions {
  margin-top: 15px;
  display: flex;
  align-items: center;
}

.comment_actions > span {
  gap: 5px;
  display: flex;
  align-items: center;
}

.comment_actions > span:hover,
.action-active {
  color: rgb(0, 150, 255);
}

.reply_container {
  margin: 15px 15px 0 15px;
}

.reply_body {
  margin-top: 3px;
}

.reply_footer {
  margin-top: 3px;
  color: grey;
  font-size: small;

  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
