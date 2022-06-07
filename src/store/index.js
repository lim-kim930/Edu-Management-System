import Vue from 'vue';
import Vuex from 'vuex';
import view from "./modules/viewHeight";
import student from "./modules/studentInfo";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        view,
        student
    }
});

export default store;