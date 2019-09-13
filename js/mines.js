var minemap = new Map();
var rankarr = new Array();
var num = 0;

var clicktime = 0;


function premap() {
    function prenodes(classname, name) {
        var pair = "";
        for (var j = 1; j < 7; j++) {
            pair = pair + "<td class='" + classname + "'id='" + name + j + "'></td>";
        }
        return pair;
    }
    var pair2 = "";
    var pair3 = "";
    for (let a = 1; a < 7; a++) {
        pair2 = pair2 + "<tr class='line' id='tr" + a + "' >" + prenodes("mines", "td") + "</tr>";
        pair3 = pair3 + "<tr class='you-map' id='you-line" + a + "' data-index='1'" + ">" + prenodes("you-column", "you-column") + "</tr>";
    }

    document.getElementById('gTable').innerHTML = pair2;
    document.getElementById('yTable').innerHTML = pair3;
    createTd();
    addCarrots();
    num = 0;
    sessionStorage.setItem("isOver", "false");
}

function createTd() {
    minemap.clear();
    for (let a = 0; a < 6; a++) {
        let line = a + 1;
        for (let b = 0; b < 6; b++) {
            let column = b + 1;
            var td = createEle("false", "floor");
            minemap.set("{" + line + "," + column + "}", td);
        }
    }
}

function createEle(flag, type) {
    // console.log(line+"_____________"+column);
    let obj = new Object;
    // obj.line = line;
    // obj.column = column;
    obj.flag = flag;
    obj.type = type;
    obj.num = 0;
    return obj;
}


function listener() {
    var yourmove = document.getElementById('yTable');
    yourmove.addEventListener('click', function (e) {
        // console.log(e);
        // console.log(document.getElementById(e.toElement.id).dataset);
        clicktime++;
        move(e.toElement.id, e.path[1].id, e.target);
        // console.log(e.path[1].id + "," + e.toElement.id);
    }, false);
}
premap();
startbtn.addEventListener('mousemove', listener, false);
backbtn.addEventListener('click', function () {
    window.location.reload();
}, false);

function move(td, tr, target) {
    if (tr == "" || td == undefined || tr == undefined || td == "yTable") {
        return;
    }
    var y = Number(td.replace("you-column", ""));
    // var elementy = document.getElementById(tr).childNodes[y-1];
    var x = Number(tr.replace("you-line", ""));
    var elementg = document.getElementById("tr" + x).childNodes[y - 1];
    var grass = "{" + x + "," + y + "}";
    var inside = minemap.get(grass);
    if (clicktime == 1) {//第一次点击时设置为0 地板
        inside.type = "floor";
        removegrass(elementg, grass);
        return;
    }
    var flag = gamer(inside.type);//游戏是否结束
    if (flag == true) {
        if (inside.flag == "true") {//有没有点过这个el
            return;
        }
        num = num + 1;
        document.getElementById('statistics').textContent = String(num);
        removegrass(elementg, grass);
        inside.flag = "true";
        target.removeEventListener('click', function (e) {
            clicktime++;
            move(e.toElement.id, e.path[1].id, e.target);
            console.log(e.path[1].id + "," + e.toElement.id);
        }, false);
        return;
    } else if (flag == "false") {//游戏结束 但是要把胡萝卜显示出来
        removegrass(elementg, grass);
        for (let a = 0; a < 6; a++) {
            let line = a + 1;
            for (let b = 0; b < 6; b++) {
                let column = b + 1;
                let element = document.getElementById("tr" + line).childNodes[column - 1];
                if (element == undefined) {
                    console.log(line + "," + column);
                    return;
                }
                removegrass(element, "{" + line + "," + column + "}");
            }
        }
        sessionStorage.setItem("isOver", "true");
        document.getElementById('yTable').style.cssText = "background-image:unset;pointer-events: none;";
        return;
    }
    if (flag == 2) {
        removegrass(elementg, grass);
        return;
    }
    if (flag == -1) {//部门邀请卡
        //welcome
        attention("welcome");
        return;
    }
}

function complete(num) {
    //游戏完成  失败则给时间=0 成功给实际用时
    var url = "http://203.195.221.189:5000/insert";
    var casename = "complete";
    var finaltime = Number(document.querySelector("h2").textContent.split(":")[0]) * 60 + Number(document.querySelector("h2").textContent.split(":")[1]);
    if (num == 5) {
        url = url + "?time=" + finaltime;
    } else {
        url = url + "?time=" + 0;
    }
    get(url, casename);
}

