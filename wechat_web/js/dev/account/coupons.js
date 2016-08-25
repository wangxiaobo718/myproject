$(document).ready(function(){
    $(".order-detail-list .pay-order").remove();
    $(".f-my").addClass("on").siblings().removeClass("on");
    $("#source").val("1");
    invokeApi("mallcashticket/getcustomercashticket",{},Math.random(),function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            if(data.length==0){
                $(".coupon-main").addClass("coupon-empty");
                $(".coupon-list").hide();
                $(".more-coupons").hide();
                $(".coupon-main").append('<img src="/images/coupon-none.png" alt=""/>'+
                    '<p>啊哦，还没有优惠券噢，赶紧去抢 。</p>'+
                    '<div class="btn-group">'+
                    '<a href="/" class="btn btn-cancel btn-get-coupon">抢奶票</a>'+
                    '</div>');

            }else {
                $(".coupon-list").show();
                $(".more-coupons").show();
                $(".coupon-list").html("");
                for (var i = 0; i < data.length; i++) {
                    var cash = eval(data[i]);
                    var href = "#";
                    if (cash.status == 1) {//能用
                        href = "/";
                    }

                    var s = '<li class="coupon" state="'+cash.status+'">' +
                        '<section class="img">' +
                        '<div class="mask"></div>' +
                        '<a class="use-rules dyclick" title="">使用细则</a>' +
                        '<img src="/images/coupon1.jpg" alt="" title="">' +
                        '<i class="sign-expired"><strong>'+cash.statusName+'</strong></i>' +
                        '</section>' +
                        '<section class="info">' +
                        '<strong>￥<em>' + cash.TICKET_AMOUNT + '</em></strong>' +
                        '<dl class="info-right">' +
                        '<dt><a href="' + href + '" title="">' + cash.statusName + '</a></dt>' +
                        '<dd>' +
                        '<span time1="' + cash.BEGIN_TIME + '" time2="' + cash.END_TIME + '">' + cash.times + '</span>' +
                        '<p>' + cash.TICKET_NAME + '</p>' +
                        '<p>' + cash.REMARK + '</p>' +
                        '</dd>' +
                        '</dl>' +
                        '</section>' +
                        '</li>';
                    $(".coupon-list").append(s);
                    $(".coupon-list").find("li[state='0']").hide();
                }
            }
        }
    });
});
//更多优惠券
$('#morecash').on("click",function() {
    if ($(".coupon-list").find("li[state='0']").is(":visible")) {
        $(".coupon-list").find("li[state='0']").hide();
        $('#morecash em').html("查看过期优惠券");
    }else{
        $(".coupon-list").find("li[state='0']").addClass("coupon-expired");
        $(".coupon-list").find("li[state='0']").show();
        $('#morecash em').html("仅显示可用优惠券");
    }

});
//优惠卷弹窗
$('body').on('click',".use-rules",function() {
    var amount=$(this).parent().siblings(".info").find("strong").find('em').html();
    var time1=$(this).parent().siblings(".info").find("span").attr("time1");
    var time2=$(this).parent().siblings(".info").find("span").attr("time2");
    var name=$(this).parent().siblings(".info").find("p").first().html();
    var rule=$(this).parent().siblings(".info").find("p").next().html();
    var state=$(this).parent().parent().attr("state");
    $(".popup-content ul li").remove();
    $(".popup-content ul").append("<li>乐纯优惠券："+name+"</li>"+
        "<li>面值："+amount+"</li>"+
        "<li>生效时间："+time1+"</li>"+
        "<li>失效时间："+time2+"</li>");

    $("#cashticket-bg").show();
    $('.popup-coupon-detail').show();
    if(state==0) {
        $('.popup-tip .btn-group .btn-confirm').hidden();
    }else{
        $('.popup-tip .btn-group .btn-confirm').show();
    }
    $("html,body").addClass("hidden");
});
$('body').on('click',".popup-coupon-detail .btn-cancel",function() {
    $(".popup-coupon-detail").hide();
    $("#cashticket-bg").hide();
    $("html,body").removeClass("hidden");
});
//兑换
$(".btn-exchange").on("click",function(){
    var cashno=$(".coupon-code").val();
    if(cashno.trim()==''){
        showMessage("请输入优惠券号");
        return false;
    }
    var obj=$(this);
    $(obj).attr("disabled", true);
    invokeApi("mallcashticket/activecashticket",{"cashticketno":cashno},Math.random(),function(ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html";
        } else {
            $(obj).removeAttr("disabled");
            if(data.state==1){
                showMessage("激活成功");
                window.location.reload();
            }
            else{
                showMessage("激活失败");
            }
        }
    });
});

