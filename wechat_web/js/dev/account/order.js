$(document).ready(function(){
    var page=100;
    var count=1;
    var statusClass=GetQueryString("status");
    if(statusClass==""){
        statusClass="0";
    }
    if(statusClass!=0&&statusClass!=1&&statusClass!=2&&statusClass!=3&&statusClass!=4)
        statusClass=0;
    $(".order-tab .l"+statusClass).addClass("on");

    $(".order-detail-list .pay-order").remove();
    $(".f-my").addClass("on").siblings().removeClass("on");
    getOrderList(page,count,statusClass);
});


//得到订单列表
function getOrderList(page,count,statusClass){
    invokeApi("mallorder/getcustomerorderlist",{"page":page,"count":count,"statusClass":statusClass},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            for (var i = 0; i < data.length; i++) {
                var orderMain = eval(data[i]);
                var productStr="";
                var prdDetailLinkStr="";
                var productCount=0;
                var deliverDate=orderMain.deliverDateShow;
                var p=orderMain.product;
                for(var j=0;j<p.length;j++){
                    var product=eval(p[j]);
                    productCount+=parseInt(product.QUANTITY);
                    productStr+='<li>'+
                        '<p class="clearfix">'+
                        '<em>'+product.PRODUCT_NAME+'</em><strong>X&nbsp;'+product.QUANTITY+'</strong><i class="price">¥'+product.TOTAL_PRICE+'</i>'+
                        '</p>'+
                        (orderMain.ORDER_CLASS==1? '<span>￥'+product.UNIT_PRICE+'/盒</span>':'')+
                        '</li>'
                }
                prdDetailLinkStr+='<li class="clearfix li-btn">'+
                    '<a class="btn-detail-view" href="javascript:void(0);">查看订单详情<i class="icon-arrow-r"></i></a>'+
                    '</li>'
                //得到当前订单和进度
                var curOrder=orderMain.curOrder;
                var sche="";

                if(curOrder!=null && curOrder!=undefined){
                    var cursec="";
                    for(var j=0;j<curOrder.length;j++)
                    {
                        var o=curOrder[j];
                        if(o.isOn==1) {
                            cursec='<section class="transport-status clearfix">' +
                                '<i class="icon"></i>' +
                                '<div class="status">' +
                                '<label for="">当前状态：</label>' + o.statusName +
                                '</div>' +
                                '<div class="date">配送时间：' + o.times + '</div>' +
                                '</section>';
                        }
                        var cl="";
                        if(o.isOn==2)
                            cl='class="on done"';
                        if(o.isOn==1)
                            cl='class="on current"';


                        sche+='<li '+cl+'><div class="times">第'+ o.PS_TIMES+'次</div></li>';
                    }
                    var scheClass="";
                    if(curOrder.length==2){
                        scheClass="schedule-2";
                    }
                    if(curOrder.length==3){
                        scheClass="schedule-3";
                    }
                    sche=cursec+'<section class="schedule '+scheClass+'"><ul class="clearfix">'+sche+'</ul></section>';

                }

                var btnGroup='';

                if(orderMain.statusClass==1||orderMain.statusClass==2||orderMain.statusClass==3||orderMain.statusClass==4) {
                    btnGroup = '<div class="btn-group">';
                    if (orderMain.statusClass == 1) {
                        btnGroup += '<button id="cancel" class="btn btn-cancel dyclick">取消订单</button><button id="pay" class="btn btn-confirm dyclick">付款</button>';
                    }
                    if (orderMain.statusClass == 3) {
                        btnGroup += '<button id="deliver" class="btn btn-cancel dyclick">查看物流</button><button id="confirm" class="btn btn-confirm dyclick">确认收货</button>';
                    }
                    if (orderMain.statusClass == 4) {
                        btnGroup += '<button id="deliver" class="btn btn-cancel dyclick">查看物流</button><button id="feedback" class="btn btn-confirm dyclick">评价</button>';
                    }
                    if (orderMain.statusClass == 2||orderMain.statusClass == 3||orderMain.statusClass == 4) {
                        btnGroup += '<button id="share"   class="btn btn-confirm dyclick">分享红包</button>';
                    }
                    btnGroup += '</div></section>';
                }
                var deliverinfo="随心订购";
                if(orderMain.deliverPeriod==1)
                    deliverinfo='体验一次';
                if(orderMain.deliverPeriod==7)
                    deliverinfo='包月自选';
                var DeliverCount='';
                if(orderMain.deliverCount>1){
                    DeliverCount='<div class="pos-r"><i class="sign-pay-num" id="imgdelivercount"><strong>配送<span class="num">'+orderMain.deliverCount+'</span>次</strong></i></div>';
                }
                var deliverUl='';
                if(orderMain.deliverPeriod==1)
                {
                    deliverUl = '<ul class="order-other order-list-other">' +
                        '<li>' +
                        '<a class="delivery-time delivery-time-list" href="javascript:void(0);" title="">' +
                        '配送时间' +
                        '<em class="enter-key"></em>' +
                        '<span>已选择<em>' + deliverDate + '</em>配送</span>' +
                        '</a>' +
                        '</li>' +
                        '</ul>';
                }
                $(".order-detail-list").append('<section class="pay-section pay-order clearfix"  orderNo="' + orderMain.ORDER_MAIN_NO +'"openId="'+orderMain.CHANNEL_CUSTOMER_ID+ '" statusClass="' + orderMain.statusClass + '">'+
                    '<h3 class="order-list-title">'+
                    DeliverCount+
                    '<i class="icon icon-gift"></i>'+deliverinfo+
                    '<span class="status">'+orderMain.statusName+'</span>'+
                    '</h3>'+
                    deliverUl+
                    '<ul class="order-list dyclick">'+
                    productStr+
                    prdDetailLinkStr+
                    '</ul>'+
                    '<section class="order-total">'+
                    '共'+productCount+'件商品&emsp;合计:<span>￥'+orderMain.PAY_AMOUNT+'</span> (含运费¥'+orderMain.FREIGHT+'元)'+
                '</section>'+sche+btnGroup);

            }

        }
        //没有订单的情况
        var orderNone = '<img src="/images/order_none.png" alt="你还没有订单，去买买买吧～"/>'+
            '<p>你还没有订单，去买买买吧～</p>'+
            '<div class="btn-group">'+
            '<a href="/" class="btn btn-cancel btn-get-coupon">去逛逛</a>'+
            '</div>';
        if(data.length==0){
            $(".order-detail-list").addClass("order-empty");
            $(".order-detail-list").append(orderNone);
        }
    });
}
//取消订单
$("body").on("click","#cancel",function(){
    var obj=$(this);
    var orderNo=$(this).parent().parent().attr("orderNo");
    var statusClass=$(this).parent().parent().attr("statusClass");
    if(statusClass!=1){
        showMessage("该订单不能取消");
        return false;
    }
    if(confirm("确定取消订单吗？")) {
        invokeApi("mallorder/cancelcustomerorder", {"orderMainNo": orderNo}, Math.random(), function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if (data.status == 1) {
                    $(obj).parent().parent().remove();
                    showMessage('取消成功');
                } else {
                    showMessage('取消失败');
                }
            }
        });
    }
});

