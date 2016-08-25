$(function(){
    $(".order-detail-list .pay-order").remove();
    $(".f-my").addClass("on").siblings().removeClass("on");
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
    //提交反馈
    $('#sendFeedback').on('click',function(){
        var cont = $('.user-feedback').val();
        var phone=$(".user-phone").val();
        if(cont==''||cont.length<5){
            showMessage("Sorry, 反馈内容不能为空噢");
        }else{
            if(phone!=''){
                if(!regularPhone(phone)){
                    showMessage("请填写正确的手机号");
                    return false;
                }
            }
            invokeApi("mallcustomer/feedback",{"content":cont,"phone":phone},Math.random(),function(ret){
                var data = eval(ret);
                if (data.error_code != null) {
                    window.top.location.href = "/404.html";
                } else {
                    if(data.status==1){
                        $('.user-feedback').val("");
                        $(".user-phone").val("")
                    }
                    showMessage(data.message);
                }
            });
        }
    });
});
