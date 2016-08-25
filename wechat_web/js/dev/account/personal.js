$(document).ready(function() {
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

});
$(".order-status-list li").on("click",function(){
        window.location.href=$(this).children("a").attr("href");
});


