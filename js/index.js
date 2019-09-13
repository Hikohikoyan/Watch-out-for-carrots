var storage = JSON;
document.getElementById('ranklist').addEventListener('click',rank,false);
function rank(){
    var flag;
    document.querySelector('h2').textContent="排行榜";
    document.getElementById('gTable').style.cssText="display:none;";
    document.getElementById('dengji_img').style.cssText="display:none;";
    document.getElementById('ranklist').removeEventListener('click',rank);
    attention("新鲜出炉的排行榜！");
    var totallist=Number(sessionStorage.getItem("listnum"));
    var your=sessionStorage.getItem("yourrank");
    function prenodes(classname, name) {
        var pair = "";
        for (var j = 0; j < 4; j++) {
            pair = pair + "<td class='" + classname + "'id='" + name + Number(j+1) + "'></td>";
        }
        return pair;
    }
    var list2 = "";
    for (let a = 0; a <=totallist+1; a++) {
        if(a==0){
            var linename="rankcaption";
        }else{
            linename="rankline";
        }
        list2 = list2 + "<tr class='"+linename+"' id='rankline" +Number( a +1)+ "' >" + prenodes("ranklist", "rankitem") + "</tr>";
    }
    document.getElementById('yTable').innerHTML = list2;
    document.getElementById('yTable').setAttribute('class',"ranktable")
    document.getElementById('rankline1').childNodes[0].innerText="名次";
    document.getElementById('rankline1').childNodes[1].innerText="用户名";
    document.getElementById('rankline1').childNodes[2].innerText="成功用时";
    document.getElementById('rankline1').childNodes[3].innerText="失败次数";
    document.getElementsByClassName('gaming')[0].style.cssText="visibility:hidden;"
    if(totallist==0){
        flag="false";//没有人玩
        document.getElementById('rankline2').innerText="暂时无人上榜";
        document.getElementById('rankline2').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
        if(your==0){
            document.getElementById('rankline3').innerText="你还没有玩呢";
            document.getElementById('rankline3').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
            return;
        }
    }


    var list="";
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    get("js/rank.json","ranklist",function(data){
        list=data;
        list=JSON.parse(list);
        var yourline=document.querySelector("#yTable>tbody").lastChild.id;
        document.getElementById(yourline).childNodes[0].innerText=Number(list.self[0].rank);
        document.getElementById(yourline).childNodes[0].innerText=list.self[0].username;
        console.log(list.self[0]);
        if(list.self[0].time==10000){
            document.getElementById(yourline).childNodes[0].innerText=0;
        }else{
            document.getElementById(yourline).childNodes[0].innerText=list.self[0].time;
        }
        document.getElementById(yourline).childNodes[0].innerText=list.self[0].time3;
        if(flag!=false&&list.all!=undefined){
            let len=11;
            console.log(list.all);
            for(let i=0;i<=len;i++){
                let linename="rankline"+i;
                for(let j=0;j<=3;j++){
                    if(j==0){
                        document.getElementById(linename).childNodes[j].innerText=sessionStorage.getItem("yourrank");
                    }
                    if(j==1){
                        document.getElementById(linename).childNodes[j].innerText=list.self[0].username;
                    }
                    if(j==2){
                        document.getElementById(linename).childNodes[j].innerText=list.self[0].time;
                    }else{
                        document.getElementById(linename).childNodes[j].innerText=list.self[0].times;
                    }
                }
            }
        }
    });

    setTimeout(() => {
        document.getElementById('ranklist').addEventListener('click',rank,false);

    }, 60000);
}
//常用的按钮

function checkBBT() {
    //授权
    //get(https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect,"getyou")

}
startbtn.addEventListener('click', clearTable, false);

function clearTable() {
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
        num=0;
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




window.onload = function () {
    checkBBT();
    var name = localStorage.getItem("you");

}