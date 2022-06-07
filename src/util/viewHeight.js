export default ()=>{
    const wh = self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;
    return wh;
};