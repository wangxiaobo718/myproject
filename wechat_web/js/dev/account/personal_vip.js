/*vip会员中心*/
$(function(){
    var vipUserUrl = 'http://apitest.lechun.cc:9080/lechunuser';
    $(".f-vip").addClass("on").siblings().removeClass("on");

    //判断会员与否,页面跳转
    $.ajax({
        url: vipUserUrl+'/user/isvip',
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function(res){
            if(res.code == '10000'){
                if(res.data.isVipFlag == '1'){
                    $('.f-vip').show();
                }else{
                    window.location.href = '/account/personal_info.html';
                }
            }else{
                alert(res.msg);
            }

        }
    });

    /*获取用户信息*/
    invokeApi("mallcustomer/getuserinfo",{"cashType":0},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            $(".avatar img").attr("src",data.userInfo.headImage);
            $(".user-name").html(data.userInfo.nickName);
        }
    });
    /*是否为会员信息*/
    $.ajax({
        url:vipUserUrl+'/user/info',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (result) {
            var data = result.data;
            if(result.code == '10000'){
                if(parseInt(data.isVipFlag)){
                    if(!parseInt(data.vipActivityFlag)){
                        $('.member-deadline span').html('有效期至'+data.vipInfo.endDateStr);
                    }else{
                        $('.member-deadline span').html('马上去完成任务激活会员吧');
                    }
                }else{
                    $('.member-deadline span').html('领取会员可享优惠');
                }
            }else{
                alert(result.msg);
            }
        }
    });
    /*获取会员信息*/
    $.ajax({
        url:vipUserUrl+'/user/vip/info',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (result) {
            var data = result.data;
            console.log(result);
            if(result.code == '10000'){
                var vipCount = parseInt(data.toVipCount);
                var buyCount = parseInt(data.buyCount);
                var arrCountB = ['零','一','两','三','四','五','六','七','八','九','十'];
                var btnHtml = buyCount == vipCount?'本月已满单':'本月差'+arrCountB[vipCount-buyCount]+'单';
                /*item1*/
                $('.vip-renew-1 h4').html('①每月'+arrCountB[vipCount]+'单');
                $('.renew-item-1 a').html(btnHtml);
                $('.renew-item-1 p').html('每月月末购满'+arrCountB[vipCount]+'单即可成为会员，<br>并且可以激活下月会员');
                $('.progress-on').animate({width : ($('.progress-wrap').width()*(buyCount/vipCount))});
                /*item2*/
                $('.renew-item-2 .card-wrap a').each(function(index){
                    var cardHtml = '储值￥<em>'+data.giftList[index].payCash+'</em><br><b>送￥'+data.giftList[index].giveCash;
                    $(this).html(cardHtml);
                    $(this).attr('data-id',data.giftList[index].giftId);
                    $('.card-wrap input').val($('.renew-item-2 .card-wrap a').eq(0).attr('data-id'));
                })
            }else{
                alert(result.msg);
            }
        }
    });
    /*储值tab切换*/
    $('.card-wrap a').each(function(){
        $(this).on('touchend',function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('on').siblings().removeClass('on');
            $('.card-wrap input').val($(this).attr('data-id'));
        })
    });
    /*立即储值submit*/
    $('.store-submit').on('touchend',function(e){
        e.preventDefault();
        e.stopPropagation();
        var gid = $('.card-wrap input').val();
        $.ajax({
            url: vipUserUrl+'/wealth/buy/gift/wechat',
            type:'POST',
            data: {giftId: gid},
            dataType: 'jsonp',
            jsonp: 'callbackjsonp',
            success: function(result){
                console.log(result);
                var data = result.data;
                var appid = data.appid;
                var timeStamp = data.timestamp;
                var nonceStr = data.noncestr;
                var package = encodeURI("prepay_id=" + data.prepayid);
                var sign = data.sign;
                var returnUrl = encodeURI("/account/balance.html");
                window.location.href = "/wechatpay/towechatpay.html?appid=" + appid + "&timeStamp=" + timeStamp + "&nonceStr=" + nonceStr + "&package=" + package + "&sign=" + sign + "&return=" + returnUrl;
            }
        })
    });
});
