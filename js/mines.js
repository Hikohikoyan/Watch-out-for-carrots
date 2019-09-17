var minemap = new Map();
var rankarr = new Array();
var num = 0;
var clicktime = 0;
function premap() {
    function prenodes(classname, name,line) {
        var pair = "";
        for (var j = 1; j < 7; j++) {
            pair = pair + "<td class='" + classname + "'id='" + name +line+','+ j + "' style='cursor:pointer;'></td>";
        }
        return pair;
    }
    var pair2 = "";
    var pair3 = "";
    for (let a = 1; a < 7; a++) {
        pair2 = pair2 + "<tr class='line' id='tr" + a + "' >" + prenodes("mines", "td",a) + "</tr>";
        pair3 = pair3 + "<tr class='you-map' id='you-line" + a + "' data-index='1'" + ">" + prenodes("you-column", "you-column",a) + "</tr>";
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
    let obj = new Object;
    obj.flag = flag;
    obj.type = type;
    obj.num = num;
    return obj;
}
function listener() {
    var yourmove = document.getElementById('yTable');
    if(isiOS==true){
        alert('ios');
    }
    // document.getElementsByClassName('you-column').length;
        // document.body.addEventListener('touchstart', function (e) {
        //     yourmove.addEventListener('click', function (e) {
        //     alert(e.toElement);
        //     console.log(e.toElement);
        // move(e.toElement.id);
        // }, false);
    //     return;
    // }
    // if(isAndroid==true){
        yourmove.addEventListener('click', function (e) {
            e.preventDefault();
            // alert(e.target.id);
            move(e.target.id);//, e.path[1].id
            // move(e.toElement.id);//, e.path[1].id
        }, false);
    // }

    // if(isiOS==false&&isAndroid==false){
    //     attention("不支持该设备");
    // }
}
premap();
startbtn.addEventListener('mousemove', listener, false);
function move(td) {//, tr
    // console.time('move');
    // console.log(td);
    var y = Number((td.replace("you-column", "")).split(",")[1]);
    var x = Number((td.replace("you-column", "")).split(",")[0]);//  (tr.replace("you-line", ""))
    console.log(x+","+y);
    if (x == "" || x == undefined || y == undefined || y == "yTable"||y == " ") {
        return;
    }
    tdname="td"+x+","+y;
    var elementg = document.getElementById(tdname);//"#td" + y [x - 1]
    var grass = "{" +x+","+y + "}";
    var inside = minemap.get(grass);
    if (inside.flag||JSON.parse(sessionStorage.getItem('isOver'))==true||inside.flag==undefined) {//有没有点过这个el
        return;
    }
    switch(gamer(inside.type)) {
        // 踩到白萝卜
        case 1:
        {
            num = num + 1;
            document.getElementById('statistics').textContent = String(num);
            if(num==5&&sessionStorage.getItem('isOver')){complete(num);}
            removegrass(elementg, grass);
            inside.flag = true;
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
                    let element = document.getElementById("td"+line+","+column);
                    removegrass(element, "{" + line + "," + column + "}");
                }
            }
            sessionStorage.setItem("isOver", true);
            complete(0);
            break;
        }
        case 2:
        {
            inside.flag = true;
            removegrass(elementg, grass);
            break;
        }
        //部门邀请卡
        case -1:
        {
            inside.flag = true;
            welcome();
            removegrass(elementg, grass);
            attention("你发现了草丛中的礼物！");
            sessionStorage.setItem("welcome",1)
            break;
        }
    }
    console.timeEnd('move');
}

function complete(num) {
    //游戏完成  失败则给时间=0 成功给实际用时
    // document.getElementById('yTable').style.cssText += "pointer-events: none;";
    var url = "";
    url=completeurl;
    var casename = "complete";
    var finaltime = Number(document.querySelector("h2").textContent.split(":")[0]) * 60 + Number(document.querySelector("h2").textContent.split(":")[1]);

    if (num == 5) {
        document.querySelector('h4').textContent="恭喜你成功了！";
        url = url + "?time=" + finaltime;
        if(finaltime<5){
        attention("时间错乱了！");
        return;
        }
        if(sessionStorage.getItem('welcome')==1){
            document.querySelector('h4').textContent="恭喜你成功了！";
            url = url + "?time=" + (finaltime-1);
        }
        sessionStorage.setItem('isOver',true);
        document.getElementById('completebox').style.cssText +="display:block";
        get(url, casename,function(data){
            data=JSON.parse(data);
            document.querySelector("p.yours").textContent="你曾经失败了"+String(data.self.times)+"次,挑战成功最短用时："+String(data.self.time == 10000000?0:rewriteTime( data.self.time ))+"\
            目前排名第"+data.self.rank+"位!";
            document.getElementsByClassName('show')[2].textContent=String(data.all[0].username);
        });    
    } else {
        document.querySelector('h4').textContent="别灰心！再试一次吧~"
        url = url + "?time=" + 0;
        sessionStorage.setItem('isOver',true);
        document.getElementById('completebox').style.cssText +="display:block";
        get(url, casename,function(data){
            data=JSON.parse(data);
            document.querySelector("p.yours").textContent="你曾经失败了"+String(data.self.times)+"次,挑战成功最短用时："+String(data.self.time == 10000000?0:rewriteTime( data.self.time ))+"\
            目前排名第"+data.self.rank+"位!";
        });    
    }
    return;
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
    console.time('addmine');
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
    console.timeEnd('addmine');

}

function addColor() {
    //先遍历找floor再传过去找上下左右的雷 然后给地板添加颜色
    for (let x = 1; x < 7; x++) {
        for (let y = 1; y < 7; y++){
            var now=minemap.get("{"+x+","+y+"}");
            if(now.type == 'floor') {
                minemap.set("{"+x+","+y+"}",addmineNum(x,y));
            }
        }
    }
}
function switchColor(num, x, y) {
    ele = document.getElementById("td"+x+","+y);
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
    console.time('gamer');
    if (type == "white") {
        return 1;
    }
    if (type == "orange") {
        attention("哎呀！是胡萝卜！");
        return 0;
    }
    if (type == "welcome") {
        return -1;
    }
    console.timeEnd('gamer');
    return 2;
}
