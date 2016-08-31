/**
 * ΢微信扫码支付
 * **/
$(function(){
    var num=[];
    //num
    $('.num-item').on('touchstart',function(e){
        e.preventDefault();
        $(this).css('background','#e0e0e0');
    }).on('touchend',function(e){
        e.preventDefault();
        var count;
        $(this).css('background','none');
        num.push($(this).attr('data-val'));
        count=num.join('');
        $('.num-input').attr('value',count);
        $('#price').attr('value',count);
    });
    //del删除
    $('.del').on('touchstart',function(e){
        e.preventDefault();
        $(this).css('background','#e0e0e0');
    }).on('touchend',function(e){
        e.preventDefault();
        $(this).css('background','none');
        if(num.length>1){
            num.pop();
        }else{
            num=[];
        }
        count = num.join('');
        $('.num-input').attr('value',count);
        $('#price').attr('value',count);

    });
    //֧支付submit
    var hostUrl = "http://user.lechun.cc";
    var userOpenId = getQueryString("openId");
    var payData = null;


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    $('.pay-btn').on('touchstart',function(e){
        e.preventDefault();
        $(this).css('background','#e9dec6');
    }).on('touchend',function(e){
        e.preventDefault();
        var cash = $('#price').attr('value');
        $(this).css('background','#e0cb9a');

        //if (cash == null || cash == "") {
        //    alert("cash is empty");
        //    return;
        //}
        //if (userOpenId == null) {
        //    alert("userOpenId is empty");
        //}

        $.ajax({
            type : "POST", //
            url : hostUrl + "/store/pay",
            cache : false,
            data : {
                "cash" : cash,
                "openId" : userOpenId
            },
            dataType : 'jsonp', //
            jsonp : 'callbackjsonp',
            success : function(msg) {
                if (msg.code == "10000") {
                    var data = msg.data;
                    payData = {
                        "appId" : data.appid, //公众号名称，由商户接入
                        "timeStamp" : "" + data.timestamp + "", //时间戳，自1970年以来的秒数
                        "nonceStr" : data.noncestr, //随机串
                        "package" : encodeURI("prepay_id=" + data.prepayid),
                        "signType" : "MD5", //微信签名方式
                        "paySign" : data.sign
                    }
                    callPay();
                } else if (msg.msg != null) {
                    alert(msg.msg);
                }

            },
            error : function() {
                alert("pay error");
            }
        });
    });
    function callPay() {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', jsApiCall,
                    false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }
        } else {
            jsApiCall();
        }
    }

    //微信JS api支付
    function jsApiCall() {
        WeixinJSBridge.invoke('getBrandWCPayRequest', payData, function(res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                //alert("ok");
            } else if(res.err_msg == "get_brand_wcpay_request:cancle"){
                alert('支付取消');
            }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                alert('支付失败');
            }
        });
    }
});
