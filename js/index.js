var storage = JSON;
document.getElementById('ranklist').addEventListener('click', rank, false);

function rank() {
    var flag;
    document.querySelector('h2').textContent = "排行榜";
    document.getElementById('gTable').style.cssText = "display:none;";
    document.getElementById('dengji_img').style.cssText = "display:none;";
    document.getElementById('ranklist').removeEventListener('click', rank);
    attention("新鲜出炉的排行榜！");

    var totallist = Number(sessionStorage.getItem("listnum"));
    var your = sessionStorage.getItem("yourrank");

    function prenodes(classname, name) {
        var pair = "";
        for (var j = 0; j < 4; j++) {
            pair = pair + "<td class='" + classname + "'id='" + name + Number(j + 1) + "'></td>";
        }
        return pair;
    }
    var list2 = "";
    for (let a = 0; a <= totallist + 1; a++) {
        if (a == 0) {
            var linename = "rankcaption";
        } else {
            linename = "rankline";
        }
        list2 = list2 + "<tr class='" + linename + "' id='rankline" + Number(a + 1) + "' >" + prenodes("ranklist", "rankitem") + "</tr>";
    }
    document.getElementById('yTable').innerHTML = list2;
    document.getElementById('yTable').setAttribute('class', "ranktable")
    document.getElementById('rankline1').childNodes[0].innerText = "名次";
    document.getElementById('rankline1').childNodes[1].innerText = "用户名";
    document.getElementById('rankline1').childNodes[2].innerText = "成功用时";
    document.getElementById('rankline1').childNodes[3].innerText = "失败次数";
    document.getElementsByClassName('gaming')[0].style.cssText = "visibility:hidden;"
    if (totallist == 0) {
        flag = false; //没有人玩
        document.getElementById('rankline2').innerText = "暂时无人上榜";
        document.getElementById('rankline2').style.cssText = "color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
        if (your == 0) {
            document.getElementById('rankline3').innerText = "你还没有玩呢";
            document.getElementById('rankline3').style.cssText = "color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
            return;
        }
    }

    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    get("js/rank.json", "ranklist", function (data) {
        list = JSON.parse(data);
        var yourline = document.querySelector("#yTable>tbody").lastChild.id;
        document.getElementById(yourline).childNodes[0].innerText = Number(list.self[0].rank);
        document.getElementById(yourline).childNodes[0].innerText = list.self[0].username;
        console.log(list.self[0]);
        if (list.self[0].time == 10000) {
            document.getElementById(yourline).childNodes[0].innerText = 0;
        } else {
            document.getElementById(yourline).childNodes[0].innerText = list.self[0].time;
        }
        document.getElementById(yourline).childNodes[0].innerText = list.self[0].time3;
        if (flag != false && list.all != undefined) {
            let len = 11;
            console.log(list.all);
            for (let i = 0; i <= len; i++) {
                let linename = "rankline" + i;
                document.getElementById(linename).childNodes[0].innerText = sessionStorage.getItem("yourrank");
                document.getElementById(linename).childNodes[1].innerText = list.self[0].username;
                document.getElementById(linename).childNodes[2].innerText = list.self[0].time;
                document.getElementById(linename).childNodes[3].innerText = list.self[0].times;
            }
        }
    });

    setTimeout(() => {
        document.getElementById('ranklist').addEventListener('click', rank, false);
    }, 60000);
}
//常用的按钮

startbtn.addEventListener('click', clearTable, false);

function clearTable() {
    // clearInterval(tinterval);
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    let num = document.querySelectorAll("td").length;
    for (let i = 0; i < num; i++) {
        document.querySelectorAll("td")[i].style.cssText = "display:table-cell;";
    }
    startbtn.removeEventListener('click', clearTable);
    startbtn.addEventListener('click', restart, false);
    start();
}

function restart() {
    document.getElementById("start").value = "重新开始";
    startbtn.addEventListener('click', function () {
        // clearInterval(tinterval);
        premap();
        listener();
        sessionStorage.setItem("isOver", true);
        clearTable();
        document.getElementById('statistics').textContent = "0";
        num = 0;
        document.querySelector('h2').textContent = "00:00";
        setTimeout(() => {
            sessionStorage.setItem("isOver", false);
            startbtn.setAttribute('disabled', 'disabled');
        }, 100);
        if (clicktime > 3) {
            attention("慢慢来不要急");
        }
        setTimeout(() => {
            startbtn.removeAttribute('disabled');
        }, 5000);
    });
}

function start() {
    document.getElementById('completebox').style.cssText += "display:none";
    document.querySelector("h2").style.cssText = " -webkit-text-stroke-color: #8c6e62;-webkit-text-stroke-width: 2.5px;";
    var second = 0;
    var min = 0;
    clearTimeout(timeout);
    setTimeout(startCount, 1000);
    function addTime() {
        second++;
        //  console.log(second);
        if (sessionStorage.getItem('welcome') == 1) {
            second = second - 1;
            sessionStorage.setItem('welcome', 0);
        }
        if (second > 59) {
            min++;
            second = second - 60;
        }
        if (min == 5) {
            // clearInterval(tinterval);
            attention("时间到！！");
        }
        add(min, second);

        function add(min, second) {
            str_second = String(second);
            str_min = 0 + String(min);
            if (second < 10) {
                str_second = 0 + str_second;
            }
            // console.log("change");
            document.querySelector("h2").textContent = str_min + ":" + str_second;
        }
    }
    function startCount() {
        addTime();
        timeout = setTimeout(startCount, 1000);
        if (JSON.parse(sessionStorage.getItem("isOver"))) {
            clearTimeout(timeout);
            return;
        }
    }

    document.getElementById('ranklist').addEventListener('click', function () {
        // clearInterval(tinterval);
    }, false);
}