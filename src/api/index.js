import axios from "axios";

//axios cookies配置
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://jl.hdu.edu.cn/gormja_wrapper";

export default axios;