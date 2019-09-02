function premap(){
    function prenodes(classname,name){
        var pair="";
        for(var j=1;j<7;j++){
            pair=pair+"<td class='"+classname+"'id='"+name+j+"'></td>";
        }
        return pair;
    }
    var pair2="";
    var pair3="";
    for(let a=1;a<7;a++){
        pair2=pair2+"<tr class='line' id='tr"+a+"'>"+prenodes("mines","td")+"</tr>";
        pair3=pair3+"<tr class='you-map' id='you-line"+a+"'>"+prenodes("you-column","you-column")+"</tr>";
    }
    document.getElementById('gTable').innerHTML=pair2;
    document.getElementById('yTable').innerHTML=pair3;
}
sessionStorage.setItem("isOver","false");
var num=Number(document.getElementById('statistics').textContent);

const startbtn = document.querySelector("#start");
const backbtn = document.querySelector("#back");
var clicktime=0;
var minemap=new Map();
function listener(){
    var yourmove=document.getElementById('yTable');
        yourmove.addEventListener('click',function(e){

            move(e.toElement.id,e.path[1].id);
            console.log(e.path[1].id+","+e.toElement.id);
        },false);
}
premap();
startbtn.addEventListener('mousemove', listener, false);
backbtn.addEventListener('click', function(){
    window.location.reload();
}, false);
function move(td,tr){
    var flag=0;
    var y=Number(td.replace("you-column",""));
    // var elementy=document.getElementById(tr).childNodes[y];
    var x=Number(tr.replace("you-line",""));
    var elementg=document.getElementById("tr"+x).childNodes[y-1];
    if(clicktime==0){
        addCarrots(elementg);
    }
    var obj="{"+x+","+y+"}";
    var type=String(minemap.get(obj));
    if(gamer(type)==false){
        flag++;
    }
    if(flag<=1){
        removegrass(elementg,obj);
    }
    // return;
    //if()解锁成就
}
function removegrass(elementg,obj){
    // console.log("{"+x+","+y+"}");
    // var obj="{"+x+","+y+"}"
    var type=String(minemap.get(obj));
    elementg.setAttribute('class',type);
}
function addCarrots(first){
    //传过来出发点
    var firstX=first.parentNode.id.replace("you-line","")
    var firstY=first.id.replace("you-column");
    var minesnum=0;
    var whitenum=0;
    var welcomecard=0;
    function randommines(x,y){
        if(x==firstX&&y==firstY){
            return minemap.set("{"+firstX+","+firstY+"}","floor");
        }
        let isMine=Boolean;
        let isWhite=Boolean;
        var arr1=new Array();
        var arr2=new Array();
        for(let i=0;i<6;i++){
            arr1[i]=Math.random()*36;
            arr2[i]=Math.random()*36;
        }
        function checkArr(n,m){
            for(let i=0;i<6;i++){
                if(parseInt(arr1[i]/6)==n){
                    if(arr2[i]%6==m){
                        isMine=true;
                        return;
                    }
                }
                isMine=false;
                isWhite=true;
            }
        }
        if(minesnum<7){
            checkArr(x,y);
            if(isMine==true){
                minemap.set("{"+x+","+y+"}","orange");
                minesnum++;
                return;
            }
        }
        if(whitenum>3){
            var another=Math.random()*25;
            if(another/x>=5){
                minemap.set("{"+x+","+y+"}","white");
                whitenum++;
                return;
            }
        }
        if(welcomecard==0){
            if(isMine==false&&isWhite==false){
                minemap.set({x,y},"welcome");
                welcomecard++;
                return;
        }
    }
        minemap.set("{"+x+","+y+"}","floor");
    }
    function checkMines(x,y){
        // var left=document.getElementById("tr"+x).childNodes[y-2];
        // var right=document.getElementById("tr"+x).childNodes[y];
        var leftX=x-1;var leftY=y;
        var rightX=x+1;var rightY=y;
        if(minemap.get({leftX,leftY})=="orange"){
            if(minemap.get({rightX,rightY})=="orange"){
                minemap.put("{"+x+","+y+"}","floor");
            }
        }
    }
    for(let a=1;a<7;a++){
        for(let b=1;b<7;b++){
            randommines(a,b);
            if((a>2&&b>2)|(a<6&&b<6)){
                checkMines(a,b);
            }
        }
    }
    console.log(minemap);
}
function gamer(type){
    if(type=="white"){
        num=num+1;
        document.getElementById('statistics').textContent=String(num);
    }
    if(type=="orange"){
        console.log("GameOver");
        sessionStorage.setItem("isOver","true");
        document.getElementById('yTable').style.cssText="background-image:unset;pointer-events: none;";
        return false;
    }
}