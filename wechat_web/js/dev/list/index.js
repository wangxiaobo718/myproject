$(".f-home").addClass("on").siblings().removeClass("on");

$(".single-pro li section section strong i").each(function () {
   if(parseInt( $(this).find("n").text())>0){
       $(this).addClass("on");
   }
});


// 首页大图滚动
TouchSlide({
    slideCell:"#banner",
    titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
    mainCell:".bd ul",
    effect:"leftLoop",
    interTime:3000,
    autoPlay:true,//自动播放
    autoPage:true, //自动分页
    switchLoad:"_src" //切换加载，真实图片路径为"_src"
});
//初始化首页大图位置
$(function(){
    function setBanTop(){
        $('#banner').css('margin-top',$('.hd-select').height());
    }
    setBanTop();
    $(window).resize(function(){
        setBanTop();
    })
});
$(function(){
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
    // 置顶品类选项切换
    var $categorySelect = $(".hd-select");
    $categorySelect.each(function(){
        var $categoryLi = $(this).find("ul li");
        $categoryLi.on("touchend",function(e){
            e.preventDefault();
            $(this).addClass("on").siblings().removeClass("on");
        });
    });
    var bindCode=GetQueryString("bindcode");
    var qrcode=GetQueryString("qrcode");
    if(bindCode==""){
        bindCode=qrcode;
    }
    var source=GetQueryString("source");
    if(source=="1"){
        $("#alert-fit").show();
        $("html,body").addClass("hidden");
    }
    if(bindCode!=""){
        invokeApi("mallcashticket/sendcashticket",{"bindcode":bindCode},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data.status==1){
                    //var message=data.message;
                    if(bindCode=="e2878f8d18d511e6974ba0d3c1044194") {
                        $("#alert-changcheng").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="a8310cd7442840a8be685a9550f9ba79") {
                        $("#alert-huanlegu").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="1ac2005f924d4ca38f63ae3c3387db58") {
                        $("#alert-cishanjishi").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="49162824fc914c7cb7471a7f663cd965") {
                        $("#alert-nuojinjiudian").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    if(bindCode=="517420ff032a446688e4220b161873ec") {
                        $("#alert-yingnuo").show();
                        $("html,body").addClass("hidden");
                        return;
                    }
                    showMessage("恭喜成功领取优惠券！");
                    //$("#alert-other").show();
                    //$("html,body").addClass("hidden");
                }

            }
        });
    }
});
// 体验包包月包tab切换
$('.com-twotab li').on('click',function(){
    $(this).addClass('on').siblings().removeClass('on');
    $('.container .ind-content').eq($(this).index()).addClass('on').siblings().removeClass('on');
});

