<template>
  <v-infinite-scroll side="end" @load="load">
    <div class="item_container" v-for="comment in comments" :key="comment.id">
      <v-row>
        <v-col cols="12">
          <!-- comment Section -->
          <div class="comment_container">
            <!-- comment User Info -->
            <div class="comment_user_info">
              <v-avatar size="48px">
                <v-img alt="Avatar" :src="comment.avatar"></v-img>
              </v-avatar>

              <div class="ml-2">
                <strong>{{ comment.username }}</strong>
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
                {{ comment.replies.length }}
              </span>

              <span>
                <v-icon size="20px">mdi-share-variant</v-icon>
                {{ comment.shares }}
              </span>
            </div>

            <v-divider class="my-3"></v-divider>
          </div>

          <!-- replies Section -->
          <v-row v-if="comment.showReplies">
            <v-col cols="12" v-for="reply in comment.replies" :key="reply.id">
              <div class="reply_container">
                <v-row>
                  <v-col cols="1">
                    <v-avatar size="36px">
                      <v-img alt="Avatar" :src="reply.avatar"></v-img>
                    </v-avatar>
                  </v-col>

                  <v-col cols="11">
                    <div class="reply_header">
                      <strong>{{ reply.username }}</strong>
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

            <v-col cols="12">
              <v-text-field
                label="Write a reply..."
                solo
                dense
                flat
                hide-details
                v-model="comment.newreply"
                @keyup.enter="addreply(comment)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <template v-slot:empty>
      <v-alert icon="mdi-reload" type="warning">
        No more comments available
      </v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const allComments = ref([
  {
    id: 1,
    username: "John Doe",
    parentId: 0,
    text: "This is the first reply",
    createdDate: "2022-01-01 18:10:25",
    likes: 10,
    thumbed: false,
    avatar: ossEndpoint + "default_avatar.png",
    showReplies: false,
    replies: [
      {
        id: 2,
        username: "Jane Doe",
        parentId: 1,
        text: "This is the first reply",
        createdDate: "2022-01-01 18:10:25",
        likes: 10,
        thumbed: false,
        avatar: ossEndpoint + "default_avatar.png",
      },
    ],
  },
  {
    id: 2,
    username: "John Doe",
    parentId: 0,
    text: "This is the first reply",
    createdDate: "2022-01-01 18:10:25",
    likes: 10,
    thumbed: false,
    avatar: ossEndpoint + "default_avatar.png",
    showReplies: false,
    replies: [
      {
        id: 2,
        username: "Jane Doe",
        parentId: 1,
        text: "This is the first reply",
        createdDate: "2022-01-01 18:10:25",
        likes: 10,
        thumbed: false,
        avatar: ossEndpoint + "default_avatar.png",
      },
    ],
  },
  {
    id: 3,
    username: "John Doe",
    parentId: 0,
    text: "This is the first reply",
    createdDate: "2022-01-01 18:10:25",
    likes: 10,
    thumbed: false,
    avatar: ossEndpoint + "default_avatar.png",
    showReplies: false,
    replies: [
      {
        id: 2,
        username: "Jane Doe",
        parentId: 1,
        text: "This is the first reply",
        createdDate: "2022-01-01 18:10:25",
        likes: 10,
        thumbed: false,
        avatar: ossEndpoint + "default_avatar.png",
      },
    ],
  },
  {
    id: 4,
    username: "John Doe",
    parentId: 0,
    text: "This is the first reply",
    createdDate: "2022-01-01 18:10:25",
    likes: 10,
    thumbed: false,
    avatar: ossEndpoint + "default_avatar.png",
    showReplies: false,
    replies: [
      {
        id: 2,
        username: "Jane Doe",
        parentId: 1,
        text: "This is the first reply",
        createdDate: "2022-01-01 18:10:25",
        likes: 10,
        thumbed: false,
        avatar: ossEndpoint + "default_avatar.png",
      },
    ],
  },
]);

const comments = ref(allComments.value.slice(0, 4));

const toggleLike = (item) => {
  item.thumbed = !item.thumbed;
  item.likes += item.thumbed ? 1 : -1;
};

const toggleShowReplies = (comment) => {
  comment.showReplies = !comment.showReplies;
};

const addreply = (comment) => {
  if (comment.newreply.trim()) {
    const newreply = {
      id: Date.now(), // unique ID for the new reply
      username: "Current User", // Replace with actual user info
      avatar: ossEndpoint + "default_avatar.png",
      text: comment.newreply,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new reply
      thumbed: false,
    };
    comment.replies.push(newreply);
    comment.newreply = "";
  }
};

// Function to load more comments
const loadMoreComments = () => {
  const currentCount = comments.value.length;
  const moreComments = allComments.value.slice(currentCount, currentCount + 1);
  if (moreComments.length) {
    comments.value = [...comments.value, ...moreComments];
  }
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    loadMoreComments();
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
  padding: 10px;
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
  margin: 0 15px;
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
