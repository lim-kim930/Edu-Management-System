const state = () => ({
    confirmed: false,
    file: null
});

const mutations = {
    setConfirmed(state, value) {
        state.confirmed = value;
    },
    setFile(state, file) {
        state.file = file;
    },
};

export default {
    namespaced: true,
    state,
    mutations
};