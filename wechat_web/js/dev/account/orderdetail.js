$(function(){
    var ordermainno=GetQueryString("ordermainno");
    var orderno="";
    var collaspe=GetQueryString("collaspe");
    if(collaspe=="1"){
        $(".transportCollaspe").addClass("collaspe");
        $(".transport-list").show();
    }
    getOrderDetail(ordermainno,orderno);
    function getOrderDetail(ordermainno,orderno){
        var statusClass;
        invokeApi("mallorder/getcustomerorderdetail",{"orderMainNo":ordermainno,"orderNo":orderno},"",function(ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data!=null) {
                    getBannerImage(data.statusClass,data.DELIVER_PERIOD);

                    var orderList=data.orderList;
                    if(orderList!=null){
                        $(".swiper-wrapper").html("");
                        for (var i = 0; i < orderList.length; i++) {
                            var on="";
                            if(data.ORDER_NO==orderList[i].ORDER_NO){
                                on="on";
                            }
                            var on = "swiper-slide";
                            $(".swiper-wrapper").append('<li class='+on+'>' +
                                '<a href="javascript:void(0);">' +
                                '<i>' + orderList[i].ORDER_NO + '</i>' +
                                '<span>第' +
                                '<em>' + orderList[i].PS_TIMES + '</em>' +
                                '次</span>' +
                                '</a>' +
                                '</li>');
                        }
                        if(orderList.length>1){
                            $(".swiper-container").addClass("swiper-show");
                        }
                        //console.log(transportNum);
                        //$(".swiper-wrapper").append(transportNum);
                    }
                    var delivers=data.delivers;
                    if(delivers!=null){
                        $(".transport-list ul").html("");
                        for(var i=0;i<delivers.length;i++){
                            var deliver=delivers[i];
                            if(i==0) {
                                $("#transportCollaspe dl dt").html(deliver.CONTENT);
                                $("#transportCollaspe dl dd").html(deliver.CREATE_TIME);
                            }
                            $(".transport-list ul").append("<li class='"+(i==0?"on":"")+"'>"+
                                "<div class=\"cont\">"+
                                "    <p>"+deliver.CONTENT+"</p>"+
                                "<p>"+deliver.CREATE_TIME+"</p>"+
                                "</div>"+
                                "</li>");
                        }
                    }
                    var product = data.product;
                    $(".order-list").html("");
                    for (var i = 0; i < product.length; i++) {
                        var p=product[i];
                        $(".order-list").append('<li>' +
                            '<p class="clearfix">' +
                            '<em>' + p.PRODUCT_NAME + '</em><strong>X&nbsp;' + p.QUANTITY + '</strong><i class="price">¥' + p.TOTAL_PRICE + '</i>' +
                            '</p>' +
                            (data.ORDER_CLASS==1?'<span>￥' + p.UNIT_PRICE + '/盒</span>':'') +
                            '</li>');
                    }
                    $(".order-location dl dt span").first().text(data.CONSIGNEE_NAME);
                    $(".order-location dl dt span").next().text(data.CONSIGNEE_PHONE);

                    var addr="<span class='address'>"+data.CONSIGNEE_ADDR+"</span>";
                    addr+=" <i class='label'>"+getAddress_AddressType(data.ADDRESS_TYPE)+"</i>";
                    $(".order-location dl dd").addClass("address-box").html(addr);


                    $(".order-other li .price em").html(data.FREIGHT);
                    $(".order-other li .coupon-btn span em").html(data.cashTicketAmount);
                    <!--配送时间-->
                    $(".order-other li .delivery-time span em").html(data.DELIVER_DATE_SHOW);
                    $(".order-total em").html(data.QUANTITY);
                    $(".order-total span em").html(data.TOTAL_AMOUNT);
                    $(".order-number p").first().find("em").html(data.ORDER_MAIN_NO);
                    $(".order-number p").next().find("em").html(data.CREATE_TIME);
                    statusClass=data.statusClass;
                    //添加按钮
                    $(".pay-wechat .btn-group").html("");
                    if(data.statusClass==1||data.statusClass==3||data.statusClass==4) {

                        if (data.statusClass == 3) {
                            $(".pay-wechat .btn-group").append( '<button id="confirm" class="btn btn-cancel dyclick">确认收货</button>');
                        }
                        if (data.statusClass == 4) {
                            $(".pay-wechat .btn-group").append( '<button id="feedback" class="btn btn-cancel dyclick">评价</button>');
                        }
                    }
                }
            }
        });
    }
    //订单次数点击
    $("body").on("click",".swiper-wrapper li a",function(){
        var orderNo=$(this).find("i").text();
        $(this).parent().siblings().removeClass("swiper-slide-active");
        $(this).parent().addClass("swiper-slide-active");
        getOrderDetail(ordermainno,orderNo);
    });
    //得到banner图
    function getBannerImage(statusClass,period){
        if(statusClass==1){
            $(".transport-banner img").attr("src","/images/banner-tobe-pay.jpg");
        }
        if(statusClass==2){
            $(".transport-banner img").attr("src","/images/banner-tobe-delivery.jpg");
        }
        if(statusClass==3){
            $(".transport-banner img").attr("src","/images/banner-send.jpg");
        }
        if(statusClass==4){
            $(".transport-banner img").attr("src","/images/banner-tobe-evaluated.jpg");
        }
        if(statusClass==5){
            $(".transport-banner img").attr("src","/images/banner-refund.jpg");
        }
        if(statusClass==6){
            $(".transport-banner img").attr("src","/images/banner-cancel.jpg");
        }
        var deliverinfo="随心订购";
        if(period==1)
            deliverinfo='体验一次';
        if(period==7)
            deliverinfo='包月自选';
        $(".transport-pattern").html(deliverinfo);
    }
    //物流折叠
    $('#transportCollaspe').click(function(){
        $(this).toggleClass('collaspe');
        $(this).find('.icon-arrow').toggleClass('arrow-yellow-t');
        $(this).next('.transport-list').slideToggle();
    });

    // 关闭遮罩
    $(".close-alert, .back, .close").on('click',function(){
        $(".alert-bg").hide();
        $(this).closest(".alert").removeClass("on");
        $("html,body").removeClass("hidden")
        return false;
    });
    //复制
    $(".btn-copy").on('click',function(){
        var orderno=$(".order-number p").first().find("em").html();
        copyToClipboard(orderno);
    });

    //确认收货
    $("body").on('click',"#confirm",function(){
        var obj=$(".confirm");
        var orderno="";
        invokeApi("mallorder/confirmgoods",{"orderMainNo":ordermainno,"orderNo":orderno},Math.random(),function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data.status==1){
                    obj.remove();
                }
                showMessage(data.message);
            }
        });
    });

    //评价
    $("body").on("click","#feedback",function(){
        window.location.href="/account/feedback.html";
    });
});
function copyToClipboard(txt) {

    if (window.clipboardData) {

        window.clipboardData.clearData();

        window.clipboardData.setData("Text", txt);

        showMessage("已经成功复制到剪帖板上！");

    } else if (navigator.userAgent.indexOf("Opera") != -1) {

        window.location = txt;

    } else if (window.netscape) {

        try {

            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

        } catch (e) {

            alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
            return;
        }

        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);

        if (!clip) return;

        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);

        if (!trans) return;

        trans.addDataFlavor('text/unicode');

        var str = new Object();

        var len = new Object();

        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);

        var copytext = txt;

        str.data = copytext;

        trans.setTransferData("text/unicode", str, copytext.length * 2);

        var clipid = Components.interfaces.nsIClipboard;

        if (!clip) return false;

        clip.setData(trans, null, clipid.kGlobalClipboard);

        showMessage("已经成功复制到剪帖板上！");

    }

}

//运输tab切换
$(".swiper-wrapper").each(function(){
    var $sliderLi = $(this).find("li");
    $sliderLi.on("click",function(){
        $(this).addClass("on").siblings().removeClass("on");
    });
});
