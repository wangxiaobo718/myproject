$(document).ready(function(){
    var url=window.location.href;
    var type=2;
    if(url.indexOf("account")>=0){
        type=1;
    }
    invokeApi("mallshoppingcart/getcartcount",{"type":type},Math.random(),function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html?"+data.error_code+data.error_msg;
        } else {
            $(".f-cart em").html(data.count);
            if(data.count%gBeginSaleCount!=0){
                $(".index-page .f-cart span").show().html("请购买6的倍数~");
            }else{
                $(".index-page .f-cart span").hide();
            }
            var productCount=data.productcount;
            if(productCount!=null && productCount!=undefined) {
                for (var i = 0; i < data.productcount.length; i++) {
                    var productCount = eval(data.productcount[i]);
                    if (productCount.count > 0) {
                        var num = $(".opera #p" + productCount.productid).siblings(".num");
                        $(num).val(productCount.count);
                        if (parseInt($(num).attr("limitcount")) > 0 && parseInt($(num).attr("limitcount")) <= productCount.count) {
                            $(num).siblings(".increase").addClass("unincrease");
                            //alert($("#productid").val()+" "+productCount.productid);
                            if ($("#productid").val() == productCount.productid)
                                $(".pro-price .increase").addClass("unincrease");
                        }
                        $(".opera #p" + productCount.productid).siblings(".num,.decrease").removeAttr("hidden");
                    }
                }
            }
        }
    });
});
//我的乐纯
$(".f-my").on("click",function(){
    window.location.href="/account/personal_info.html";
});
//会员中心
$(".f-vip").on("click",function(){
    window.location.href="/account/personal_vip.html";
});
$(".f-home").on("click",function(){
    window.location.href="/";
});


//会员入口的显示与否
$(function(){
    var vipUrl = "http://apitest.lechun.cc:9080/lechunuser/user/isvip";
    $.ajax({
        url: vipUrl,
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'callbackjsonp',
        success: function(res){
            if(res.code == '10000'){
                if(res.data.isVipFlag == '1'){
                    $('.f-vip').show();
                }else{
                    $('.f-vip').hide();
                }
            }else{
                alert(res.msg);
            }
        }
    })
});

