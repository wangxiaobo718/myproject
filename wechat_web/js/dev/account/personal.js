$(document).ready(function() {
    var vipUserUrl = 'http://apitest.lechun.cc:9080/lechunuser';

    $(".f-my").addClass("on").siblings().removeClass("on");
    invokeApi("mallcustomer/getuserinfo",{"cashType":0},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            $(".avatar img").attr("src",data.userInfo.headImage);
            $(".user-name").html(data.userInfo.nickName);
            $(".status-1 a em").remove();
            $(".status-2 a em").remove();
            $(".status-3 a em").remove();
            $(".status-4 a em").remove();
            $(".status-5 a em").remove();
            $(".qty span").html(data.cashCount);
            $(".user-balance i").html(data.balance);
            //$(".f-cart em").html(data.cartCount);
            if(data.orderCount.status1>0)
                $(".status-1 a").append("<em>"+data.orderCount.status1+"</em>");
            if(data.orderCount.status2>0)
                $(".status-2 a").append("<em>"+data.orderCount.status2+"</em>");
            if(data.orderCount.status3>0)
                $(".status-3 a").append("<em>"+data.orderCount.status3+"</em>");
            if(data.orderCount.status4>0)
                $(".status-4 a").append("<em>"+data.orderCount.status4+"</em>");
            if(data.orderCount.status5>0)
                $(".status-5 a").append("<em>"+data.orderCount.status5+"</em>");
        }
    });
    /*获取会员信息*/
    $.ajax({
        url: vipUserUrl+'/user/info',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (result) {
            var data = result.data;
            console.log(result);
            if(result.code == '10000'){
                $('.member-item-2 a').html('我的余额<br/>'+data.wealth+'元');
                if(!parseInt(data.isVipFlag)){
                    $('.member-item-1 a').html('领取会员<br/>可享优惠');
                    $('.member-deadline span').html('领取会员可享优惠');
                    $('.person-info').removeClass('member-on');
                }else{
                    if(!parseInt(data.vipActivityFlag)){
                        $('.member-item-1 a').html('会员已激活<br/>查看特权');
                        $('.member-deadline span').html('有效期至'+data.vipInfo.endDateStr);
                    }else{
                        $('.member-item-1 a').html('会员未激活<br/>去完成任务');
                        $('.member-deadline span').html('马上去完成任务激活会员吧');
                    }
                    $('.person-info').addClass('member-on');
                }
            }else{
                alert(result.msg);
            }
        }
    });

});
$(".order-status-list li").on("click",function(){
        window.location.href=$(this).children("a").attr("href");
});
$(".user-balance").on("click",function(){
    window.location.href="/account/balance.html";
});


