var storage = JSON;
document.getElementById('ranklist').addEventListener('click',rank,false);
function rank(){
    document.querySelector('h2').textContent="排行榜";
    document.getElementById('gTable').style.cssText="display:none;";
    document.getElementById('dengji_img').style.cssText="display:none;";
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    document.getElementById('ranklist').removeEventListener('click',rank);
    attention("新鲜出炉的排行榜！");
    //写表
    function prenodes(classname, name) {
        var pair = "";
        for (var j = 1; j <= 4; j++) {
            pair = pair + "<td class='" + classname + "'id='" + name + Number(j) + "'></td>";
        }
        return pair;
    }
    //请求
    get("http://203.195.221.189:5000/rank","ranklist",function(data){
        list = JSON.parse(data);
        var totallist = 0
        if(list.all == null){
            totallist = 0
        }else{
            totallist = list.all.length;
        }
        //准备布局

        var list2 = "";
        var linename="";
        for (let a = 0; a <=totallist+1; a++) {
            if(a==0){
                linename="rankcaption";
            }else{
                linename="rankline";
            }
            list2 = list2 + "<tr class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("ranklist", "rankitem") + "</tr>";
        }
        document.getElementById('yTable').innerHTML = list2;
        document.getElementById('yTable').setAttribute('class',"ranktable")
        document.getElementById('rankline0').childNodes[0].innerText="名次";
        document.getElementById('rankline0').childNodes[1].innerText="用户名";
        document.getElementById('rankline0').childNodes[2].innerText="成功用时";
        document.getElementById('rankline0').childNodes[3].innerText="失败次数";
        document.getElementsByClassName('gaming')[0].style.cssText="visibility:hidden;"
        if(totallist==0){
            document.getElementById('rankline1').innerText="暂时无人上榜";
            document.getElementById('rankline1').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
            return ;
        }
        else{
            //证明还是有的
            document.querySelector("#yTable").style.cssText = "background-image:unset;";
             //先处理一下自己的
            var yourline=document.querySelector("#yTable>tbody").lastChild.id;
            if(list.self == null){
                document.getElementById(yourline).innerText="你还没有玩游戏"
                document.getElementById(yourline).style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
            }else{
                document.getElementById(yourline).childNodes[0].innerText=Number(list.self.rank);
                document.getElementById(yourline).childNodes[1].innerText=list.self.username;
                document.getElementById(yourline).childNodes[2].innerText=(list.self.time == 10000000?0:list.self.time);
                document.getElementById(yourline).childNodes[3].innerText=list.self.times;
            }
            //在先试一下所有的排名
            for(let i = 1;i <= totallist;++i){
                let linename="rankline"+i;
                document.getElementById(linename).childNodes[0].innerText=i;
                document.getElementById(linename).childNodes[1].innerText=list.all[i-1].username
                document.getElementById(linename).childNodes[2].innerText=(list.all[i-1].time == 10000000?0:list.all[i-1].time)
                document.getElementById(linename).childNodes[3].innerText=list.all[i-1].times;
            }

        }
        setTimeout(() => {
            document.getElementById('ranklist').addEventListener('click',rank,false);
        }, 60000);
    });
    if(get("http://203.195.221.189:5000/rank","ranklist")==undefined){
        var list2 = "";
        var linename="";
        for (let a = 0; a <=1; a++) {
            if(a==0){
                linename="rankcaption";
            }else{
                linename="rankline";
            }
            list2 = list2 + "<tr class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("ranklist", "rankitem") + "</tr>";
        }
        document.getElementById('yTable').innerHTML = list2;
        document.getElementById('yTable').setAttribute('class',"ranktable")
        document.getElementById('rankline0').childNodes[0].innerText="名次";
        document.getElementById('rankline0').childNodes[1].innerText="用户名";
        document.getElementById('rankline0').childNodes[2].innerText="成功用时";
        document.getElementById('rankline0').childNodes[3].innerText="失败次数";
        document.getElementsByClassName('gaming')[0].style.cssText="visibility:hidden;"
        document.getElementById('rankline1').innerText="暂时无人上榜";
        document.getElementById('rankline1').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
    }
}
//常用的按钮

startbtn.addEventListener('click', clearTable, false);

function clearTable() {
    // clearInterval(tinterval);
    document.getElementById("start").value = "重新开始";
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    let num = document.querySelectorAll("td").length;
    for (let i = 0; i < num; i++) {
        document.querySelectorAll("td")[i].style.cssText = "display:table-cell;";
    }
    startbtn.removeEventListener('click', clearTable);
    start();
    setTimeout(() => {
        startbtn.setAttribute('disabled', 'disabled');
        startbtn.addEventListener('click', restart, false);
    }, 100);
    // if (clicktime > 3) {
    //     attention("慢慢来不要急");
    // }
    setTimeout(() => {
        startbtn.removeAttribute('disabled');
    }, 5000);
}

function restart() {
    // startbtn.addEventListener('click', function () {
        // // clearInterval(tinterval);
        // premap();
        // listener();
        // sessionStorage.setItem("isOver", false);
        // console.log(timeout1);
        // clearTimeout(timeout1);
        // clearTable();
        // document.getElementById('statistics').textContent = "0";
        // num = 0;
        // document.querySelector('h2').textContent = "00:00";
        window.location.reload();
    // });
}
var timeout1;
function start() {
    document.getElementById('completebox').style.cssText += "display:none";
    document.querySelector("h2").style.cssText = " -webkit-text-stroke-color: #8c6e62;-webkit-text-stroke-width: 2.5px;";

    addTime();
    function addTime() {
        //  console.log(second);
        // var second = 0;
        var min = 0;
        var startTime = new Date().getTime();
        startCount();
        
        function add(min, second) {
            str_second = String(second);
            str_min = 0 + String(min);
            if (second < 10) {
                str_second = 0 + str_second;
            }
            // console.log("change");
            document.querySelector("h2").textContent = str_min + ":" + str_second;
        }
        function startCount() {
            var second = parseInt((new Date().getTime() - startTime) / 1000);
            if (JSON.parse(sessionStorage.getItem("isOver"))) {
                console.log(0000);
                //clearTimeout(timeout2);
                clearTimeout(timeout1);
                return;
            }
            // second++;

            if (second > 59) {
                min++;
                second = second - 60;
            }
            if (min == 5) {
                console.log(timeout1);
                sessionStorage.setItem('isOver',true);
                attention("时间到！！");
                complete(0);
            }
            add(min, second);
            timeout1 = setTimeout(startCount, 1000);
        }
        timeout1 = setTimeout(startCount, 500);
    }


    document.getElementById('ranklist').addEventListener('click', function () {
        sessionStorage.setItem('isOver',true);
    }, false);
}