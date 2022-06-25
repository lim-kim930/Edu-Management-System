export default ()=>{
    const vh = self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;
    return vh;
};