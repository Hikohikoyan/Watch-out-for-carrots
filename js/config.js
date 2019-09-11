const startbtn = document.querySelector("#start");
const backbtn = document.querySelector("#back");
document.getElementById('attcha').addEventListener('click',cha,false);
function cha(){
    document.getElementById('attentionbox').style.cssText='visibility: hidden;';
}

function attention(text) {
    document.getElementById('attention').textContent=String(text);
    document.getElementById('attentionbox').style.cssText="visibility: unset;";
}
function read_statuscode(statusCode, responseText) { //用来提示的 仅此而已
    if (statusCode == 200) {
        attention("Success!");
        response = JSON.stringify(responseText);
        if (response.errcode == "40003") {
            attention("Wrong!");
        }
        return responseText;
    } else {
        switch (statusCode) {
            case 419:
                attention("还没有关注公众号");
                window.location.href = "https://hemc.100steps.net/2018/fireman/auth.php?redirect=https://hemc.100steps.net/2019/wish-pokemon/api/Check_login&state=gsudndu13Sd";
                break;
            case 430:
                attention("活动还没开始哦, 敬请期待~");
                break;
            case 431:
                attention("活动已经结束啦, 感谢关注~");
                break;
            case 500:
                attention("网络出了点小问题");
                break;
            case 402:
                attention("网络出了点小问题");
                break;
            case 404:
                attention("网络出了点小问题");
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
            if (casename == "complete") {
                storage = JSON.parse(xmlhttp.responseText);
                var len = storage.all.length;
                var rank3 = new Object;
                for (let i = 0; i <= len; i++) {
                    rank3.username = storage.all[i].username;
                    rank3.time = storage.all[i].time;
                    rank3.times = storage.all[i].times;
                    sessionStorage.set("now" + i, rank3);
                }
                // let your = new Object;
                // let your = storage.self.times;
                // let your.time = storage.self.time;
                // let your.rank = storage.self.rank;
                return;
            }
            if (casename == "ranklist") {
                storage = JSON.parse(xmlhttp.responseText);
                console.log(storage);
                if(storage.all!=null&&storage.self!=null){
                var len = storage.all.length;
                sessionStorage.setItem("listnum",len);
                sessionStorage.setItem("yourrank",1);
                let rankobj = new Object;
                for (let i = 0; i <= len; i++) {
                    rankobj.username = storage.all[i].username;
                    rankobj.time = storage.all[i].time;
                    rankobj.times = storage.all[i].times;
                    rankarr[i] = rankobj;
                }
                let mine =storage.self;
                sessionStorage.setItem("yourrank",String(mine));
                return;
            }else{
                sessionStorage.setItem("listnum",0);
                sessionStorage.setItem("yourrank",0);
            }
            }
        }
    }
}