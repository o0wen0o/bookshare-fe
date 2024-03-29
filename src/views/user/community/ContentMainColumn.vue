<template>
  <v-infinite-scroll side="end" @load="load">
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
                <v-img alt="Avatar" :src="post.avatar"></v-img>
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
                @click="toggleLike(post)"
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
                {{ post.comments.length }}
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
                      <v-img alt="Avatar" :src="comment.avatar"></v-img>
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
                        @click="toggleLike(comment)"
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
import { ref } from "vue";
import moment from "moment";

const ossEndpoint = import.meta.env.VITE_ALIYUN_OSS_ENDPOINT;

const allPosts = ref([
  {
    id: 1,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
  {
    id: 2,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
  {
    id: 3,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
  {
    id: 4,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
  {
    id: 5,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
  {
    id: 6,
    username: "User1",
    avatar: ossEndpoint + "default_avatar.png",
    createdDate: "2024-03-10 18:59",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 187,
    thumbed: false,
    shares: 73,
    showComments: false,
    newComment: "",
    comments: [
      {
        id: 1,
        username: "Commenter1",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Great post!",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
      {
        id: 2,
        username: "Commenter2",
        avatar: ossEndpoint + "default_avatar.png",
        text: "Thanks for sharing.",
        likes: 10,
        thumbed: false,
        createdDate: "2024-03-10 18:59",
      },
    ],
  },
]);

const posts = ref(allPosts.value.slice(0, 4));

const toggleLike = (item) => {
  item.thumbed = !item.thumbed;
  item.likes += item.thumbed ? 1 : -1;
};

const toggleShowComments = (post) => {
  post.showComments = !post.showComments;
};

const addComment = (post) => {
  if (post.newComment.trim()) {
    const newComment = {
      id: Date.now(), // unique ID for the new comment
      username: "Current User", // Replace with actual user info
      avatar: ossEndpoint + "default_avatar.png",
      text: post.newComment,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      likes: 0, // Initialize likes for the new comment
      thumbed: false,
    };
    post.comments.push(newComment);
    post.newComment = "";
  }
};

// Function to load more posts
const loadMorePosts = () => {
  const currentCount = posts.value.length;
  const morePosts = allPosts.value.slice(currentCount, currentCount + 1);
  if (morePosts.length) {
    posts.value = [...posts.value, ...morePosts];
  }
};

// Load function for the v-infinite-scroll
const load = ({ side, done }) => {
  if (side === "end") {
    loadMorePosts();
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
