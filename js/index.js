function read_statuscode(statusCode,responseText){
    if(statusCode==4||statusCode==200){
        console.log("Success!");
        return;
    }
    switch(statusCode) {
        case 419:
           console.log("还没有关注公众号");
           window.location.href="https://hemc.100steps.net/2018/fireman/auth.php?redirect=https://hemc.100steps.net/2019/wish-pokemon/api/Check_login&state=gsudndu13Sd";
           break;
        case 430:
           console.log("活动还没开始哦, 敬请期待~");
           break;
        case 431:
            console.log("活动已经结束啦, 感谢关注~");
            break;
        default:
           console.log("网络出了点小问题");
   } 
}
function post(url, package) {
    var xmlhttp = new XMLHttpRequest();
    var obj = package;
    xmlhttp.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(obj));
    xmlhttp.onreadystatechange = function () {
        read_statuscode(xmlhttp.readyState), xmlhttp.responseText;
    }
};
function get(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        read_statuscode(xmlhttp.readyState), xmlhttp.responseText;
    }
}
function start(name,time){
    /*开始按钮 1.撤掉规则→布雷 2.开始记录session 用户名+开始时间 */
    return name,time;
}
function timer(time){
    /*计时器启动 启动时切换描边颜色 */
}
function stop(){
    /*踩到雷了或邀请卡或游戏时长大于10min*/
    if(something){

    }
}
function attention(text){
    /*把这个display的对象中文本改掉 */
}
function show(id){
    var obj=document.getElementById(String(id));
}
function close(type,name,method){
    if(type=="classname"){
        var obj=document.getElementsByClassName(String(name));
    }else{
        var obj=document.getElementById(String(name));
    }
    if(method=="vis"){
        /*visiablity */
    }else{
        /* disaplay none*/
    }
}
window.onload=function(){
    var startbtn=document.getElementById("start");
    var name=localStorage.getItem("you");
    var time=new Date();
    startbtn.onclick=function(){
        start(name,time);
    }
}