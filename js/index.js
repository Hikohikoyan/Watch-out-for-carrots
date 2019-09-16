var storage = JSON;
document.getElementById('ranklist').addEventListener('click',rank,false);
function rank(){
    document.querySelector('h2').textContent="排行榜";
    document.getElementById('gTable').style.cssText="display:none;";
    document.getElementById('dengji_img').style.cssText="display:none;";
    document.querySelector("#yTable").style.cssText = "background-image:unset;";
    document.getElementById('ranklist').removeEventListener('click',rank);
    attention("新鲜出炉的排行榜！");
    //请求
    get("http://111.231.174.100:5000/rank","ranklist",function(data){
        list = JSON.parse(data);
        var totallist = 0
        if(list.all == null){
            totallist = 0
        }else{
            totallist = list.all.length;
        }
        //准备布局
        function prenodes(classname, name) {
            var pair = "";
            for (var j = 1; j <= 4; j++) {
                pair = pair + "<td class='" + classname + "'id='" + name + Number(j) + "'></td>";
            }
            return pair;
        }
        var list2 = "";
        var linename;
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
