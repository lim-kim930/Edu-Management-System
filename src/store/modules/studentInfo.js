const state = () => ({
    file: null,
    fileDownloaded: true,
    userData: {
        confirmed: false,
        staffID: "",
        token: ""
    }
});

const getters = {
    getUserData: state => {
        return state.userData;
    },
    getFile: state => {
        return state.file;
    },
    getFileDownloaded: state => {
        return state.fileDownloaded;
    },
    getConfirmed: state => {
        return state.userData.confirmed;
    }
};

const mutations = {
    setFile(state, file) {
        state.file = file;
    },
    setDownloaded(state, value) {
        state.fileDownloaded = value;
    },
    setUserData(state, data) {
        state.userData = data;
    },
    setConfirmed(state, value) {
        state.userData.confirmed = value;
        let userData = JSON.parse(localStorage.getItem("jw_student_file"));
        this.xjConfirmed = value;
        userData.xjConfirmed = this.xjConfirmed;
        localStorage.setItem("jw_student_file", JSON.stringify(userData));
    },
    setStaffID(state, id) {
        state.userData.staffID = id;
    },
    setToken(state, token) {
        state.userData.token = token;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};