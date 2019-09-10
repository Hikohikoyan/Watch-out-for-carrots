var one = "#ffdb80";
var two = "a1dbcb ";
var minemap = new Map();
var num = 0;

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
    addColor();
    num = 0;
    sessionStorage.setItem("isOver", "false");
}

function createTd() {
    minemap.clear();
    for (let a = 1; a < 7; a++) {
        let line = a;
        for (let b = 1; b < 7; b++) {
            let column = b;
            var td = createEle(line, column, "false", "floor");
            minemap.set("{" + line + "," + column + "}", td);
        }
    }
}

function createEle(line, column, flag, type) {
    let obj = new Object;
    obj.line = line;
    obj.column = column;
    obj.flag = flag;
    obj.type = type;
    return obj;
}

const startbtn = document.querySelector("#start");
const backbtn = document.querySelector("#back");
var clicktime = 0;

function listener() {
    var yourmove = document.getElementById('yTable');
    yourmove.addEventListener('click', function (e) {
        console.log(e)
        // console.log(document.getElementById(e.toElement.id).dataset);
        clicktime++;
        move(e.toElement.id, e.path[1].id);
        console.log(e.path[1].id + "," + e.toElement.id);
    }, false);
}
premap();
startbtn.addEventListener('mousemove', listener, false);
backbtn.addEventListener('click', function () {
    window.location.reload();
}, false);

function move(td, tr) {
    var y = Number(td.replace("you-column", ""));
    var elementy = document.getElementById(tr).childNodes[y-1];
    var x = Number(tr.replace("you-line", ""));
    var elementg = document.getElementById("tr" + x).childNodes[y - 1];
    var grass = "{" + x + "," + y + "}";
    var inside = minemap.get(grass);
    if (clicktime == 1) {
        inside.type = "floor";
        removegrass(elementg, grass);
        return;
    }
    var flag = gamer(inside.type);
    if (flag == true) {
        if (inside.flag == "true") {
            return;
        }
        num = num + 1;
        document.getElementById('statistics').textContent = String(num);
        removegrass(elementg, grass);
        inside.flag = "true";
        document.getElementById(td).style.cssText = "pointer-events: none;";
        return;
    } else {
        removegrass(elementg, grass);
    }
}

function removegrass(elementg, obj) {
    elementg.setAttribute('class', minemap.get(obj).type);
}

function addCarrots() {
    //传过来出发点
    var minesnum = 7;
    var whitenum = 5;
    var total = whitenum + minesnum + 1;
    randommines();

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
        console.log(arr1);
        console.log(arr2);
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
            let obj = createEle(arr1[i], arr2[i], "false", "orange")
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
            let obj = createEle(arr1[i], arr2[i], "false", "white")
            minemap.set("{" + arr1[i] + "," + arr2[i] + "}", obj);
        }
        let obj = createEle(arr1[13], arr2[13], "false", "welcome")
        minemap.set("{" + arr1[13] + "," + arr2[13] + "}", obj);
        console.log(minemap);
    }
}

function addColor() {
    function check(type) {
        if (type == "orange") {
            return true;
        } else {
            return false;
        }
    }

    function switchColor(num, x, y) {
        var elementg = document.getElementById("tr" + x).childNodes[y - 1].id; //x line y column
        function paint(color) {
            document.getElementById(elementg).style.cssText = "background-color:" + color + ";";
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
    for (let x = 1; x < 7; x++) {
        for (let y = 1; y < 7; y++) {
            let current = minemap.get("{" + x + "," + y + "}"); //line column
            if(current.type!="floor"){
                return;
            }
            let mine = 0;
            if (minemap.has("{" + x + "," + y - 1 + "}")) {
                var left = minemap.get("{" + x + "," + y - 1 + "}");
                if (check(bottom.type)) {
                    mine++;
                }
            }
            if (minemap.has("{" + x + "," + y + 1 + "}")) {
                var right = minemap.get("{" + x + "," + y + 1 + "}");
                if (check(bottom.type)) {
                    mine++;
                }
            }
            if (minemap.has("{" + x - 1 + "," + y + "}")) {
                var top = minemap.get("{" + x - 1 + "," + y + "}");
                if (check(bottom.type)) {
                    mine++;
                }
            }
            if (minemap.has("{" + x + 1 + "," + y + "}")) {
                var bottom = minemap.get("{" + x + 1 + "," + y + "}");
                if (check(bottom.type)) {
                    mine++;
                }
            }
            switchColor(mine,x,y);
        }
    }
}

function gamer(type) {
    console.log(num);
    console.log(type);
    if (type == "white") {
        return true;
    }
    if (type == "orange") {
        console.log("GameOver");
        sessionStorage.setItem("isOver", "true");
        document.getElementById('yTable').style.cssText = "background-image:unset;pointer-events: none;";
        return false;
    }
    if (type == "welcome") {
        return -1;
    }
    return 2;
}