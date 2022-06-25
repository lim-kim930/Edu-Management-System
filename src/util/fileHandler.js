import store from '../store';

const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(","), bstr = atob(arr[0]);
    let n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: "enc" });
};

const downloadFile = (file, filename) => {
    const Url = URL.createObjectURL(file);
    const eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    eleLink.href = Url;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
    store.commit("setDownloaded", true);
};

export { dataURLtoFile, downloadFile };