//点击购物车，弹层
$(".f-cart").on('click',function(){
    $(".alert-bg").show();
    $(".settlement").addClass("on");
    $("html,body").addClass("hidden");
    $(".topay .unclick").hide();
    $(".topay .unclick em").html(gBeginSaleCount);
    var area=getCookie("lechuncookieaddress");
    var areaId=0;
    var address="";
    var boxTips='';
    if(area!=null){
        areaId=area.split("|")[0];
        address=area.split("|")[1];
    }

    invokeApi("mallshoppingcart/getcartlist",{"areaId":areaId,"address":address},Math.random(),function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html?"+data.error_code ;
        } else {
            $(".set-list").children().remove();
            var count=0;
            var amount=0;
            for (var i = 0; i < data.cart.length; i++) {
                var shop = eval(data.cart[i]);
                count+=shop.QUANTITY;
                amount+=parseFloat(shop.PRO_PRICE)*shop.QUANTITY;
                var unin="";
                if(shop.LIMIT_BUY_COUNT!=0 && shop.QUANTITY>=shop.LIMIT_BUY_COUNT){
                    unin="unincrease";
                }
                if(shop.delay>0 && proDelayList.indexOf(shop.PRO_NAMESx+'口味')<=-1){
                    proDelayList.push(shop.PRO_NAMESx+'口味');
                }
                if(shop.delay>0){
                    boxTips="block";
                }else{
                    boxTips='none';
                }

                $(".set-list").append('<li><p>'+shop.PRO_NAME+'<em class="done" style="display: '+boxTips+'">今日<br/>抢光</em></p><section class="opera"><i class="increase dyclick '+unin+'"></i>'+
                    '<input type="hidden" name="productid" id="p'+shop.PRODUCT_ID+'" value="'+shop.PRODUCT_ID+'" amount="'+shop.PRO_PRICE+'" cart="1" >'+
                    '<input class="num" type="text" readonly="readonly" limitcount="'+shop.LIMIT_BUY_COUNT+'" value="'+shop.QUANTITY+'">'+
                    '<i class="decrease dyclick"></i></section></li>');
            }
            //购物车库存提醒
            if(data.delay>0){
                listHtml = '你喜欢的'+proDelayList.join('、')+'酸奶抢光啦,会延迟发货哦,本次订单预计<em>最早送达时间为'+ret.maxDeliverDate+'</em>';
                $(".list-tips").show().html(listHtml);
            }else{
                $('.list-tips').hide();//弹出购物车右上角tips
            }

            $(".set-cart em").html(count);
            $(".set-bottom em").html(amount.toFixed(2));
            if(count<gBeginSaleCount ||count%gBeginSaleCount!=0){
                $(".topay a").first().hide();
                $(".topay .unclick").show();
                if(count<gBeginSaleCount) {
                    $(".topay .unclick").html("还差<em>"+(gBeginSaleCount - count)+"</em>盒起送，快去凑单哦~");
                    // $(".f-cart span").html("还差<i>"+(gBeginSaleCount - count)+"</i>盒起送，快去凑单哦~");
                }else{
                    $(".topay .unclick").html("请购买6的倍数<em></em>~");
                    // $('.f-cart span').html("请购买6的倍数,还差<i>"+(Math.ceil(data.count/gBeginSaleCount)*gBeginSaleCount-data.count)+"盒</i>~");
                }
            }else{
                $(".topay a").first().show();
                $(".topay .unclick em").hide();
                $(".topay .unclick em").html("0");
            }
            recommend(data.recommend);
            setCartHeight();
        }
    });

    return false;
});
// 数量加减效果
var numVal;
var proDelayList =[];//库存不足产品列表
var listHtml='';
// 减
$('body').on('touchend','.opera .decrease',function(e){
    e.preventDefault();
    e.stopPropagation();
    var obj=$(this);
    var p=$(this).siblings("input[name='productid']");
    var pid=$(p).val();
    var boxTips="";
    var area=getCookie("lechuncookieaddress");
    var areaId=0;
    var address="";
    if(area!=null){
        areaId=area.split("|")[0];
        address=area.split("|")[1];
    }

    $(this).siblings().removeClass("unincrease");
    $("#p"+pid).siblings().removeClass("unincrease");
    $("#productid").parent().siblings(".pro-price").find(".limit-buy i").removeClass("unincrease").addClass("increase");
    invokeApi("mallshoppingcart/addcart",{"productid":pid,"quantity":-1,"areaId":areaId,"address":address},Math.random(),function(ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html";
        } else {
            if(data.status==1) {
                $(".f-cart em").html(data.count);
                $(".set-cart em").html(data.count);
                var amount=$(".set-bottom em").html();
                var a=$(p).attr('amount');
                amount=parseFloat(amount)-parseFloat(a);
                $(".set-bottom em").html(amount.toFixed(2));
                if(data.count<gBeginSaleCount||data.count%gBeginSaleCount!=0){
                    $(".topay a").first().hide();
                    $(".topay .unclick").show();
                    $(".index-page .f-cart span").show().html("请购买6的倍数~");
                    if(data.count<gBeginSaleCount) {
                        $(".topay .unclick").html("还差<em>"+(gBeginSaleCount - data.count)+"</em>盒起送，快去凑单哦~");
                    }else{
                        $(".topay .unclick").html("请购买6的倍数<em></em>~");
                    }

                }else{
                    $(".topay a").first().show();
                    $(".topay .unclick").hide();
                    $(".topay .unclick em").html("0");
                    $(".index-page .f-cart span").hide();
                }
                if(data.count<gBeginSaleCount) {
                    getRecommend()
                }
                var prosubName=data.productNameSx+'口味';
                //库存提醒首页展示
                if(data.delay>0){
                    storeTips(obj);
                    $(obj).siblings('.store-tips').show();
                    obj.parents().parents('li').find('.done').show();

                }else{
                    for(var i=0;i<proDelayList.length;i++){
                        if(proDelayList[i] == prosubName){
                            proDelayList.splice(i,1);
                        }
                    }
                    $(obj).siblings('.store-tips').hide();
                    $("#p"+pid).siblings('.store-tips').hide();
                    obj.parents().parents('li').find('.done').hide();
                }
                //库存购物车展示
                if(data.delayAll>0){
                    listHtml = '你喜欢的'+proDelayList.join('、')+'酸奶抢光啦,会延迟发货哦,本次订单预计<em>最早送达时间为'+data.delayDate+'</em>';
                    $(".list-tips").show().html(listHtml);
                }else{
                    $(".list-tips").hide();
                }
            }
        }
    });
    numVal = parseInt($(this).siblings('.num').val());
    if(numVal<=1) {
        $(this).siblings('.num').attr("hidden", "hidden");
        $(this).attr("hidden", "hidden");
        $(".opera #p"+pid).siblings('.num').attr("hidden", "hidden");
        $(".opera #p"+pid).siblings('.decrease').attr("hidden", "hidden");

        //点击-，numVal<=1;隐藏库存提醒
        $(this).siblings('.store-tips').removeClass('store-tips-acted');

        numVal = 0;
        $(".f-cart em").html(numVal);
        $('.index-page .f-cart span').hide();
        $(this).siblings('.num').val(numVal);
        if(typeof($(p).attr("cart"))!="undefined"){
            $(this).parent().parent("li").remove();
        }
    }else {
        numVal--;
        //sum = Number($(".f-cart em").html());
        //$(".f-cart em").html(sum-1);
    }

    $(this).siblings('.num').val(numVal);
    $("#p"+pid).siblings('.num').val(numVal);
    setCartHeight();
})
// 加
$('body').on('touchend','section.opera .increase',function(e){
    e.preventDefault();
    e.stopPropagation();


    var pool=$(this).parent().parent().parent().hasClass("set-pool");
    var obj=$(this);
    if(!pool) {
        $(this).siblings('.num').removeAttr("hidden");
        $(this).siblings('.decrease').removeAttr("hidden");
    }
    //sum = Number($(".f-cart em").html());
    //$(".f-cart em").html(sum+1);
    var isProduct=1;
    var limitCount=0;
    var p=$(this).siblings("input[name='productid']");
    var pid=$(p).val();
    var boxTips="";
    if(pid==undefined){
        p=$(this).siblings("input[name='groupid']");
        pid=$(p).val();
        isProduct=0;
    }
    if(pool){
        numVal = $('#p'+pid).siblings(".num").val();
        limitCount=parseInt($(this).siblings('.num').attr("limitcount"));
    }else {
        numVal = parseInt($(this).siblings('.num').val());
        limitCount=parseInt($(this).siblings('.num').attr("limitcount"));
    }
    if(numVal>=100){
        showMessage("已超过购物车上限");
        return;
    }
    if(limitCount>0 &&(numVal+1)>=limitCount){
        $(this).addClass("unincrease");
        if(numVal>=limitCount)
            return ;
    }


    var area=getCookie("lechuncookieaddress");
    var areaId=0;
    var address="";
    if(area!=null){
        areaId=area.split("|")[0];
        address=area.split("|")[1];
    }
    invokeApi("mallshoppingcart/addcart",{"productid":pid,"quantity":1,"isproduct":isProduct,"areaId":areaId,"address":address},Math.random(),function(ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html";
        } else {

            if(data.status==1) {

                $(".set-cart em").html(data.count);
                var amount=$(".set-bottom em").html();
                var a=$(p).attr('amount');
                amount=parseFloat(amount)+parseFloat(a);
                $(".set-bottom em").html(amount.toFixed(2));
                if(data.count<gBeginSaleCount||data.count%gBeginSaleCount!=0){
                    $(".topay a").first().hide();
                    $(".topay .unclick").show();
                    $(".index-page .f-cart span").show().html("请购买6的倍数~");
                    if(data.count<gBeginSaleCount) {
                        $(".topay .unclick").html("还差<em>"+(gBeginSaleCount - data.count)+"</em>盒起送，快去凑单哦~");
                    }else{
                        $(".topay .unclick").html("请购买6的倍数<em></em>~");
                    }

                }else{
                    $(".topay a").first().show();
                    $(".topay .unclick").hide();
                    $(".topay .unclick em").html("0");
                    $('.index-page .f-cart span').hide();
                }
                if(data.count<gBeginSaleCount) {
                    getRecommend()
                }

                var prosubName=data.productNameSx+'口味';
                //库存提醒首页展示
                if(data.delay>0){
                    storeTips(obj);
                    obj.siblings('.store-tips').show();
                    if(proDelayList.indexOf(prosubName)<=-1){
                        proDelayList.push(prosubName);
                    }
                    obj.parents().parents('li').find('.done').show();

                }else{
                    obj.siblings('.store-tips').hide();
                    $("#p"+pid).siblings('.store-tips').hide();
                    obj.parents().parents('li').find('.done').hide();

                }
                //库存购物车展示
                if(data.delayAll>0){
                    listHtml = '你喜欢的'+proDelayList.join('、')+'酸奶抢光啦,会延迟发货哦,本次订单预计<em>最早送达时间为'+data.delayDate+'</em>';
                    $(".list-tips").show().html(listHtml);
                }else{
                    $(".list-tips").hide();
                }

                //如果是从凑一凑添加的，需要在界面上添加相应的数据
                if(pool){
                    if($(".set-list").find("#p"+pid).val()==undefined){
                        var productName=$(obj).parent().siblings("p").html();
                        var price=$(p).attr("amount");
                        $(".set-list").append('<li><p>'+productName+'</p>'+boxTips+'<section class="opera"><i class="decrease dyclick"></i>'+
                            '<input type="hidden" name="productid" id="p'+pid+'" value="'+pid+'" amount="'+price+'" cart="1" >'+
                            '<input class="num" readonly="readonly" type="text" value="1">'+
                            '<i class="increase dyclick"></i></section></li>');
                    }
                }
            }else{

            }
        }
    });

    $(this).siblings(".decrease").removeClass("invalid");
    numVal++;

    if(pool) {
        $(".set-list .opera #p"+pid).siblings('.num').val(numVal);
        $(".pro-info .opera #p"+pid).siblings('.num').val(numVal);
    }else{
        $(this).siblings('.num').val(numVal);
        $(".pro-info .opera #p"+pid).siblings('.num').val(numVal);
    }
    /****************************************飞的效果**********************************/
    var plus = $(this);
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
        $(".f-cart em").html($(".set-cart em").html());
    });
    /****************************************飞的效果**********************************/
    setCartHeight();
});
// 关闭遮罩
$(".close-alert, .back").on('click',function(){
    $(".alert-bg").hide();
    $(this).closest(".alert").removeClass("on");
    $("html,body").removeClass("hidden")
    return false;
});
//推荐商品
function recommend(recommendList){
    //推荐商品
    if(recommendList!=null){
        $(".set-mid,.set-pool").show();
        $(".set-pool").children().remove();
        for (var i = 0; i < recommendList.length; i++) {
            var recommend = eval(recommendList[i]);
            $(".set-pool").append('<li>'+
                '<img src="img/singleImg/set_img.jpg" alt="">'+
                '<p>'+recommend.PRO_NAME+'</p>'+
                '<em>￥'+recommend.PRO_PRICE+'</em>'+
                '<section class="opera">'+
                '<input type="hidden" name="productid" value="'+recommend.PRO_ID+'" amount="'+recommend.PRO_PRICE+'">'+
                '<i class="increase dyclick"></i>'+
                '</section>'+
                '</li>');
        }
    }else{
        $(".set-mid,.set-pool").hide();
    }
}

