$(function(){
    $("header span").click(function(){
        if($(".nav-ul").is(":visible")){
            $(".nav-ul").slideUp();
        }else{
            $(".nav-ul").slideDown();
        }
    });

    function tab(inner, tip) {
        var clientWidth=document.documentElement.clientWidth;
        var step = 1;//->当前显示的那一张图片的索引
        var autoTimer = null;//->存储我们自动轮播定时器的返回值
        //alert(clientWidth)
        //给inner的宽度设置初始值
        var $inner = $(inner);
        var $count = $inner.children("div").length;
        $inner.css({
            width: $count * clientWidth,
            left: -clientWidth
        });

        //实现自动轮播
        function autoMove() {
            step++;
            if (step >= $count) {
                $inner.css("left", -clientWidth);
                step = 2;
            }
            $inner.stop().animate({left: -step * clientWidth}, 500, "linear");
            changeTip();
        }

        autoTimer = window.setInterval(autoMove, 3000);

        //实现焦点对齐
        var $innerTip = $(tip);
        var $innerTipList = $innerTip.children("li");

        function changeTip() {
            var tempStep = step;
            if (tempStep <= 0) {
                tempStep = $innerTipList.length - 1;
            } else if (tempStep >= ($count - 1)) {
                tempStep = 0;
            } else {
                tempStep--;
            }
            $innerTipList.each(function (index, curLi) {
                curLi.className = index === tempStep ? "select" : null;
            });
        }
        //点击焦点实现切换
        $innerTipList.click(function () {
            window.clearInterval(autoTimer);
            var index = $(this).index();
            step = index + 1;
            $inner.stop().animate({left: -step * clientWidth}, 500, "linear");
            changeTip();
            autoTimer = window.setInterval(autoMove, 3000);
        });
    }
    tab("#inner", "#tip");
    tab("#inner1", "#tip1");
    tab("#inner2", "#tip2");
    tab("#inner3", "#tip3");
    tab("#inner4", "#tip4");
    //左右切换
    !(function () {
        var step = 1;
        var autoTimer = null;
        var $inner = $(".inner");
        var $count = $inner.children("li").length;
        $inner.css({
            width: $count * 930,
            left: -930
        });
        //自动轮播
        function autoMove() {
            step++;
            if (step >= $count) {
                $inner.css("left", -930);
                step = 2;
            }
            $inner.stop().animate({left: -step * 930}, 500, "linear");
        }

        autoTimer = window.setInterval(autoMove, 5000);

        //点击左右按钮实现切换
        var $link = $(".outer>a");
        $link.click(function () {
            window.clearInterval(autoTimer);
            if ($(this).hasClass("left")) {
                step--;
                if (step < 0) {
                    $inner.css("left", -($count - 2) * 930);
                    step = $count - 3;
                }
                $inner.stop().animate({left: -step * 930}, 500, "linear");
                changeTip();
            } else {
                autoMove();
            }
            autoTimer = window.setInterval(autoMove, 5000);
        });
        autoTimer = window.setInterval(autoMove, 5000);
        $link.hover(function (autoTimer) {
            window.clearInterval(autoTimer);
        })
    })();

})
//倒计时
$(function(){
    show_time();
});

function show_time(){
    var time_start = new Date().getTime(); //设定当前时间
    var time_end =  new Date("2016/6/01 00:00:00").getTime(); //设定目标时间
    // 计算时间差
    var time_distance = time_end - time_start;
    // 天
    var int_day = Math.floor(time_distance/86400000)
    time_distance -= int_day * 86400000;
    // 时
    var int_hour = Math.floor(time_distance/3600000)
    time_distance -= int_hour * 3600000;
    // 分
    var int_minute = Math.floor(time_distance/60000)
    time_distance -= int_minute * 60000;
    // 秒
    var int_second = Math.floor(time_distance/1000)
    // 时分秒为单数时、前面加零
    if(int_day < 10){
        int_day = "0" + int_day;
    }
    if(int_hour < 10){
        int_hour = "0" + int_hour;
    }
    if(int_minute < 10){
        int_minute = "0" + int_minute;
    }
    if(int_second < 10){
        int_second = "0" + int_second;
    }
    // 显示时间
    $("#time_d").val(int_day);
    $("#time_h").val(int_hour);
    $("#time_m").val(int_minute);
    $("#time_s").val(int_second);
    // 设置定时器
    setTimeout("show_time()",1000);
}