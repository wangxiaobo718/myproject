$(".f-home").addClass("on").siblings().removeClass("on");
if(parseInt($(".limit-buy").attr("count"))>0){
    $(".limit-buy").addClass("on");
}
$(".single-pro li section section strong i").each(function () {
    if(parseInt( $(this).find("n").text())>0){
        $(this).addClass("on");
    }
});
var url=window.location.href;
var id=url.replace(/(.*\/)*([^.]+).*/ig,"$2");

$("#p"+id).parent().parent().parent().parent().hide();

var curCount=0;
// 加
$('body').on('click','.pro-price .increase',function(){
    var obj=$(this);

    var isProduct=1;
    var limitCount=$(".limit-buy").attr("count");
    var pid=$("#productid").val();
    if(pid==undefined){
        p=$(this).siblings("input[name='groupid']");
        pid=$(p).val();
        isProduct=0;
    }

    var numVal = $(".f-cart em").html();

    if(numVal>=100){
        showMessage("已超过购物车上限");
        return;
    }
    invokeApi("mallshoppingcart/addcart",{"productid":pid,"quantity":1,"isproduct":isProduct},Math.random(),function(ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html";
        } else {
            curCount++;
            console.log(curCount+"      "+limitCount);
            if(curCount>=limitCount &&limitCount>0){
                $(obj).addClass("unincrease").removeClass("increase");
            }
            if(data.status=="1") {

                $(".f-cart em").html(data.count);

                /****************************************飞的效果**********************************/
                var plus = $(obj);
                $('body').append("<div class='fly'>1</div>");
                var flyElm = $(".fly").css('opacity', 0.75);
                flyElm.css({
                    'z-index': 10001,
                    'display': 'block',
                    'position': 'absolute',
                    'top': plus.offset().top + 'px',
                    'left': plus.offset().left + 'px',
                });
                flyElm.animate({
                    top: $('.f-cart em').offset().top,
                    left: $('.f-cart em').offset().left,
                    width: 14,
                    height: 14,
                }, 'slow', function () {
                    flyElm.remove();
                    //$(".f-cart em").html($(".set-cart em").html());
                });
                /****************************************飞的效果**********************************/

            }else{
                $(obj).addClass("unincrease").removeClass("increase");
            }
        }
    });


});

//产品详情页特价
$(document).ready(function(){
    var stat = $(".pro-price .new-price").attr("promotion");
    if(stat==1){
        $(".pro-price").addClass("price-special");
    }else{
        $(".pro-price").removeClass("price-special");
    }
});