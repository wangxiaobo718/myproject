$(document).ready(function () {
    /*========== balance ==========*/
    var $parValueWrap = $('#par-value-wrap');
    var $parValueBox = $parValueWrap.find('#par-value-box');
    var $btnConfirmParVal = $parValueWrap.find('.js-btn-confirm');
    var $recordWrap = $('#record-wrap');
    var $err = $parValueWrap.find('.error');
    var $selGiftId = 0;  //当前选中的GiftId
    var hostUrlGiftApi = 'http://apitest.lechun.cc:9080/lechunuser';


    //获取用户余额
    $.ajax({
        url: hostUrlGiftApi + '/wealth/info',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (data) {
            if (data.code == 10000) {
                var value = data.data / 100;
                $('#user_wealth').html(value.toFixed(2));
            }
        }, error: function () {
            console.log(error);
        }
    });

    //获取余额储值列表
    $.ajax({
        url: hostUrlGiftApi + '/wealth/gift/list',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (data) {
            if (data.code == 10000) {
                var parValueList = '<dl class="clearfix par-value-list">';
                var data = data.data;
                $.each(data, function (id, n) {
                    var sum = n.payCash;
                    var gid = n.giftId;
                    parValueList += '<dd class="clearfix par-value" data-status="false" id="' + gid + '">' +
                        '<div class="par"><span>储值</span><strong>' +
                        sum +
                        '</strong></div>' +
                        '<div class="get-value">送￥' +
                        n.giveCash +
                        '<i></i></div>' +
                        '</dd>'
                    ;
                });
                parValueList += "</dl>";
                $parValueBox.empty().append(parValueList);
                $parValueBox.find(".par-value").eq(0).addClass("on").attr('data-status', true);
            }
        }, error: function () {
            console.log(error);
        }
    });
    //获取余额账单纪录
    $.ajax({
        url: hostUrlGiftApi + '/wealth/log/buycard',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function (data) {
            var recordList = '<dl class="clearfix record-list">';
            var data = data.data;
            console.log(typeof(data));
            if(!data){
                recordList+='<dd class="record-null">'+
                    '<img src="/images/icon-cry.png">'+
                    '<p>阿偶，暂无记录~</p>'+
                    '</div></dd>'
                ;
                recordList+="</dl>";
                $recordWrap.empty().append(recordList);
                $(".record-list").addClass("record-list-null");
            }else{
                $.each(data,function(id,n){
                    var title = n.title;
                    var time = n.time;
                    var cash = n.cash;//消费
                    var wealth = n.wealth;//余额
                        recordList+='<dd class="clearfix record">'+
                            '<div class="name-box">'+
                            '<div class="name">'+ title +'</div>'+
                            '<div class="balance-number">余额:<span>'+wealth+'</span></div>'+
                            '</div>'+
                            '<div class="money-box">'+
                            '<div class="date">'+time+'</div>'+
                            '<div class="money">'+cash+'</div>'+
                            '</div></dd>'
                        ;
                });
                recordList+="</dl>";
                $recordWrap.empty().append(recordList);
            }

        }, error: function () {
            console.log(error);
        }
    });
    //储值
    $("body").on("touchend", '#par-value-box .par-value', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).siblings().removeClass('on').attr('data-status', false);
        $(this).addClass('on').attr('data-status', true);
        $err.hide();
    });

    $btnConfirmParVal.on('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $parValueBox.each(function () {
            //var st = $(this).find('.par-value').data('status');
            var gid = $(this).find('.par-value.on').attr('id');
            if (gid != null) {
                console.log('ok');
                $err.hide();
                return $.ajax({
                    url: hostUrlGiftApi + '/wealth/buy/gift/wechat',
                    type: 'POST',
                    data: {giftId: gid},
                    dataType: 'jsonp',
                    jsonp: 'callbackjsonp',
                    success: function (msg) {
                        console.log('message:', msg.msg);
                        var data = msg.data;
                        var appid = data.appid;
                        var timeStamp = data.timestamp;
                        var nonceStr = data.noncestr;
                        var package = encodeURI("prepay_id=" + data.prepayid);
                        var sign = data.sign;
                        //var orderNo = GetQueryString("orderno");
                        var returnUrl = encodeURI("/account/balance.html");
                        //alert("/wechatpay/towechatpay.html?appid="+appid+"&timeStamp="+timeStamp+"&nonceStr="+nonceStr+"&package="+package+"sign="+sign+"&returnUrl="+returnUrl);
                        window.location.href = "/wechatpay/towechatpay.html?appid=" + appid + "&timeStamp=" + timeStamp + "&nonceStr=" + nonceStr + "&package=" + package + "&sign=" + sign + "&return=" + returnUrl;
                    }, error: function () {
                        console.log(error);
                        if (msg.code = 20000) {
                            console.log("接口传递的参数错误");
                        } else if (msg.code = 30000) {
                            console.log("服务器内部错误");
                        }
                    }
                });
            } else {
                $err.show();
            }
        });
    });
});


