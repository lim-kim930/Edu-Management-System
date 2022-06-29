import store from '../store';

const dataURLtoFile = (dataurl, filename = "学业文件.enc") => {
    const arr = dataurl.split(","), bstr = atob(arr[0]);
    let n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: "enc" });
};

const downloadFile = () => {
    const file = store.state.student.file;
    const filename = file.name || "学业文件.enc";
    const blobUrl = URL.createObjectURL(file);
    const eleLink = document.createElement("a");
    eleLink.style.display = "none";
    eleLink.href = blobUrl;
    eleLink.download = filename;
    document.body.appendChild(eleLink);
    // This is necessary as eleLink.click() does not work on the latest firefox
    eleLink.dispatchEvent(
        new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
        })
    );
    document.body.removeChild(eleLink);
    store.commit("student/setDownloaded", true);
};

export { dataURLtoFile, downloadFile };