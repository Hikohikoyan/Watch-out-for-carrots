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
        flag=false;//没有人玩
        document.getElementById('rankline2').innerText="暂时无人上榜";
        document.getElementById('rankline2').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
        if(your==0){
            document.getElementById('rankline3').innerText="你还没有玩呢";
            document.getElementById('rankline3').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
            return;
        }
    }

    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    get("js/rank.json","ranklist",function(data){
        list = JSON.parse(data);
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
            for(let i=0;i<=len;i++) {
                let linename="rankline"+i;
                document.getElementById(linename).childNodes[0].innerText=sessionStorage.getItem("yourrank");
                document.getElementById(linename).childNodes[1].innerText=list.self[0].username;
                document.getElementById(linename).childNodes[2].innerText=list.self[0].time;
                document.getElementById(linename).childNodes[3].innerText=list.self[0].times;
            }
        }
    });

    setTimeout(() => {
        document.getElementById('ranklist').addEventListener('click',rank,false);
    }, 60000);
}
//常用的按钮

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
    //时间会乱跳
    var startTime = new Date().getTime();
    /*计时器启动 启动时切换描边颜色 */
    document.getElementById('completebox').style.cssText +="display:none";
    document.querySelector("h2").style.cssText = " -webkit-text-stroke-color: #8c6e62;-webkit-text-stroke-width: 2.5px;";
        // var second = parseInt((new Date().getTime() - startTime) / 1000);
        var second= 0;
        var min = 0;
         function addTime() {
            second++;
            //  console.log(second);
        if (second > 59) {
            min++;
            second =second-60;
        }
         if (min == 5) {
            clearInterval(tinterval);
            console.log("GameOver");
        }
        add(min, second);
        function add(min, second) {
            str_second=String(second);
            str_min=0+String(min);
            if(second<10){
                str_second=0+str_second;
            }
            // console.log("change");
            document.querySelector("h2").textContent = str_min + ":" + str_second;
        }
    }
    tinterval = setInterval(function () {
        addTime();
        if(JSON.parse(sessionStorage.getItem("isOver"))) {
            clearInterval(tinterval);
        }
    }, 1000);

    document.getElementById('ranklist').addEventListener('click', function() {
        clearInterval(tinterval);
    }, false);

    document.getElementById("start").value="重新开始";
    startbtn.addEventListener('click',function(){
        clearInterval(tinterval);
        premap();listener();clearTable();
        document.getElementById('statistics').textContent="0";
        num=0;
        document.querySelector('h2').textContent="00:00";
        sessionStorage.setItem("isOver", false);
        setTimeout(() => {
            startbtn.setAttribute('disabled','disabled');
            // attention("地图更新过于频繁");
        }, 2000);
        setTimeout(() => {
            startbtn.removeAttribute('disabled');
        }, 2300);
    });
}
