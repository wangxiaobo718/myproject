// JavaScript Document
var scrollTop = $("body").scrollTop();//body设置为fixed之后会飘到顶部，所以要动态计算当前用户所在高度
$("body").css({
    'overflow':'hidden',
    'position': 'relative',
    'top': scrollTop*-1
});
//$loadMask.css('top',scrollTop);//设置遮罩层top值

/*取消后设置回来*/
//$("body").css({
//    'overflow':'auto',
//    'position': 'static',
//    'top': 'auto'
//});
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function () {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
document.body.style.height = view().h + "px";

//滑屏
var one = id("one");
var oHua = id("hua_box");
var nav_show = id("nav_show");
var foot_show = id("foot_show");
var content = id("content");
var zuixin = id("zuixin");
var tow = id("tow");
var yun = id("yun");
var three = id("three");
var wH = document.body.style.height;
var liaojie = id("liaojie");
var xiaotou = id("xiaotou");
var jingli_tou = id("jingli_tou");
var benshi = id("benshi");
var five = id("five");
var xiao = id("xiaotou_opct");
var ceshi = id("ceshi");
var oTimer,
    oTimer1,
    oTimer2,
    oTimer3,
    oTimer4,
    oTimer5,
    oTimer6,
    oTimer7,
    oTimer8,
    oTimer9,
    oTimer10,
    oTimer11,
    oTimer12,
    oTimer13,
    oTimer14,
    oTimer15,
    oTimer16,
    oTimer17,
    oTimer18,
    oTimer19,
    oTimer20,
    oTimer21,
    oTimer22,
    oTimer23,
    oTimer24,
    oTimer25,
    oTimer26,
    oTimer27,
    oTimer28
        = null;
if (wH == 1125 + "px") {
    yun.style.top = 54 + "rem";
}
oTimer = setInterval(function () {
    oHua.style.opacity = 1;
    clearInterval(oTimer);
}, 3000);
bind(oHua, "touchstart", fnStart, false);
bind(liaojie, "touchstart", fnStart1, false);
bind(xiaotou, "touchstart", fnStart2, false);
bind(jingli_tou, "touchstart", fnStart3, false);
bind(benshi, "touchstart", fnStart4, false);
bind(xiao, "touchstart", fnStart5, false);
bind(ceshi, "touchstart", fnStart6, false);
$(".page1").css("top", wH * -77);
function fnStart() {
    addClass(one, "pageShow");
    $(".page").css("top", wH);

    oTimer4 = setInterval(function () {
        $(".page1").css("top", 0);
        clearInterval(oTimer4);
    }, 1);
    addClass(tow, "page1_1");
    //第二页添加动画
    oTimer1 = setInterval(function () {
        $(".pageShow").css({
            display: "none"
        });
        addClass(nav_show, "nav_show");
        addClass(foot_show, "foot_show");
        addClass(content, "content");
        addClass(zuixin, "zuixin");
        clearInterval(oTimer1);
    }, 500);

}

function fnStart1() {
    $(".page2").css("display", "block");
    addClass(tow, "page1_2");
    $(".page1_2").css("top", wH);
    addClass(three, "page2_2");
    $(".page2_2").css("top", "0");
    oTimer3 = setInterval(function () {
        $(".zi_wo").addClass("zi_wo1");
        $(".nav_top1").addClass("nav_show1");
        $(".chuowo").addClass("chuowo1");
        $(".xiaotou").addClass("xiaotou_1");
        $(".you_1").addClass("you_1_1");
        $(".you_2").addClass("you_2_2");
        $(".you_3").addClass("you_2_2");
        $(".zwpj").addClass("zwpj1");
        $(".chunv").addClass("chunv1");
        oTimer5 = setInterval(function () {
            $(".xiaotou").addClass("xiaotou_2");
            clearInterval(oTimer5);
        }, 4000);
        clearInterval(oTimer3);
    }, 800);

}
function fnStart2() {
    $(".xiaotou").addClass("xiaotou_3");
    $(".chuowo").addClass("chuowo2");
    $(".chunv").addClass("you_3_3");
    $(".you_1").addClass("you_3_3");
    $(".you_3").addClass("you_3_3");
    $(".you_2").addClass("you_3_3");
    $(".zwpj").addClass("you_1_you");
    $(".zi_wo").addClass("you_1_you");
    oTimer6 = setInterval(function () {
        $(".page3").css("top", 0);
        $(".jingli").addClass("jingli1");
        $(".danshen").addClass("danshen_you");
        $(".shendu").addClass("yibei_zuo");
        $(".yibei").addClass("yibei_zuo");
        $(".jingli_tou").addClass("jingli_tou_da");
        clearInterval(oTimer6);
    }, 1000);
    oTimer7 = setInterval(function () {
        $(".jingli_tou").addClass("jingli_tou_zhuan");
        clearInterval(oTimer7);
    }, 2600);
    oTimer2 = setInterval(function () {
        //$(".page2").css("display","none");
        $("#four").css({
            opacity: 1,
            display: "block"
        });
        clearInterval(oTimer2);
    }, 2000);

}
function reset() {

    $(".zi_wo").attr("class", "zi_wo");
    $(".chunv").attr("class", "chunv");
    $(".zwpj").attr("class", "zwpj");
    $(".you_1").attr("class", "you_1");
    $(".you_2").attr("class", "you_2");
    $(".you_3").attr("class", "you_3");
    $(".xiaotou").attr("class", "xiaotou");
    $(".chuowo").attr("class", "chuowo");
    $(".page1 ").attr("class", "page1 page1_1 ");

    $(".page3").attr("class", "page3");
    $(".nav_top2").attr("class", "nav_top2");
    $(".danshen").attr("class", "danshen");
    $(".jingli").attr("class", "jingli");
    $(".yibei").attr("class", "yibei");
    $(".shendu").attr("class", "shendu");
    $(".jingli_tou").attr("class", "jingli_tou");


    $(".bobode").attr("class", "bobode");
    $(".ba").attr("class", "ba");
    $(".ban").attr("class", "ban");
    $(".wu").attr("class", "wu");
    $(".yi").attr("class", "yi");
    $(".maodun").attr("class", "maodun");
    $(".wuyi_1 ").attr("class", "wuyi_1");
    $(".wuyi_2 ").attr("class", "wuyi_2");
    $(".wuyi_3").attr("class", "wuyi_3");
    $(".wuyi_1").css("opacity", 0);
    $(".wuyi_2").css("opacity", 0);
    $(".wuyi_3").css("opacity", 0);
}
function fnStart3() {
    oTimer8 = setInterval(function () {
        $(".page1").css({
            top: 0,
            display: "block"
        });
        clearInterval(oTimer8);

    }, 1000);
    $("#four").addClass("page3_1");
    oTimer9 = setInterval(function () {
        $("#four").css({
            opacity: 0
        });
        clearInterval(oTimer9);
    }, 300);
    oTimer10 = setInterval(function () {
        $("#four").css({
            display: "none"
        });
        $(".page2").css("top", -2222);
        reset();
        clearInterval(oTimer10);
    }, 1100);
}
function fnStart4() {
    addClass(tow, "page1_2");
    $(".page1_2").css({
        top:"3763",
        display:"none"
    });
    $(".opct").css({
        display:"none"
    });
    addClass(five, "page4_1");
    $(".page4_1").css("top", "0");
    $("body").addClass("over_scr");
    $(".bobode").addClass("bobode1");

    oTimer13 = setInterval(function () {
        $(".maodun").addClass("maodun2");
        clearInterval(oTimer13);
    }, 500);
    $(".ba").addClass("ba1");
    $(".ban").addClass("ban1");
    $(".wu").addClass("wu1");
    $(".yi").addClass("yi1");
    oTimer11 = setInterval(function () {
        $(".maodun").addClass("maodun1");
        $(".opct").css({
            display:"block"
        });
        clearInterval(oTimer11);
    }, 1000);
    oTimer12 = setInterval(function () {
        $(".wuyi_1").addClass("wuyi_1_1");
        $(".wuyi_1").css("opacity", 1);
        clearInterval(oTimer12);
    }, 1800);
    oTimer14 = setInterval(function () {
        $(".wuyi_2").addClass("wuyi_2_2");
        $(".wuyi_2").css("opacity", 1);
        clearInterval(oTimer14);
    }, 2000);
    oTimer15 = setInterval(function () {
        $(".wuyi_3").addClass("wuyi_3_3");
        $(".wuyi_3").css("opacity", 1);
        clearInterval(oTimer15);
    }, 2000);
    //reset();
}

function fnStart5() {
    alert(1)
    oTimer16 = setInterval(function () {
        //$(".page1 ").css("top", 0);
        $("body").removeClass("over_scr");
        clearInterval(oTimer16);

    }, 1000);

    $(".page4").css("top", -4000);

    oTimer17 = setInterval(function () {
        $(".page1").css({
            top:"0",
            display:"block"
        });
        clearInterval(oTimer17);
    }, 1);
    addClass(tow, "page1_1");
    reset();
}
//测试
function fnStart6(){
    //$img_len=$(".he_box img").length;
    addClass(tow, "page1_2");
    $(".page1_2").css("top", wH);
    oTimer17 = setInterval(function () {
        $(".page5").addClass("page5_1");
        $(".page5").css("top", "0");
        clearInterval(oTimer17);
    }, 1);
    oTimer18 = setInterval(function () {
        $(".he_box img:nth-of-type(1)").addClass("img_ro");
        //$(".he_box img:nth-of-type(1)").addClass("img_jinbian");
        clearInterval(oTimer18);
    }, 1000);
    oTimer19 = setInterval(function () {
        $(".he_box img:nth-of-type(2)").addClass("img_ro");

        $(".he_box img:nth-of-type(2)").addClass("img_jinbian");
        clearInterval(oTimer19);
    }, 1050);
    oTimer20 = setInterval(function () {
        $(".he_box img:nth-of-type(3)").addClass("img_ro");
        $(".he_box img:nth-of-type(3)").addClass("img_jinbian");
        clearInterval(oTimer20);
    }, 1100);
    oTimer21 = setInterval(function () {
        $(".he_box img:nth-of-type(4)").addClass("img_ro");
        $(".he_box img:nth-of-type(4)").addClass("img_jinbian");
        clearInterval(oTimer21);
    }, 1150);
    oTimer22 = setInterval(function () {
        $(".he_box img:nth-of-type(5)").addClass("img_ro");
        $(".he_box img:nth-of-type(5)").addClass("img_jinbian");
        clearInterval(oTimer22);

    }, 1200);
    oTimer23 = setInterval(function () {
        $(".he_box img:nth-of-type(6)").addClass("img_ro");
        $(".he_box img:nth-of-type(6)").addClass("img_jinbian");
        clearInterval(oTimer23);
    }, 1250);
    oTimer24 = setInterval(function () {
        $(".he_box img:nth-of-type(7)").addClass("img_ro");
        $(".he_box img:nth-of-type(7)").addClass("img_jinbian");
        clearInterval(oTimer24);
    }, 1300);
    oTimer25 = setInterval(function () {
        $(".he_box img:nth-of-type(8)").addClass("img_ro");
        $(".he_box img:nth-of-type(8)").addClass("img_jinbian");
        clearInterval(oTimer25);
    }, 1350);
    oTimer26= setInterval(function () {
        $(".he_box img:nth-of-type(9)").addClass("img_ro");
        $(".he_box img:nth-of-type(9)").addClass("img_jinbian");
        clearInterval(oTimer26);
    }, 1400);

    //oTimer27= setInterval(function () {
    //    var css_box = id("css");
    //    var css_1="";
    //    var r=parseInt(10*Math.random());
    //    var he_box = id("he_box");
    //    var he_img = he_box.getElementsByClassName("img");
    //    css_1 += "#he_box .img:nth-of-type(" + (r) + "){display:none;}";
    //    css_box.innerHTML += css_1;
    //}, 1800);

}