function removegrass(elementg, obj) {
    //对应type切换class 显示草下面的萝卜
    elementg.setAttribute('class', minemap.get(obj).type);
}
function addmineNum(x,y,total){
    //以floor 类型的草为中心 从上下左右找雷 雷的obj.num为1  只需要一直叠加最后输出这个数
    var havetop=true;
    var havebottom=true;
    var haveleft=true;
    var haveright=true;
    switch (x) {
        case 1:
            havetop=false;
            break;
        case 6:
            havebottom=false;
            break;
        default:
            break;
    }
    switch (y) {
        case 1:
            haveleft=false;
            break;
        case 6:
            haveright=false;
            break;
        default:
            break;
    }
    if(havetop==true){
        var top=Number(minemap.get("{"+x-1+","+y+"}").num);
        total=total+top;
    }
    if(havebottom==true){
        var bottom=Number(minemap.get("{"+x+1+","+y+"}").num);
        total=total+bottom;
    }
    if(haveleft==true){
        var left=Number(minemap.get("{"+x+","+y-1+"}").num);
        total=total+left;
    }
    if(haveright==true){
        var right=Number(minemap.get("{"+x+","+y+1+"}").num);
        total=total+right;
    }
    return total;
}
function addCarrots() {
    //有点点随机的布雷
    var minesnum = 7;
    var whitenum = 5;
    var total = whitenum + minesnum + 1;
    randommines();
    addColor();
    function randommines() {
        var arr1 = new Array();
        var arr2 = new Array();

        for (let i = 1; i <= total; i++) {
            arr1[i] = Math.round(Math.random() * 10000000 % 36);
            arr2[i] = Math.round(Math.random() * 10000000 % 36);
        }

        function sortNumber(a, b) {
            return a - b
        }
        arr1.sort(sortNumber);
        arr2.sort(sortNumber);
        // console.log(arr1);
        // console.log(arr2);
        for (let i = 1; i <= minesnum; i++) {
            if (arr1[i] == 6 || arr1[i] == 0 || arr1[i] == NaN || arr1[i] == 1) {
                arr1[i] = 6;
            } else {
                arr1[i] = arr1[i] % 6;
                if (arr1[i] == 0) {
                    arr1[i] = 1;
                }
            }
            if (arr2[i] == 6 || arr2[i] == 0 || arr2[i] == NaN || arr2[i] == 1) {
                arr2[i] = 6;
            } else {
                arr2[i] = arr2[i] % 6;
                if (arr2[i] == 0) {
                    arr2[i] = 1;
                }
            }
            let obj = createEle("false", "orange",1);
            minemap.set("{" + arr1[i] + "," + arr2[i] + "}", obj);
        }
        for (let i = 8; i < 12; i++) {
            if (arr1[i] == 6 || arr1[i] == 0 || arr1[i] == NaN || arr1[i] == 1) {
                arr1[i] = 6;
            } else {
                arr1[i] = arr1[i] % 6;
                if (arr1[i] == 0) {
                    arr1[i] = 1;
                }
            }
            if (arr2[i] == 6 || arr2[i] == 0 || arr2[i] == NaN || arr2[i] == 1) {
                arr2[i] = 6;
            } else {
                arr2[i] = arr2[i] % 6;
                if (arr2[i] == 0) {
                    arr2[i] = 1;
                }
            }
            let obj = createEle("false", "white")
            minemap.set("{" + arr1[i] + "," + arr2[i] + "}", obj);
        }
        let obj = createEle("false", "welcome")
        if (arr1[12] % 6 == 0) {
            arr1[12] = arr1[12] % 6 + 1;
        }
        if (arr2[12] % 6 == 0) {
            arr2[12] = arr2[12] % 6 + 1;
        }
        minemap.set("{" + arr1[12] % 6 + "," + arr2[12] % 6 + "}", obj);
        console.log(minemap);
    }
}

function addColor() {
    //先遍历找floor再传过去找上下左右的雷 然后给地板添加颜色
    let obj=createEle("false", "floor");
    for (let x = 1; x < 7; x++) {
        for (let y = 1; y < 7; y++){
            var now=minemap.get("{"+x+","+y+"}");
            if(now==obj){
                minemap.set("{"+x+","+y+"}",addmineNum(x,y,0));
                switchColor(addmineNum(x,y,0),x,y);
            }
        }
    }
}
function switchColor(num, x, y) {
    y = y + 1;
    console.log(x + y);
    var elementg = document.getElementById("tr" + x).childNodes[y - 1].id; //x line y column
    console.log(elementg);

    function paint(color) {
        console.log("background-color:" + color + ";");
        document.getElementById(String(elementg)).style.cssText = "background-color:" + color + ";";
    }
    switch (num) {
        case 1:
            paint("#a1dbcb");
            break;
        case 2:
            paint("#ffdb80");
            break;
        case 3:
            paint("#ffb583");
            break;
        case 4:
            paint("#ff8080");
            break;
        default:
            break;
    }
}
function gamer(type) {
    // console.log(num);
    console.log(type);
    if (type == "white") {
        return true;
    }
    if (type == "orange") {
        attention("GameOver");
        return false;
    }
    if (type == "welcome") {
        return -1;
    }
    return 2;
}