import createPersistedState from 'vuex-persistedstate';
import { createStore } from 'vuex';

const store = createStore({
    plugins: [
        createPersistedState({
            key: 'loginInfo', // Key use in localStorage
            paths: ['user'], // Specify which parts of the state to persist
            storage: window.localStorage,
        })
    ],
    state() {
        return {
            user: null, // This will hold our user data
            menuCollapsed: true, // Control menu collapse, use in header of admin panel
            bookId: null, // ID of the book in book detail page, use in recommended book component
            fundraisingProjectId: null, // ID of the fundraising project in fundraising project detail page, use in project progress component
        };
    },
    mutations: {
        setUser(state, userData) {
            state.user = userData;
        },
        toggleMenuCollapse(state) {
            state.menuCollapsed = !state.menuCollapsed;
        },
        setBookId(state, id) {
            state.bookId = id;
        },
        setProjectId(state, id) {
            state.fundraisingProjectId = id;
        },
    },
    actions: {
        loginUser({ commit }, userData) {
            commit('setUser', userData);
        },
        toggleMenuCollapse({ commit }) {
            commit('toggleMenuCollapse');
        },
        setBookId({ commit }, id) {
            commit('setBookId', id);
        },
        setProjectId({ commit }, id) {
            commit('setProjectId', id);
        },
    },
    getters: {
        userRoles: (state) => state.user ? state.user.roles : [],
        currentBookId: (state) => state.bookId,
        currentProjectId: (state) => state.fundraisingProjectId,
    },
});

export default store;