//得到OpenID和OrderNo
//function getOpenIdAndOrderNo(){
//    var page=20;
//    var count=1;
//    var statusClass=GetQueryString("status");
//    if(statusClass==""){
//        statusClass="0";
//    }
//    if(statusClass!=0&&statusClass!=1&&statusClass!=2&&statusClass!=3&&statusClass!=4)
//        statusClass=0;
//
//    invokeApi("mallorder/getcustomerorderlist",{"page":page,"count":count,"statusClass":statusClass},"",function(ret){
//        var data = eval(ret);
//
//        if (data.error_code != null) {
//            window.top.location.href = "/404.html";
//        } else {
//            for (var i = 0; i < data.length; i++) {
//                var orderMain = eval(data[i]);
//                var openId=orderMain.CHANNEL_CUSTOMER_ID;
//                var orderno=orderMain.ORDER_MAIN_NO;
//                alert("openID::::"+openId);
//                alert("orderno::::"+orderno);
//            }
//            window.location.href="http://open.fengxuan.co/HongBao/pass?FXOpenid="+openId+"&number="+orderno+"&self=1";
//        }
//    });
//}


//详情
$("body").on("click",".order-list ",function(){
    var obj=$(this);
    var orderNo=$(this).parent().attr("orderNo");
    var statusClass=$(this).parent().attr("statusClass");
    window.location.href="/account/order_detail.html?ordermainno="+orderNo;
});

//分享红包
$("body").on("click","#share",function(){
    var obj=$(this).parent();
    var orderNo=$(obj).parent().attr("orderNo");
    var openId=$(obj).parent().attr("openId");
    window.location.href="http://open.fengxuan.co/HongBao/pass?FXOpenid="+openId+"&number="+orderNo+"&self=1";
});

//查物流
$("body").on("click","#deliver",function(){
    var obj=$(this).parent();
    var orderNo=$(obj).parent().attr("orderNo");
    var statusClass=$(this).parent().attr("statusClass");
    window.location.href="/account/order_detail.html?ordermainno="+orderNo+"&collaspe=1";
});
//确认收货
$("body").on("click","#confirm",function(){
    var obj=$("#confirm");
    var orderNo=$(this).parent().parent().attr("orderNo");
    invokeApi("mallorder/confirmgoods",{"orderMainNo":orderNo,"orderNo":""},Math.random(),function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            showMessage(data.message);
            if(data.status==1){
                obj.parent().parent().remove();
            }

            //window.location.href=window.location.href;
        }
    });
});
//评价
$("body").on("click","#feedback",function(){
    window.location.href="/account/feedback.html";
});
//付款
$("body").on("click","#pay",function(){
    var orderNo=$(this).parent().parent().attr("orderNo");
    invokeApi("mallorder/directpay",{"orderMainNo": orderNo}, Math.random(), function (ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            if(data.status==0){
                showMessage("订单支付验证失败");
            }
            if(data.status==2||data.status==3){
                window.top.location.href = "/payfail.html?orderno="+orderNo;
            }
            if(data.status==4){
                window.top.location.href = "/payfail.html?orderno="+orderNo;
            }
            if(data.status==5&&data.url!=null){
                window.top.location.href = data.url;
            }
            if(data.status==6){
                window.top.location.href = "/paysuccess.html?orderno="+orderNo;
            }
        }
    });
});

