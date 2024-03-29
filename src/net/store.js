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
            menuCollapsed: true, // navigation menu
        };
    },
    mutations: {
        setUser(state, userData) {
            state.user = userData;
        },
        toggleMenuCollapse(state) {
            state.menuCollapsed = !state.menuCollapsed;
        },
    },
    actions: {
        loginUser({ commit }, userData) {
            commit('setUser', userData);
        },
        toggleMenuCollapse({ commit }) {
            commit('toggleMenuCollapse');
        },
    },
    getters: {
        userRoles: (state) => state.user ? state.user.roles : [],
    },
});

export default store;