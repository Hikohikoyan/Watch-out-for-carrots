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
    sessionStorage.setItem("isOver", false);
}

function createTd() {
    minemap.clear();
    for (let a = 0; a < 6; a++) {
        let line = a + 1;
        for (let b = 0; b < 6; b++) {
            let column = b + 1;
            var td = createEle(false, "floor", 0);
            minemap.set("{" + line + "," + column + "}", td);
        }
    }
}

function createEle(flag, type, num) {
    // console.log(line+"_____________"+column);
    let obj = new Object;
    // obj.line = line;
    // obj.column = column;
    obj.flag = flag;
    obj.type = type;
    obj.num = num;
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
    var elementg = document.querySelectorAll("#td" + y)[x - 1];
    var grass = "{" + x + "," + y + "}";
    var inside = minemap.get(grass);
    switch(gamer(inside.type)) {
        // 踩到白萝卜
        case 1:
        {
            if (inside.flag) {//有没有点过这个el
                return;
            }
            num = num + 1;
            document.getElementById('statistics').textContent = String(num);
            if(num==5){complete(num);}
            removegrass(elementg, grass);
            inside.flag = true;
            target.removeEventListener('click', function (e) {
                clicktime++;
                move(e.toElement.id, e.path[1].id, e.target);
                console.log(e.path[1].id + "," + e.toElement.id);
            }, false);
            break;
        }
        //游戏结束 但是要把胡萝卜显示出来
        case 0:
        {
            removegrass(elementg, grass);
            for (let a = 0; a < 6; a++) {
                let line = a + 1;
                for (let b = 0; b < 6; b++) {
                    let column = b + 1;
                    let element = document.querySelectorAll("#td" + column)[line - 1];

                    removegrass(element, "{" + line + "," + column + "}");
                }
            }
            sessionStorage.setItem("isOver", true);
            complete(0);
            document.getElementById('yTable').style.cssText = "background-image:unset;pointer-events: none;";
            break;
        }
        case 2:
        {
            removegrass(elementg, grass);
            break;
        }
        //部门邀请卡
        case -1:
        {
            removegrass(elementg, grass);
            attention("welcome");
            sessionStorage.setItem("isOver", true);
            // if(document.getElementsByClassName('cha')[1].)
            break;
        }
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
    sessionStorage.setItem('isOver',true);
    document.getElementById('completebox').style.cssText +="display:unset";
    get(url, casename,function(data){
        data=JSON.parse(data);
    });
}

function removegrass(elementg, obj) {
    //对应type切换class 显示草下面的萝卜
    elementg.setAttribute('class', minemap.get(obj).type);
    if(minemap.get(obj).type == "floor"){
        switchColor(minemap.get(obj).num, obj[1], obj[3]);
    }
}

function addmineNum(x,y){
    //以floor 类型的草为中心 从上下左右找雷 雷的obj.num为1  只需要一直叠加最后输出这个数
    var num = 0;
    if (x - 1 > 0) {
        var upper = minemap.get("{" + (x - 1) + "," + y + "}");
        if (upper.type == 'orange') {
            num += upper.num
        }
    }
    if (x + 1 <= 6) {
        var lower = minemap.get("{" + (x + 1) + "," + y + "}");
        if (lower.type == 'orange') {
            num += lower.num
        }
    }
    if (y - 1 > 0) {
        var left = minemap.get("{" + x + "," + (y - 1) + "}");
        if (left.type == 'orange') {
            num += left.num
        }
    }
    if (y + 1 <= 6) {
        var right = minemap.get("{" + x + "," + (y + 1) + "}");
        if (right.type == 'orange') {
            num += right.num
        }
    }
    var ele = createEle(false, "floor", num);
    return ele;
}

function addCarrots() {
    //有点点随机的布雷
    var minesnum = 7, whitenum = 5, welcomenum = 1;
    var total = whitenum + minesnum + welcomenum;

    randommines();
    addColor();

    function randommines() {
        var arr = [];
        for (var i = 0; i < 6 * 6; i++) {
            arr.push(i);
        }

        for (var i = 0; i < minesnum; i++) {
            var idx = Math.floor(Math.random() * arr.length);
            var x = Math.floor(arr[idx] / 6) + 1, y = arr[idx] % 6 + 1;
            arr.splice(idx, 1);

            var obj = createEle(false, "orange", 1);
            minemap.set("{" + x + "," + y + "}", obj);
        }

        for (var i = 0; i < whitenum; i++) {
            var idx = Math.floor(Math.random() * arr.length);
            var x = Math.floor(arr[idx] / 6) + 1, y = arr[idx] % 6 + 1;
            arr.splice(idx, 1);

            var obj = createEle(false, "white", 0);
            minemap.set("{" + x + "," + y + "}", obj);
        }

        var idx = Math.floor(Math.random() * arr.length);
        var x = Math.floor(arr[idx] / 6) + 1, y = arr[idx] % 6 + 1;
        arr.splice(idx, 1);

        var obj = createEle(false, "welcome", 0);
        minemap.set("{" + x + "," + y + "}", obj);
    }
}

function addColor() {
    //先遍历找floor再传过去找上下左右的雷 然后给地板添加颜色
    for (let x = 1; x < 7; x++) {
        for (let y = 1; y < 7; y++){
            var now=minemap.get("{"+x+","+y+"}");
            if(now.type == 'floor') {
                minemap.set("{"+x+","+y+"}",addmineNum(x,y));
                // console.log(minemap.get("{"+x+","+y+"}"));
            }
        }
    }
}
function switchColor(num, x, y) {
    ele = document.querySelectorAll("#td" + y)[x - 1]
    switch (num) {
        case 1:
            ele.style.backgroundColor = "#a1dbcb";
            break;
        case 2:
            ele.style.backgroundColor = "#ffdb80";
            break;
        case 3:
            ele.style.backgroundColor = "#ffb583";
            break;
        case 4:
            ele.style.backgroundColor = "#ff8080";
            break;
        default:
            break;
    }
}

function gamer(type) {
    if (type == "white") {
        return 1;
    }
    if (type == "orange") {
        attention("GameOver");
        return 0;
    }
    if (type == "welcome") {
        return -1;
    }
    return 2;
}