$('.groupBuy').click(function(){

    $(".alert-bg").show();
    $(".group-alert").show();
    $("html,body").addClass("hidden");

    //var v=$(".hd-select ul .on").find("a em").text();
    var groupId=$(this).siblings("input[name='groupid']").val();
    $("input[name='group-pop-Id']").val(groupId);
    return false;
    //var quantity=1;
    //window.location.href="/topay.html?type="+v+"&groupId="+groupId+"&quantity="+quantity;
});
$("#groupPay").click(function () {
    var v=$(".hd-select ul .on").find("a em").text();
    var groupId=$("input[name='group-pop-Id']").val();
    var quantity=$(this).parent().siblings().find(".num").val();
    if(groupId!=undefined && quantity>0)
        window.location.href="/topay.html?type="+v+"&groupId="+groupId+"&quantity="+quantity;
    else
        alert("请选择数量。")
});
//套餐支付弹窗
//$("#grounp-buy").on('click',function(){
//
//});
/*
$(".btn-cancel").click(function(){
    $(".alert-bg").hide();
    $(".group-alert").hide();
    $("html,body").removeClass("hidden");
});*/
$(".group-decrease").click(function(){
    numVal = parseInt($(this).siblings('.num').val());
    if(numVal>1) {
        numVal--;
        $(this).siblings('.num').val(numVal);
    }
});
$(".group-increase").click(function(){
    numVal = parseInt($(this).siblings('.num').val());
    if(numVal<100) {
        numVal++;
        $(this).siblings('.num').val(numVal);
    }
});
//长城彩跑弹窗
$("#btn-changcheng,#btn-huanlegu,#btn-cishanjishi,#btn-nuojinjiudian,#btn-yingnuo,#btn-other").click(function(){
    $(".alert-box").hide();
    $("html,body").removeClass("hidden");
});
$(".btn-buy,#alert-fit .bg").click(function(){
    $("#alert-fit").hide();
    $("html,body").removeClass("hidden");
});
//首页特价产品
$(document).ready(function(){
    //倒计时
    var showCountDown = function(){
        invokeApi("mallPromotion/getcurrentpromotion", {}, "", function (ret) {
            var data = eval(ret);
            if(data.status==1) {
                if($(".countdown-box").length>0) {
                    var seconds = data.seconds; //倒计时总秒数
                    var hour = data.hour;
                    var minute = data.minute;
                    var second = data.second;
                    $(".countdown").attr("data-countdown", seconds);
                    $(".countdown .h").text(formatTime(hour));
                    $(".countdown .m").text(formatTime(minute));
                    $(".countdown .s").text(formatTime(second));
                    setTimeout(function () {
                        console.log("ready!");
                        var i = parseInt($(".countdown").data("countdown"));
                        var interTimer = setInterval(function () {
                            if (i > 0) {
                                i--;
                                var h = Math.floor(i / 3600); //计算小时
                                var m = Math.floor((i / 60) % 60); //计算分
                                var s = Math.floor(i % 60); // 计算秒
                                $(".countdown .h").text(formatTime(h));
                                $(".countdown .m").text(formatTime(m));
                                $(".countdown .s").text(formatTime(s));
                            } else {
                                window.location.href = "/";
                                clearInterval(interTimer);
                            }
                        }, 1000);
                    }, 0);
                }
            }else{
                //$(".price-special").removeClass("price-special");

            }
        });

    }();

    var formatTime=function(t){
        if(t.toString().length==1){
            return "0"+ t.toString();
        }else{
            return t.toString();
        }

    }
    $(".single-pro li").each(function(){
        var $me = $(this).find(".new-price");
        var stat = $me.attr("promotion");
        if(stat==1){
            $(this).addClass("price-special");
        }else{
            $(this).removeClass("price-special");
        };
    });
    var firstPage=function(){
        invokeApi("malllisting/getfirstpagecount", {}, " ", function (ret) {
            var data = eval(ret);
            var cashCount=data.cashCount;
            var balance=data.balance;
            $("#cashNum").text(cashCount);
            $("#balanceNum").text(balance);
        });
    }();

});
//首页地址
showAddress();
function showAddress(){
    invokeApi("mallconsignee/getFontLocation", {}, "", function (ret) {
        var data = eval(ret);
        // console.log(data);
        // locBrowser(initNewCustomer);
        if(data != null && data.addrlist != null){//老用户
            $("#address").val(data.addrlist[0]['ADDR_ID']);
            $("#address").attr("areaId",data.addrlist[0]['AREA_ID']);


            $(".address-time").html(data.deleverystr.split(";")[0] + "前下单可");
            $(".address-time").css("display","inline");
            if(data.addrlist[0]['ADDRESS'].split(" ").length>1){
                $("#address").attr("address",data.addrlist[0]['ADDRESS'].split(" ")[1]);
                setCookie("lechuncookieaddress",data.addrlist[0]['AREA_ID'] + "|" + data.addrlist[0]['ADDRESS'].split(" ")[1]);
                if(data.addrlist[0]['ADDRESS'].split(" ")[1].length>15){
                    $(".address-info").html(data.addrlist[0]['ADDRESS'].split(" ")[1].substr(0,15) + "...");
                } else {
                    $(".address-info").html(data.addrlist[0]['ADDRESS'].split(" ")[1]);
                }
            } else {
                $("#address").attr("address",data.addrlist[0]['ADDRESS']);
                setCookie("lechuncookieaddress",data.addrlist[0]['AREA_ID'] + "|" + data.addrlist[0]['ADDRESS']);
                if(data.addrlist[0]['ADDRESS'].length>15){
                    $(".address-info").html(data.addrlist[0]['ADDRESS'].substr(0,15) + "...");
                } else {
                    $(".address-info").html(data.addrlist[0]['ADDRESS']);
                }
            }
            $(".address-title").html(data.deleverystr.split(";")[1] + "送达");
            //弹地址列表的窗
            $(".address-before-box").off("click");
            $(".address-before-box").on("click",data.addrlist,popAddressAlert);
        } else {//新用户
            locBrowser(initNewCustomer);
        }
    });
}
var initNewCustomer = function(point){
    getLocationByLatLng(point.lng,point.lat,point,initNewCustomer_2);
    
}
var initNewCustomer_2 = function(curLoc,addr){
    // console.log("here",curLoc);
    var loc = curLoc['province'] + curLoc['city'] + curLoc['district'] + curLoc['street'] + curLoc['streetNumber'];
    var shortLoc = curLoc['district'] + curLoc['street'] + curLoc['streetNumber'];
    var _province = "";
    var _city = "";
    var _area = "";
    for(var i = 0;i<provinces.length;i++){
        if(curLoc['province'] == provinces[i][2]){
            _province = provinces[i][1];
            break;
        }
    }
    for(var i = 0;i<citys.length;i++){
        if(curLoc['city'] == citys[i][2]){
            _city = citys[i][1];
            break;
        }
    }
    for(var i = 0;i<areas.length;i++){
        if(curLoc['district'] == areas[i][2]){
            _area = areas[i][1];
            break;
        }
    }
    if(_province != "" && _city != "" && _area != "" ){
        $("#address").attr("areaId",_area);
        $("#address").attr("address",shortLoc);
        setCookie("lechuncookieaddress",_area + "|" + shortLoc);
        var params = {
            "AREA_ID" : _area,
            "ADDRESS" : shortLoc
        };
        invokeApi("mallconsignee/getFontLocationByAddressOnly", params, "", function (ret) {
            var data = eval(ret);
            // console.log(data);
            if(data != null){
                $(".address-time").html(data.deleverystr.split(";")[0] + "前下单");
                $(".address-time").css("display","inline");
                if(shortLoc.length>15){
                    $(".address-info").html(shortLoc.substr(0,15) + "...");
                } else {
                    $(".address-info").html(shortLoc);
                }
                $(".address-title").html(data.deleverystr.split(";")[1] + "送达");
            }
        });
    } else {//未开通的区域
        //弹新建地址的窗
        $(".address-time").html();
        $(".address-time").css("display","none");
        $(".address-info").html(shortLoc);
        $(".address-title").html("暂未开通");
    }
    $(".address-before-box").off("click");
    $(".address-before-box").on("click",popAddressNewAlert);
}
//弹出地址列表
var popAddressAlert = function(event){
    var data = event.data;
    if (data == 0) {
        popAddressNewAlert();
    } else if(data != null){
        var on="";
        $(".address-main ul li").remove();
        for(var i=0;i<data.length;i++){
            var address=data[i];
            if(i==0)
                on="class='on'";
            else
                on="";
            $(".address-main ul").append("<li class='clearfix dyclick' addrid='"+address.ADDR_ID+"' provinceid="+address.PROVINCE_ID+" cityid='"+address.CITY_ID+"' areaid='"+address.AREA_ID+"' >"+
                "<p class=\"address-type\" addresstype='"+address.ADDRESS_TYPE+"'>"+getAddress_AddressType(address.ADDRESS_TYPE)+"</p>"+
                "<p class=\"address-sec\"><span>"+address.CONSIGNEE_NAME+"</span>&ensp;/&ensp;<span>"+address.CONSIGNEE_PHONE+"</span></p>"+
                "<p class=\"address-det\" longitude=\"" + address.LONGITUDE + "\" latitude=\"" + address.LATITUDE + "\" housenum=\"" + address.HOUSENUM + "\">" + address.ADDRESS + " " + "</p>"+
                "<em class=\"address-edit\"></em>"+
                "</li>");
            if(i==0)
                $(".address-main ul li").addClass("on");
            $(".address-type").addClass(getAddress_AddressClass(address.ADDRESS_TYPE));
        }
        $(".alert-bg").show();
        $(".address-alert").addClass("on");
        $("html,body").addClass("hidden");
    }
    return false;
}
var popAddressNewAlert = function(){
    $(".alert-bg").show();
    $(".address-alert").removeClass("on");
    if($("#newaddress").html() == ""){
        $("#newaddress").html("<span>写字楼、小区、地表建筑名称</span>");
    }
    $(".new-alert").addClass("on");
    $("html,body").addClass("hidden");
    if($(".address-main ul").children().size()>0){
        $(".address-tips").hide();
    }
    invokeApi("mallconsignee/getCustomerLocation",{},Math.random(), function (ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            if (data!=null) {
                if($("#ProvinceId").val()==-1) {
                    fillProvince(data.provinceId);
                    fillCity(data.cityId);
                    fillArea(data.areaId);
                }
            }
        }
    });
    return false;
}
//选择收货地址确认
$(".address .submit").on("click",function() {
    var obj = $(this).parent().siblings(".address-main").find("ul .on");
    var a = addressConfirm(this);
    // console.log(a);
    if(a){
        invokeApi("mallconsignee/updateAddressLastTime", a, "", function (ret) {
            showAddress();
        });
    }
    

    // invokeApi("mallconsignee/getFontLocationByAddress", a, "", function (ret) {
    //     var data = eval(ret);
    //     console.log(data);
    //     if(data != null && data.addrSelected != null){
    //         if (window.sessionStorage) {
    //             window.sessionStorage.removeItem("selectedADDR");
    //             window.sessionStorage.setItem("selectedADDR",JSON.stringify(a));
    //         } else {
                
    //         }
    //         $("#address").val(a['ADDR_ID']);
    //         $(".address-time").html(data.deleverystr.split(";")[0] + "前下单");
    //         $(".address-time").css("display","inline");
    //         if(a['ADDRESS'].split(" ").length>1){
    //             $(".address-info").html(a['ADDRESS'].split(" ")[1]);
    //         } else {
    //             $(".address-info").html(a['ADDRESS']);
    //         }
    //         $(".address-title").html(data.deleverystr.split(";")[1] + "送达");
    //     }
    // });
    // if (a != undefined) {
    //     initDefaultAddress(a);
    //     initDefaultDeliverAddressChange(obj.attr("provinceid"), obj.attr("cityid"), obj.attr("areaid"), a.ADDRESS);
    // }
});
