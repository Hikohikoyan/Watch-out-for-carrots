window.onload=function(){
    document.getElementById('start_tizai').addEventListener('click',close,false);
    console.log("add");
    function close(){
        console.log("close");
        document.getElementById('startboy').style.cssText="display:none;";
    }
}