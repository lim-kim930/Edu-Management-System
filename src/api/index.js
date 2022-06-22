import axios from "axios";

//axios cookies配置
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://api.hduhelp.com/gormja_wrapper";

export default axios;