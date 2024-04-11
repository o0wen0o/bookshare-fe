import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net/index.js";
import { ElMessage } from 'element-plus';
import store from "@/net/store.js";
import { deleteAccessToken } from "@/net/auth.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/user-auth',
            name: 'user-auth',
            component: () => import('@/views/UserAuthView.vue'),
            meta: { requiresAuth: false },
            redirect: 'login',
            children: [
                { path: '/login', name: 'user-auth-login', component: () => import('@/views/user-auth/LoginPage.vue') },
                { path: '/register', name: 'user-auth-register', component: () => import('@/views/user-auth/RegisterPage.vue') },
                { path: '/forget', name: 'user-auth-forget', component: () => import('@/views/user-auth/ForgetPage.vue') }
            ]
        }, {
            path: '/',
            name: 'user',
            component: () => import('@/views/UserView.vue'),
            meta: { requiresAuth: true },
            children: [
                // index page
                {
                    path: '',
                    name: 'index',
                    component: () => import('@/views/user/index/IndexView.vue'),
                    meta: { requiresAuth: true },
                    children: [
                        { path: '/', name: 'home', component: () => import('@/views/user/home/ContentMainColumn.vue') },
                        { path: 'community', name: 'community', component: () => import('@/views/user/community/ContentMainColumn.vue') },
                        { path: 'fundraising-project', name: 'fundraising-project', component: () => import('@/views/user/fundraising-project/ContentMainColumn.vue') },
                    ]
                },

                // profile page
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/user/profile/ProfileView.vue'),
                    meta: { requiresAuth: true },
                    children: [
                        { path: '/profile-detail', name: 'profile-detail', component: () => import('@/views/user/profile/profile-detail/ProfileDetail.vue') },
                        { path: '/bookshelf', name: 'bookshelf', component: () => import('@/views/user/profile/Bookshelf.vue') },
                        { path: '/book-review', name: 'book-review', component: () => import('@/views/user/profile/book-review/BookReview.vue') },
                        { path: '/book-contribution', name: 'book-contribution', component: () => import('@/views/user/profile/BookContribution.vue') },
                        { path: '/donation-history', name: 'donation-history', component: () => import('@/views/user/profile/DonationHistory.vue') },
                    ]
                },

                // book detail page
                { path: '/book-detail/:id', name: 'book-detail', component: () => import('@/views/user/book-detail/BookDetailView.vue') },

                // create post page
                { path: '/create-post', name: 'create-post', component: () => import('@/views/user/community/CreatePostView.vue') },

                // write book review
                { path: '/write-book-review/create', name: 'write-book-review-create', component: () => import('@/views/user/profile/book-review/WriteBookReview.vue') },
                { path: '/write-book-review/:id/edit', name: 'write-book-review-edit', component: () => import('@/views/user/profile/book-review/WriteBookReview.vue') },

                // fundraising project detail page
                { path: '/fundraising-project-detail/:id', name: 'fundraising-project-detail', component: () => import('@/views/user/fundraising-project/FundraisingProjectDetailView.vue') },
            ]
        }, {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminPanelView.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
            redirect: 'users',
            children: [
                // User
                { path: '/users', name: 'users', component: () => import('@/views/admin/users/Browse.vue') },
                { path: '/users/:id', name: 'users-read', component: () => import('@/views/admin/users/Read.vue') },
                { path: '/users/create', name: 'users-create', component: () => import('@/views/admin/users/EditAdd.vue') },
                { path: '/users/:id/edit', name: 'users-edit', component: () => import('@/views/admin/users/EditAdd.vue') },

                { path: '/roles', name: 'roles', component: () => import('@/views/admin/roles/Browse.vue') },
                { path: '/roles/:id', name: 'roles-read', component: () => import('@/views/admin/roles/Read.vue') },
                { path: '/roles/create', name: 'roles-create', component: () => import('@/views/admin/roles/EditAdd.vue') },
                { path: '/roles/:id/edit', name: 'roles-edit', component: () => import('@/views/admin/roles/EditAdd.vue') },

                // Book
                { path: '/books', name: 'books', component: () => import('@/views/admin/books/Browse.vue') },
                { path: '/books/:id', name: 'books-read', component: () => import('@/views/admin/books/Read.vue') },
                { path: '/books/create', name: 'books-create', component: () => import('@/views/admin/books/EditAdd.vue') },
                { path: '/books/:id/edit', name: 'books-edit', component: () => import('@/views/admin/books/EditAdd.vue') },

                { path: '/genres', name: 'genres', component: () => import('@/views/admin/genres/Browse.vue') },
                { path: '/genres/:id', name: 'genres-read', component: () => import('@/views/admin/genres/Read.vue') },
                { path: '/genres/create', name: 'genres-create', component: () => import('@/views/admin/genres/EditAdd.vue') },
                { path: '/genres/:id/edit', name: 'genres-edit', component: () => import('@/views/admin/genres/EditAdd.vue') },

                { path: '/book-submissions', name: 'book-submissions', component: () => import('@/views/admin/book-submissions/Browse.vue') },
                { path: '/book-submissions/:id', name: 'book-submissions-read', component: () => import('@/views/admin/book-submissions/Read.vue') },

                // Post
                { path: '/posts', name: 'posts', component: () => import('@/views/admin/posts/Browse.vue') },
                { path: '/posts/:id', name: 'posts-read', component: () => import('@/views/admin/posts/Read.vue') },
                { path: '/posts/create', name: 'posts-create', component: () => import('@/views/admin/posts/EditAdd.vue') },
                { path: '/posts/:id/edit', name: 'posts-edit', component: () => import('@/views/admin/posts/EditAdd.vue') },

                // Fundraising
                { path: '/fundraising-organizers', name: 'fundraising-organizers', component: () => import('@/views/admin/fundraising-organizers/Browse.vue') },
                { path: '/fundraising-organizers/:id', name: 'fundraising-organizers-read', component: () => import('@/views/admin/fundraising-organizers/Read.vue') },
                { path: '/fundraising-organizers/create', name: 'fundraising-organizers-create', component: () => import('@/views/admin/fundraising-organizers/EditAdd.vue') },
                { path: '/fundraising-organizers/:id/edit', name: 'fundraising-organizers-edit', component: () => import('@/views/admin/fundraising-organizers/EditAdd.vue') },

                { path: '/fundraising-projects', name: 'fundraising-projects', component: () => import('@/views/admin/fundraising-projects/Browse.vue') },
                { path: '/fundraising-projects/:id', name: 'fundraising-projects-read', component: () => import('@/views/admin/fundraising-projects/Read.vue') },
                { path: '/fundraising-projects/create', name: 'fundraising-projects-create', component: () => import('@/views/admin/fundraising-projects/EditAdd.vue') },
                { path: '/fundraising-projects/:id/edit', name: 'fundraising-projects-edit', component: () => import('@/views/admin/fundraising-projects/EditAdd.vue') },

                { path: '/fundraising-project-progress', name: 'fundraising-project-progress', component: () => import('@/views/admin/fundraising-project-progress/Browse.vue') },
                { path: '/fundraising-project-progress/:id', name: 'fundraising-project-progress-read', component: () => import('@/views/admin/fundraising-project-progress/Read.vue') },
                { path: '/fundraising-project-progress/create', name: 'fundraising-project-progress-create', component: () => import('@/views/admin/fundraising-project-progress/EditAdd.vue') },
                { path: '/fundraising-project-progress/:id/edit', name: 'fundraising-project-progress-edit', component: () => import('@/views/admin/fundraising-project-progress/EditAdd.vue') },

                { path: '/donations', name: 'donations', component: () => import('@/views/admin/donations/Browse.vue') },
                { path: '/donations/:id', name: 'donations-read', component: () => import('@/views/admin/donations/Read.vue') },
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // Redirect logic for unauthorized access to '/index' path
    if (requiresAuth && isUnauthorized) {
        // If the route requires authentication and user is unauthorized
        deleteAccessToken();
        ElMessage.warning('Please log in to continue.');
        next('/user-auth');
        return;
    }

    // Redirect logic for authorized access
    if (to.name?.startsWith('user-auth')) {
        if (!isUnauthorized) {
            // If coming from an admin route and user is authorized, redirect to /admin
            if (store.getters.userRoles.includes("Admin")) {
                next('/admin');
                return;
            } else {
                // If authorized but not coming from an admin route, redirect to /index
                next('/');
                return;
            }
        }
    }

    // Admin role protection
    if (requiresAdmin && !store.getters.userRoles.includes("Admin")) {
        // If the route requires an Admin role and the user does not have it
        ElMessage.warning('You do not have permission to access this page');
        next(isUnauthorized ? '/user-auth' : '/'); // Redirect to home if unauthorized, else to index
        return;
    }

    next(); // This is the default case if none of the above conditions are met
});

export default router;
