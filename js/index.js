// const startbtn = document.querySelector("#start");
var storage = JSON;
//常用的按钮
function read_statuscode(statusCode, responseText) { //用来提示的 仅此而已
    if (statusCode == 200) {
        console.log("Success!");
        response = JSON.stringify(responseText);
        if (response.errcode == "40003") {
            console.log("Wrong!");
        }
        return responseText;
    } else {
        switch (statusCode) {
            case 419:
                console.log("还没有关注公众号");
                window.location.href = "https://hemc.100steps.net/2018/fireman/auth.php?redirect=https://hemc.100steps.net/2019/wish-pokemon/api/Check_login&state=gsudndu13Sd";
                break;
            case 430:
                console.log("活动还没开始哦, 敬请期待~");
                break;
            case 431:
                console.log("活动已经结束啦, 感谢关注~");
                break;
            case 500:
                console.log("网络出了点小问题");
                break;
            case 402:
                console.log("网络出了点小问题");
                break;
            case 404:
                console.log("网络出了点小问题");
                break;
        }
    }
}

function post(url, package, casename) {
    var xmlhttp2 = new XMLHttpRequest();
    let obj = package;
    xmlhttp2.open("POST", url, true);
    xmlhttp2.setRequestHeader("Content-Type", "application/json");
    xmlhttp2.send(JSON.stringify(obj));
    xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4) {
            read_statuscode(xmlhttp2.status, xmlhttp2.responseText);
            storage = JSON.parse(xmlhttp2.responseText);
            return;
        }
    }
};

function get(url, casename) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            read_statuscode(xmlhttp.status, xmlhttp.responseText);
            if (casename == "getyou") {
                storage = JSON.parse(xmlhttp.responseText);
                localStorage.setItem("you", storage.name);
                return;
            }
        }
    }
}

function checkBBT() {
    //授权
    //get(https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect)
    get("js/login.json", "getyou");
}
startbtn.addEventListener('click', clearTable, false);

function clearTable() {
    //开始按钮 1.撤掉规则→布雷
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    let num = document.querySelectorAll("td").length;
    for (let i = 0; i < num; i++) {
        document.querySelectorAll("td")[i].style.cssText = "display:table-cell;";
    }
    console.log("切换棋盘");
    startbtn.removeEventListener('click', clearTable);
    start();
}

function start() {
    /* 2.开始记录session 用户名+开始时间 */
    timer();
    document.getElementById("start").value="重新开始";
    startbtn.addEventListener('click',function(){
        premap();listener();clearTable();
        document.getElementById('statistics').textContent="0";
        document.querySelector('h2').textContent="00:00";
        sessionStorage.setItem("isOver","false");

    });
}

function timer() {

    var startTime = new Date().getTime();
    /*计时器启动 启动时切换描边颜色 */
    document.querySelector("h2").style.cssText = " -webkit-text-stroke-color: #8c6e62;-webkit-text-stroke-width: 2.5px;";

    function addTime() {
        var second = parseInt((new Date().getTime() - startTime) / 1000);
        var min = parseInt(second / 60);
        if (second > 59) {
            second = String(second-min*60);
        }
        if (second < 10) {
            second = String("0" + second);
        }
        if (min < 10 && min > 0 || min == 0) {
            min = String("0" + min);
        } else if (min == 15) {
            clearInterval(timer);
            console.log("GameOver");
        } else {
            min = String(min);
        }

        add(min, second);

        function add(min, second) {
            document.querySelector("h2").textContent = min + ":" + second;
            // console.log("change");
        }


    }
    var timer = setInterval(function () {
        addTime();
        if(sessionStorage.getItem("isOver")=="true"){
            clearInterval(timer);
        }
    }, 1000);

}

function stop() {
    /*踩到雷了或邀请卡或游戏时长大于10min*/
    if (something) {

    }
}

function attention(text) {
    /*把这个display的对象中文本改掉 */
}

function show(id) {
    var obj = document.getElementById(String(id));
}

function close(type, name, method) {
    if (type == "classname") {
        var obj = document.getElementsByClassName(String(name));
    } else {
        var obj = document.getElementById(String(name));
    }
    if (method == "vis") {
        /*visiablity */
    } else {
        /* disaplay none*/
    }
}
window.onload = function () {
    checkBBT();
    var name = localStorage.getItem("you");

}