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
        pair2 = pair2 + "<tr class='line' id='tr" + a + "'>" + prenodes("mines", "td") + "</tr>";
        pair3 = pair3 + "<tr class='you-map' id='you-line" + a + "'>" + prenodes("you-column", "you-column") + "</tr>";
    }
    document.getElementById('gTable').innerHTML = pair2;
    document.getElementById('yTable').innerHTML = pair3;
    addCarrots();
}
sessionStorage.setItem("isOver", "false");
var num = Number(document.getElementById('statistics').textContent);

const startbtn = document.querySelector("#start");
const backbtn = document.querySelector("#back");
var clicktime = 0;
var minemap = new Map();

function listener() {
    var yourmove = document.getElementById('yTable');
    yourmove.addEventListener('click', function (e) {
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
    var flag = 0;
    var y = Number(td.replace("you-column", ""));
    // var elementy=document.getElementById(tr).childNodes[y];
    var x = Number(tr.replace("you-line", ""));
    var elementg = document.getElementById("tr" + x).childNodes[y - 1];
    var obj = "{" + x + "," + y + "}";
    var type = String(minemap.get(obj));
    if (clicktime == 1) {
        minemap.set(obj, "floor");
    }
    if (gamer(type) == false) {
        flag++;
    }
    if (flag <= 1) {
        removegrass(elementg, obj);
    }
    // return;
    //if()解锁成就
}

function removegrass(elementg, obj) {
    // console.log("{"+x+","+y+"}");
    // var obj="{"+x+","+y+"}"
    var type = String(minemap.get(obj));
    elementg.setAttribute('class', type);
}

function addCarrots() {
    //传过来出发点
    var minesnum = 7;
    var whitenum = 5;
    var total=whitenum+minesnum+1;
    randommines();

    function randommines() {
        var arr1 = new Array();
        var arr2 = new Array();
        for (let i = 0; i < total; i++) {
            arr1[i] = Math.round(Math.random() * 10000000 % 36);
            arr2[i] = Math.round(Math.random() * 10000000 % 36);
        }
        function sortNumber(a, b) {
            return a - b
        }
        arr1.sort(sortNumber);
        arr2.sort(sortNumber);
        for(let i=0;i<minesnum;i++){
            if(arr1[i]==6||arr1[i]==0){
                arr1[i]=6;
            }else{
                arr1[i]=arr1[i]%6;
            }
            if(arr2[i]==6||arr2[i]==0){
                arr2[i]=6;
            }else{
                arr2[i]=arr2[i]%6;
            }
            minemap.set("{"+arr1[i]+","+arr2[i]+"}","orange");
        }
        for(let i=minesnum;i<minesnum+whitenum;i++){
            if(arr1[i]==6||arr1[i]==0){
                arr1[i]=6;
            }else{
                arr1[i]=arr1[i]%6;
            }
            if(arr2[i]==6||arr2[i]==0){
                arr2[i]=6;
            }else{
                arr2[i]=arr2[i]%6;
            }
            minemap.set("{"+arr1[i]+","+arr2[i]+"}","white");
        }
        total=total-1;
        minemap.set("{"+arr1[total]%6+","+arr2[total]%6+"}","welcome");
    console.log(minemap);
}
}

function gamer(type) {
    if (type == "white") {
        num = num + 1;
        document.getElementById('statistics').textContent = String(num);
    }
    if (type == "orange") {
        console.log("GameOver");
        sessionStorage.setItem("isOver", "true");
        document.getElementById('yTable').style.cssText = "background-image:unset;pointer-events: none;";
        return false;
    }
}