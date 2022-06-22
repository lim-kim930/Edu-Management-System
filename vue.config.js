
module.exports = {
    pages: {
        sign: {
            entry: "src/sign_main.js",
            filename: 'sign/index.html',
            title: '系统-登录'
        },
        student: {
            entry: "src/student_main.js",
            filename: 'student/index.html',
            title: '教务—学业分享系统'
        },
        company: {
            entry: "src/company_main.js",
            filename: 'company/index.html',
            title: '高校学业核验系统'
        },
        manager: {
            entry: "src/manager_main.js",
            filename: 'manager/index.html',
            title: '教务—学业分享系统'
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? "./../" : "./",
    outputDir: "dist",
    productionSourceMap: false,
    devServer: {
        host: "localhost",
        port: 8080,
        open: "http://localhost:8080/sign" // 端口冲突的话此项会失效
    }
};