const startbtn = document.querySelector("#start");
const backbtn = document.querySelector("#back");
const rankurl="http://111.231.174.100:5000/rank";//查看排行榜
const completeurl="http://111.231.174.100:5000/insert";//提交成绩
const indexurl="";//报名表 html里有个a标签也要填这个
const myurl=window.location.href.split('?')[0];
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// if(window.location.href.split('/')[window.location.href.split('/').length-1]!="game.html"){
//     window.location.href=window.location.hostname+"/Watch-out-for-carrots/game.html";
// }//去掉用来reload()添加的随机数

document.getElementById('attcha').addEventListener('click',function(){
    // e.preventDefault();
    document.getElementById('attentionbox').style.cssText +='visibility: hidden;';
},false);
document.getElementById('welcomecha').addEventListener('click',function(){
    // e.preventDefault();
    setTimeout(() => {
        document.getElementById('welcomebox').style.cssText +='display:none';
    }, 300);
},false);
document.getElementById('completebox').addEventListener('click',function(e){
    setTimeout(() => {
        document.getElementById('completebox').style.cssText +='display:none';
    }, 200);
},false);

function fillURL(casename,str){
    var url="";
    switch (casename) {
        case "submit":
            url=completeurl+str;
            break;
        case "reload":
            url=myurl+"?t="+new Date().getTime();
        default:
            break;
    }
    return url;
}
function attention(text) {
    document.getElementById('attention').textContent=String(text);
    document.getElementById('attentionbox').style.cssText += "visibility: unset;";
    setTimeout(() => {
        document.getElementById('attentionbox').style.cssText +='visibility: hidden;';
    }, 5000);
    setTimeout(() => {
        if(document.getElementById('attentionbox').style.visibility!="hidden"){
            document.getElementById('attentionbox').style.cssText +='visibility: hidden;';
        }
        // if(document.getElementById('welcomebox').style.display!="none"){
        //     document.getElementById('welcomebox').style.cssText +='display:none';
        // }
        if(JSON.parse(sessionStorage.getItem('ranklist'))==true){
            document.getElementById('completebox').style.cssText +='display: none;';
        }
    }, 7000);
}
function rewriteTime(second){
    return String(Math.floor(second/60)+":"+(second%=60));
}
function read_statuscode(statusCode, responseText) { //用来提示的 仅此而已
    if (statusCode == 200) {
        // attention("Success!");
        response = JSON.stringify(responseText);
        if (response.errcode == "40003") {
            attention("Wrong!");
        }
        return responseText;
    } else {
        switch (statusCode) {
            case 419:
                attention("还没有关注公众号");
                window.location.href = "https://hemc.100steps.net/2019/fleeting-station-test/api/station";
                break;
            case 430:
                attention("活动还没开始哦, 敬请期待~");
                break;
            case 431:
                attention("活动已经结束啦, 感谢关注~");
                break;
            case 500:
                attention("网络出了点小问题");
                break;
            case 402:
                attention("网络出了点小问题");
                break;
            case 404:
                attention("网络出了点小问题");
                break;
        }
    }
}
function post(url, package,sync,fun) {
    var xmlhttp2 = new XMLHttpRequest();
    if(typeof sync === 'function') {
        fun = sync;sync =true;
    }else if(typeof sync === 'undefined'){
        sync =true;
    }
    let obj = package;
    xmlhttp2.open("POST", url, true);
    xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp2.setRequestHeader( "Access-Control-Allow-Origin","*" );
    xmlhttp2.setRequestHeader( "Access-Control-Allow-Methods","POST,GET" );
    xmlhttp2.setRequestHeader("Content-Type", "application/json");
    xmlhttp2.send(JSON.stringify(obj));
    xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4) {
            read_statuscode(xmlhttp2.status, xmlhttp2.responseText);
            storage = JSON.parse(xmlhttp2.responseText);
            return;
        }
    }
};
function get(url,sync,fun) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader( "Access-Control-Allow-Origin","*" );
    xmlhttp.setRequestHeader( "Access-Control-Allow-Methods","POST,GET" );
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    if(typeof sync === 'function') {
        fun = sync;sync =true;
    }else if(typeof sync === 'undefined'){
         sync =true;
    }
    console.error();
    xmlhttp.send(); 
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 &&xmlhttp.status==200) {//&&xmlhttp.status==200
            fun.call(this,xmlhttp.responseText);
            read_statuscode(xmlhttp.status, xmlhttp.responseText);
            return;
        }else{
            read_statuscode(xmlhttp.status, xmlhttp.responseText);
        }
    }
}
function checkBBT(){
    url="https://hemc.100steps.net/2019/autumn-recruit/game.html";
    var data = JSON.stringify({
        "url": url
    });
    post("//认证链接",data,function(){
    // wx.config({
        //     debug: false,
        //     appId: res.appId,
        //     timestamp: res.timestamp,
        //     nonceStr: res.nonceStr,
        //     signature: res.signature,
        //     jsApiList: [
        //     ]
        // });
        // wx.ready(function(){
        //     console.log("OK")
        // });
    })
}
var depart=new Array();
var introtext=new Array();
depart[0]="编辑部";introtext[0]="在这个美丽的招新季节，编辑部作为一个并不是专业排版的创作\
出品部门为您准备了三款快乐套餐——写文画图摄影，总有一种快乐适合你！套餐一：摄影组带着相机去记\
录生活的美好，行走四方去追猎光的身影。无论是一只猫的背影，还是城市华灯初上的繁复、或是某个Ta的\
回眸一笑……摄影是凝固的时光，在这里展示你最好的摄影作品，只为让你眼中的美好被更多人知晓。套餐二：\
原创写手组本套餐为使用者提供纸与笔，让您能勾勒清奇脑洞，也可抒发心中观点，若是今日无事想写个故事\
亦是乐趣一件。一杆笔随您挥斥方遒，数张纸任你指点春秋，如果你的心中有言语，为什么不来到这里，让世界\
听见你的声音？套餐三：可视化设计组火柴人玩家or当代达芬奇？甜甜科普图还是酷炫小短漫？只要您拥有创意和\
审美就可使用本套餐！现在下单还可体验老司机手把手教你学画画，快来抢购吧~ 同时还有免费礼包“编辑部的快乐”\
一份：出游×2，聚餐×n，例会零食×n，志同道合的小哥哥小姐姐×n，绿色交友机会×n……如有心动，速速行动！";
depart[1]="外联部";introtext[1]="我们也是门面颜值担当。日常我们要为\
百步梯各项活动筹集资金、寻求合作机会，以及与其他高校进行联谊和交流，与商\
家进行洽谈合作，所以外联部不仅要开展大型的品牌交流活动，努力拉取赞助以保\
证学生会中央财政和日常支出。同时也要协助各部门为展开其活动，在人员、资金、\
物品等多方面予以支持，真的是实打实的HOLD住全场的幕后金主爸爸。\
据说我们外联号称“最有钱”部门？还是颜值最高部门？不不，耳听为虚眼见为实";
depart[2]="节目部";introtext[2]="这里是华南理工大学大学城校区广播台。\
我们为每一个有播音主持梦想的你，提供一个绽放的舞台。每天下午的校园广播，\
荔枝fm同步直播，让你的声音温暖整个华园。现有国语、粤语、英语三个语言大组，\
总有一个你擅长；情感、音乐、新闻、时尚，多彩的内容等你畅聊；丰富的栏目，期待多样的你。\
除此之外，我们还经营着百步梯公众号内的「汇音」栏目，一个一直陪在你身边的夜间电台。汇音，汇聚值得听的好声音。\
除去广播台的身份，节目部每年还会承办华工百步梯的三大品牌活动之一、也是华工最大的播音主持大赛——“爱上女主播”播音主持大赛。";
depart[3]="人力资源部";introtext[3]="我们不仅管事，我们也管“人”。我们不仅负责各部门的协调沟通，\
更将全梯人的命运安排得明明白白；我们致力于建设百步梯文化，增强百步梯的向心凝聚力。如果你想运营公众号，\
百步梯梯妹等待着你的现身，一周热闻、生活分享、试吃、征婚，话题包罗万象，文风可盐可甜；如果你爱出谋划策，\
春秋招新、联合培训、梯赛、出游，你将体味孕育策划的荆棘与玫瑰；如果你向往成为HR高管，人员管理、绩效考核、\
招新面试，点亮你的人力资源管理技能点。";
depart[4]="综合新闻部";introtext[4]="百步梯综合新闻部专注校园新闻，深入剖析，挖掘真相；\
制作突破性、生活化专题，挖掘华工中不同人物、群体的故事；拍摄视觉周刊，镜头下记录华工变迁，\
记录华工人的生活。校园热点点评，深度分析，深度调查。每周热闻回顾，站在读者的角度吐槽这周的大\
事小事。开发微新闻项目，运用微博快速传播渠道以及华工百步梯的影响力，将第一手资讯带到学生中间。";
depart[5]="综合管理部";introtext[5]="综合管理部，是百步梯庞大的根系，用基础扎实的工作安排和\
事无巨细的组织策划筹备每个大型活动。负责管理百步梯内部财务、物资、行政，保证整个组织顺畅运行的\
同时，秉承着不断开拓创新的宗旨。我不要你觉得，我要我觉得，加入综管，听我的。";
depart[6]="策划推广部";introtext[6]="这里是创意和灵感的舞台，这里是温暖和友情的沃土。\
我们是百步梯的创新大脑、品牌设计师，肩负着百步梯线上产品运营和线下推广的责任。百步梯官方\
微信平台和官方活动微博由我们精心运营管理，“雕刻时光”电影文化节、毕业季文化节、开学季文化\
节等引人瞩目的系列活动在我们手中诞生。如果你有创新的头脑，想要交友活动两不误，感受大学不一\
样的精彩，就来策划推广部吧！";
depart[7]="视觉设计部";introtext[7]="我们是百步梯的视觉形象设计师，负责各大活动的vi视觉系\
统、海报、传单、宣传册、爆款周边、舞台场地布置、网页UI等设计制作工作。我们运用PS、AI、建模、\
摄影等一系列工具，在视觉设计中不断探索，共同追求创新、趣味、小美。我们会遇见有趣的灵魂，一起\
用奇妙的想法点亮生活。选择设计，收获创意。";
depart[8]="技术部";introtext[8]="我们是百步梯的元老级部门。百步梯以网 络技术起家，\
而作为其技术支撑的技术部拥有独立的研发办公室，负责日常的活动网站设计与制作。这里 需要\
码力满满的程序猿，也需要灵感溢出的设计狮；我们能用设计图描绘新的世界，也能用代码将脑\
洞化为现实。想让你的作品流传全校吗？想让你的idea通过双手实现吗？加入我们，一起去创造不可能！";
depart[9]="视频部";introtext[9]="我们是最近距离接触明星名人的校园媒体，也是百步梯和华南理工大学最专业的视频记录团队。\
用小小相机拍出大大世界，一步一个脚印去实现自己的梦想。只要你有想法、有兴趣、有热情，百步梯视频部就真诚欢迎你的加入！\
用创意和技术制作出属于自己的视频，在影像的流动中传递你面对世界的态度。\
零基础同学不用怕，后期培训已经为你准备好。百步梯视频部，你从未感受过的团队氛围，我们，在这里，等你！";
function welcome(){
    var n=Math.floor(Math.random()*10);
    document.getElementById('welcomebox').style.cssText +='display: flex;';
    document.getElementById('depart').innerText=depart[n]+"的邀请"
    document.getElementById('welcomebox2').innerText=introtext[n];
    sessionStorage.setItem('welcome',1);
}