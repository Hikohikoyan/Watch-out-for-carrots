var storage = JSON;
document.getElementById('ranklist').addEventListener('click',rank,false);
function rank(){
    sessionStorage.setItem('ranklist',true);
    document.getElementById('ranklist').setAttribute('disabled','disabled');
    document.querySelector('h2').textContent="排行榜";
    document.getElementById('yTable').style.cssText="display:none;";
    document.getElementById('gTable').style.cssText="display:none;";
    document.getElementById('gamebox').style.cssText="display:none;";
    document.getElementById('dengji_img').style.cssText="display:none;";
    document.querySelector("#rankcontainer").style.cssText += "display:block;";
    document.getElementById('ranklist').removeEventListener('click',rank);
    attention("新鲜出炉的排行榜！");
    //写表
    function prenodes(classname, name) {
        var pair = "";
        for (var j = 1; j <= 4; j++) {
            pair = pair + "<div class='" + classname + "'id='" + name + Number(j) + "'></div>";
        }
        return pair;
    }
    //请求
    get("js/rank.json","ranklist",function(data){
        list = JSON.parse(data);
        var totallist = 0
        if(list.all == null){
            totallist = 0
        }else{
            totallist = list.all.length;
        }
        //准备布局

        var list2 = "";
        var head = "";
        var linename="";
        for (let a = 0; a <=totallist+1; a++) {
            if(a==0){
                linename="rankcaption";
                head= "<div class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("rankhead", "rankitem") + "</div>";
            }else{
                linename="rankline";
                list2 = list2 + "<div class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("ranklist", "rankitem") + "</div>";
            }
        }

        list2 =head+ '<div style="max-height: 400px; overflow-y: scroll;overflow-x: hidden;">'+list2+'</div>';  
        console.log(list2);
        console.log(head);

        document.getElementById('rankcontainer').innerHTML = list2;
        document.getElementById('rankcontainer').setAttribute('class',"ranktable");
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
            document.querySelector("#rankcontainer").style.cssText = "display:block;";
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
                // document.getElementById(yourline).childNodes[0].style.cssText +="border-bottom: none;";
                // document.getElementById(yourline).childNodes[1].style.cssText +="border-bottom: none;";
                // document.getElementById(yourline).childNodes[2].style.cssText +="border-bottom: none;";
                // document.getElementById(yourline).childNodes[3].style.cssText +="border-bottom: none;";
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
            document.getElementById('ranklist').removeAttribute('disabled');
        }, 60000);
    });
    /*
    if(get("js/rank.json","ranklist")==undefined){
        var list2 = "";
        var head = "";
        var linename="";
        for (let a = 0; a <=1; a++) {
            if(a==0){
                linename="rankcaption";
                head= "<div class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("ranklist", "rankitem") + "</div>";
            }else{
                linename="rankline";
                list2 = list2 + "<div class='"+linename+"' id='rankline" +Number(a)+ "' >" + prenodes("ranklist", "rankitem") + "</div>";
            }
        }
        
        list2 =head+ '<div style="max-height: 400px; overflow-y: scroll;overflow-x: hidden;">'+list2+'</div>';  
        
        console.log(head)
        console.log(list2)

        document.getElementById('rankcontainer').innerHTML = list2;
        document.getElementById('rankcontainer').setAttribute('class',"ranktable")
        document.getElementById('rankline0').childNodes[0].innerText="名次";
        document.getElementById('rankline0').childNodes[1].innerText="用户名";
        document.getElementById('rankline0').childNodes[2].innerText="成功用时";
        document.getElementById('rankline0').childNodes[3].innerText="失败次数";
        document.getElementsByClassName('gaming')[0].style.cssText="visibility:hidden;";

        document.getElementById('rankline1').innerText="暂时无人上榜";
        document.getElementById('rankline1').style.cssText="color:#8c6e62;padding: 10%;font-size: 160%;text-align: center;"
        
        
        let objects = document.getElementsByClassName('ranklist');
        console.log(objects)
        for (let i = 0; i < objects.length; i++) {
            objects[i].style.cssText += "display:table-cell;";
        }
    }*/
}
//常用的按钮

startbtn.addEventListener('click', clearTable, false);

function clearTable() {
    // clearInterval(tinterval);
    console.time('startbtn');
    document.getElementById("start").value = "重新开始";
    startbtn.setAttribute('disabled', 'disabled');
    setTimeout(() => {
        startbtn.addEventListener('click', restart, false);
        startbtn.removeAttribute('disabled');
    }, 300);
    document.querySelector("#yTable").style.cssText += "background-image:unset;";
    let objects =document.getElementsByClassName('mines');
    let objects2 =document.getElementsByClassName('you-column');
    for (let i = 0; i < objects.length; i++) {
        objects[i].style.cssText += "display:table-cell;";
        objects2[i].style.cssText += "display:table-cell;";
    }
    
    console.timeEnd('startbtn');
    start();

    // setTimeout(() => {
    //     startbtn.removeAttribute('disabled');
    // }, 5000);

}

var timeout1;
function start() {
    console.time('start');
    document.getElementById('yTable').style.cssText += "pointer-events: all;";
    document.getElementById('completebox').style.cssText += "display:none";
    document.querySelector("h2").style.cssText = " -webkit-text-stroke-color: #8c6e62;-webkit-text-stroke-width: 2.5px;";

    addTime();
    function addTime() {
        //  console.log(second);
        var second = 0;
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
                //clearTimeout(timeout2);
                clearTimeout(timeout1);
                return;
            }
            // second++;
            min=Math.floor(second/60);
            second%=60;
            if (min == 5) {
                sessionStorage.setItem('isOver',true);
                attention("时间到！！");
                complete(0);
            }
            add(min, second);
            timeout1 = setTimeout(startCount, 1000);
        }
        timeout1 = setTimeout(startCount, 1000);
    }
    document.getElementById('ranklist').addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.setItem('isOver',true);
        sessionStorage.setItem('ranklist',true);
    }, false);
    console.timeEnd('start');
}

function restart() {
    console.log('restart');
    window.location.href="http://192.168.137.1/Watch-out-for-carrots/game.html"+"?="+Math.random()*5;
}
backbtn.addEventListener('click', function (e) {
    e.preventDefault();
    if(JSON.parse(sessionStorage.getItem('ranklist'))){
        sessionStorage.setItem('ranklist',false);
        window.location.reload();
        window.location.href="http://192.168.137.1/Watch-out-for-carrots/game.html"+"?="+Math.random()*5;
        window.location.href="http://192.168.137.1/Watch-out-for-carrots/game.html";
        return;
    }
    window.location.href="http://134.175.124.192/autumn";
}, false);