//得到推荐商品
function getRecommend(){
    $(".set-mid,.set-pool").show();
    if($(".set-pool").children().size()==0) {
        invokeApi("mallrecommend/getrecommend", {}, Math.random(), function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "404.html";
            } else {
                recommend(data);
            }
        });
    }
}
// 转到结算页
$('.topay #topay').on('click',function(){

    invokeApi("mallshoppingcart/getcartcount",{"type":1},"",function(ret){
        var data = eval(ret);
        if(data.count<gBeginSaleCount||data.count%gBeginSaleCount!=0){
            $(".topay a").first().hide();
            $(".topay .unclick").show();
            if(data.count<gBeginSaleCount) {
                $(".topay .unclick").html("还差<em>"+(gBeginSaleCount - data.count)+"</em>盒起送，快去凑单哦~");
            }else{
                $(".topay .unclick").html("请购买6的倍数<em></em>~");
            }

        }else{
            $(this).attr("disabled", true);
            if($(".settlement-head a em").html()==0)
            {
                showMessage("购物车没有商品哦");
                return false;
            }

            var count=$(".topay .unclick em").html();
            if(count>0){
                showMessage("购物车商品没有达到起购数哦");
                return false;
            }
            var v=$(".hd-select ul .on").find("a em").text();
            window.location.href="/topay.html?type="+v;
        }
    });




});
function setCartHeight() {
// 设置弹出层的高度
    var listLength = $('.list-box .set-list li').length,
        listHeight = Math.ceil($('.list-box .set-list li').outerHeight());

    if (listLength >= 6) {
        $('.list-box').css({'height': 6 * listHeight + 'px'});
    }else{
        $('.list-box').attr("style","");
    }
}

//common tab
$(function() {
    var $tabList = $('.tab-list');
    $tabList.each(function() {
        $(this).find('.tab-nav .tab').click(function(){
            $me = $(this);
            $tabContainer = $tabList.find('.tab-container');
            var index = $me.index();
            $me.addClass('on').siblings().removeClass('on');
            $target = $tabContainer.find('.tab-cont').eq(index);
            $target.show().siblings().hide();
        });
    });
});
/*库存提醒动画*/
function storeTips(item){
    var itemObj = item.siblings('.store-tips');
    if(!item.parent('.opera').find('.store-tips-acted').length){
        itemObj.addClass('store-tips-act');
        itemObj.bind("webkitAnimationEnd", function() {
            itemObj.addClass('store-tips-acted').removeClass("store-tips-act");
        });
    }else{
        itemObj.addClass('store-tips-acting');
        itemObj.bind("webkitAnimationEnd", function() {
            itemObj.removeClass("store-tips-acting");
        });
    }
}