$(".f-home").addClass("on").siblings().removeClass("on");

$(".single-pro li section section strong i").each(function () {
   if(parseInt( $(this).find("n").text())>0){
       $(this).addClass("on");
   }
});

// 首页大图滚动
TouchSlide({
    slideCell:"#banner",
    titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
    mainCell:".bd ul",
    effect:"left",
    autoPlay:true,//自动播放
    autoPage:true, //自动分页
    switchLoad:"_src" //切换加载，真实图片路径为"_src"
});

$(function(){
    // 滚动条滚动到一定距离标题固定
    $(window).on('touchstart touchmove touchend scroll',function(){
        //获取窗口的滚动条的垂直位置
        var scrollH = $(window).scrollTop();
        var height = $('.ind-banner .bd li').height();
        if( scrollH >= height){
            $('.com-twotab').addClass('fixed');
        }else{
            $('.com-twotab').removeClass('fixed');
        };
        // event.preventDefault();
    });
    // 置顶品类选项切换
    var $categorySelect = $(".hd-select");
    $categorySelect.each(function(){
        var $categoryLi = $(this).find("ul li");
        $categoryLi.on("click",function(){
            $(this).addClass("on").siblings().removeClass("on");
        });
    });
    var bindCode=GetQueryString("bindcode");
    var qrcode=GetQueryString("qrcode");
    if(bindCode==""){
        bindCode=qrcode;
    }
    var source=GetQueryString("source");
    if(source=="1"){
        $("#alert-fit").show();
        $("html,body").addClass("hidden");
    }
    if(bindCode!=""){
        invokeApi("mallcashticket/sendcashticket",{"bindcode":bindCode},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data.status==1){
                    //var message=data.message;
                    if(bindCode=="e2878f8d18d511e6974ba0d3c1044194") {
                        $("#alert-changcheng").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="a8310cd7442840a8be685a9550f9ba79") {
                        $("#alert-huanlegu").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="1ac2005f924d4ca38f63ae3c3387db58") {
                        $("#alert-cishanjishi").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="49162824fc914c7cb7471a7f663cd965") {
                        $("#alert-nuojinjiudian").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="517420ff032a446688e4220b161873ec") {
                        $("#alert-yingnuo").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    showMessage("恭喜成功领取优惠券！");
                    //$("#alert-other").show();
                    //$("html,body").addClass("hidden");
                }

            }
        });
    }
});
// 体验包包月包tab切换
$('.com-twotab li').on('click',function(){
    $(this).addClass('on').siblings().removeClass('on');
    $('.container .ind-content').eq($(this).index()).addClass('on').siblings().removeClass('on');
});

$('.groupBuy').click(function(){

    $(".alert-bg").show();
    $(".group-alert").show();
    $("html,body").addClass("hidden");

    //var v=$(".hd-select ul .on").find("a em").text();
    var groupId=$(this).siblings("input[name='groupid']").val();
    $("input[name='group-pop-Id']").val(groupId);
    return false;
    //var quantity=1;
    //window.location.href="/topay.html?type="+v+"&groupId="+groupId+"&quantity="+quantity;
});
$("#groupPay").click(function () {
    var v=$(".hd-select ul .on").find("a em").text();
    var groupId=$("input[name='group-pop-Id']").val();
    var quantity=$(this).parent().siblings().find(".num").val();
    if(groupId!=undefined && quantity>0)
        window.location.href="/topay.html?type="+v+"&groupId="+groupId+"&quantity="+quantity;
    else
        alert("请选择数量。")
});
//套餐支付弹窗
//$("#grounp-buy").on('click',function(){
//
//});
$(".btn-cancel").click(function(){
    $(".alert-bg").hide();
    $(".group-alert").hide();
    $("html,body").removeClass("hidden");
});
$(".group-decrease").click(function(){
    numVal = parseInt($(this).siblings('.num').val());
    if(numVal>1) {
        numVal--;
        $(this).siblings('.num').val(numVal);
    }
});
$(".group-increase").click(function(){
    numVal = parseInt($(this).siblings('.num').val());
    if(numVal<100) {
        numVal++;
        $(this).siblings('.num').val(numVal);
    }
});
//长城彩跑弹窗
$("#btn-changcheng,#btn-huanlegu,#btn-cishanjishi,#btn-nuojinjiudian,#btn-yingnuo,#btn-other").click(function(){
    $(".alert-box").hide();
    $("html,body").removeClass("hidden");
});
$(".btn-buy,#alert-fit .bg").click(function(){
    $("#alert-fit").hide();
    $("html,body").removeClass("hidden");
});
//首页特价产品
$(document).ready(function(){
    //倒计时
    var showCountDown = function(){
        invokeApi("mallPromotion/getcurrentpromotion", {}, "", function (ret) {
            var data = eval(ret);
            if(data.status==1) {
                var seconds = data.seconds; //倒计时总秒数
                var hour = data.hour;
                var minute = data.minute;
                var second = data.second;
                $(".countdown").attr("data-countdown", seconds);
                $(".countdown .h").text(formatTime(hour));
                $(".countdown .m").text(formatTime(minute));
                $(".countdown .s").text(formatTime(second));
                setTimeout(function () {
                    console.log("ready!");
                    var i = parseInt($(".countdown").data("countdown"));
                    var interTimer = setInterval(function () {
                        if (i > 0) {
                            i--;
                            var h = Math.floor(i / 3600); //计算小时
                            var m = Math.floor((i / 60) % 60); //计算分
                            var s = Math.floor(i % 60); // 计算秒
                            $(".countdown .h").text(formatTime(h));
                            $(".countdown .m").text(formatTime(m));
                            $(".countdown .s").text(formatTime(s));
                        } else {
                            window.location.href = "/";
                            clearInterval(interTimer);
                        }
                    }, 1000);
                }, 0);
            }else{
                $(".price-special").removeClass("price-special");

            }
        });

    }();

    var formatTime=function(t){
        if(t.toString().length==1){
            return "0"+ t.toString();
        }else{
            return t.toString();
        }

    }
    $(".single-pro li").each(function(){
        var $me = $(this).find(".new-price");
        var stat = $me.attr("promotion");
        if(stat==1){
            $(this).addClass("price-special");
        }else{
            $(this).removeClass("price-special");
        };
    });

});
