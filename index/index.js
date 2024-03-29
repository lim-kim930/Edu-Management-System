(() => {
    if (location.search.split("?")[1] !== undefined) {
        if (location.search.split("?")[1].split("=")[0] === "type") {
            sessionStorage.setItem("jw_from", "hduhelp");
            return window.location.href = "./sign";
        }
        // TODO:增加Url参数的校验
        const requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: { "Authorization": "token " + location.search.split("?")[1].split("&")[0].split("=")[1] }
        };
        return fetch("https://jl.hdu.edu.cn/salmon_base/person/info", requestOptions).then(response => response.text()).then(result => {
            const data = JSON.parse(result).data;
            if (data.staffType)
                data.STAFFTYPE = data.staffType;
            if (data.STAFFTYPE && data.STAFFTYPE === "1") {
                localStorage.setItem("jw_student_file", JSON.stringify({
                    token: location.search.split("?")[1].split("&")[0].split("=")[1],
                    staffID: location.search.split("?")[1].split("&")[1].split("=")[1],
                    xjConfirmed: false
                }));
                if (sessionStorage.getItem("jw_from") && sessionStorage.getItem("jw_from") === "hduhelp") {
                    sessionStorage.removeItem("jw_from");
                    window.location.href = "./student/#/infoShare";
                }
                else
                    window.location.href = "./student";
            }
            else if (data.STAFFTYPE === "2") {
                localStorage.setItem("jw_manager_file", JSON.stringify({
                    token: location.search.split("?")[1].split("&")[0].split("=")[1],
                    uname: location.search.split("?")[1].split("&")[1].split("=")[1]
                }));
                window.location.href = "./manager";
            }
        }).catch(error => {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".div1").style.display = "none";
            document.querySelector("#errorInfo").innerText = error;
        });
    }
    else {
        if (localStorage.getItem("jw_student_file") !== null)
            return window.location.href = "./student";
        else if (localStorage.getItem("jw_ent_file") !== null)
            return window.location.href = "./company";
        else if (localStorage.getItem("jw_manager_file") !== null)
            return window.location.href = "./manager";
        window.location.href = "./sign";
    }
})();