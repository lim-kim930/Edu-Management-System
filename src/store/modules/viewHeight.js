const state = () => ({
    height: 0
});

const getters = {
    afterCompared: state => {
        return state.height < 650 ? 650 : state.height;
    }
};

const mutations = {
    setHeight(state, height) {
        state.height = height;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};