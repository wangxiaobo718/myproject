/* 活动相关 */

$(function(){
// 关闭遮罩
    $(".close-alert, .back, .close,.alert .bg,.alert-common .bg,.alert-common .off,#btn-ask-err").on('click',function(){
        $(".alert-bg").hide();
        $(".alert-common").removeClass("on");
        $(this).closest(".alert").removeClass("on");
        $("html,body").removeClass("hidden")
        return false;
    });

//地推活动
    var $actFit = $("#act_fit");
    var $btnBuy = $actFit.find("#btn_buy,#btn_buy_2");
    var $btnSee = $actFit.find("#btn_see");
    //更多口碑图
    $actFit.find('#btn_more_1').on('click',function(){
        $actFit.find('#more_pic_1').show();
        $(this).hide();
    });
    $actFit.find('#btn_more_2').on('click',function(){
        $actFit.find('#more_pic_2').show();
        $(this).hide();
    });
    $actFit.find('#btn_more_3').on('click',function(){
        $actFit.find('#more_pic_3').show();
        $(this).hide();
    });
    //其他操作
    $btnBuy.on('click',function(){
        $("#alert_buy").addClass("on");
        $("html,body").addClass("hidden");
        var page="/active/act_fit/fitpay";
        var bindcode=GetQueryString("bindcode");
        var source=GetQueryString("source");
        var level=GetQueryString("level");
        var types=GetQueryString("types");
        if(level==""){
            level="1";
        }
        if(types==""){
            types="1";
        }
        var referrer = document.referrer;
        invokeApi("mallactive/insertactivepv",{"page":page,"bindcode":bindcode,"source":source,"level":level,"types":types,"referrer":referrer},"",function(ret){

        });
        //if( $("#AllCityId").val()!="-1"){
        //    $("#btn-buy").click();
        //    //$("#alert_buy").addClass("on");
        //    //$("html,body").addClass("hidden");
        //}else{
        //    $("#alert_buy").addClass("on");
        //    $("html,body").addClass("hidden");
        //}
    });
    $btnSee.on('click',function(){
        $("#alert_code").addClass("on");
        $("html,body").addClass("hidden");
    });
    //最终分享
    $('.js-btn-share,#alert_share_default .js-btn-share').on('click',function(){
        $("#alert_share_default").removeClass('on');
        $("#alert_share").addClass('on');
        $("html,body").addClass("hidden");
    });
    //说明开关
    $actFit.find('#info').on('click',function(){
        $(this).toggleClass('on');
    });
    
//micrsoft 活动
    $("#actMicrsoft #btnUse").on('click',function(){
        var bindcode=GetQueryString("bindcode");
        var success=GetQueryString("success");
        if(success=="2"){
            window.location.href="/account/order_list.html";
        }else{
            invokeApi("mallconsignee/getconsigneeaddresslist",{},"", function (ret) {
                var data=eval(ret);
                if (data.error_code != null) {
                    window.top.location.href = "/404.html";
                } else {
                    if(data==null ||data.length==0){
                        $(".new-alert").addClass("on");
                        $("html,body").addClass("hidden");
                    }else {
                        var on = "";
                        $(".address-main ul li").remove();
                        for (var i = 0; i < data.length; i++) {
                            var address = data[i];
                            if (i == 0)
                                on = "class='on'";
                            else
                                on = "";
                            $(".address-main ul").append("<li class='dyclick' addrid='" + address.ADDR_ID + "' provinceid=" + address.PROVINCE_ID + " cityid='" + address.CITY_ID + "' areaid='" + address.AREA_ID + "' >" +
                                "<p class=\"address-type\" addresstype='" + address.ADDRESS_TYPE + "'>" + getAddress_AddressType(address.ADDRESS_TYPE) + "</p>" +
                                "<p class=\"address-sec\"><span>" + address.CONSIGNEE_NAME + "</span>&ensp;/&ensp;<span>" + address.CONSIGNEE_PHONE + "</span></p>" +
                                "<p class=\"address-det\">" + address.ADDRESS + "</p>" +
                                "<em class=\"address-edit\"></em>" +
                                "</li>");
                            if (i == 0)
                                $(".address-main ul li").addClass("on");
                            $(".address-type").addClass(getAddress_AddressClass(address.ADDRESS_TYPE));

                        }
                        $(".alert-bg").show();
                        $(".address-alert").addClass("on");
                        $("html,body").addClass("hidden");
                    }
                }
            });

            //$(".address-alert").addClass("on");
            //$("html,body").addClass("hidden");
        }
    });
    function getAddressList(){
        if ($("#address").val() == 0) {
            $(".new-address-btn").click();
        } else {
            invokeApi("mallconsignee/getconsigneeaddresslist",{},Math.random(), function (ret) {
                var data=eval(ret);
                if (data.error_code != null) {
                    window.top.location.href = "/404.html";
                } else {
                    var on="";
                    $(".address-main ul li").remove();
                    for(var i=0;i<data.length;i++){
                        var address=data[i];
                        if(i==0)
                            on="class='on'";
                        else
                            on="";
                        $(".address-main ul").append("<li class='dyclick' addrid='"+address.ADDR_ID+"' provinceid="+address.PROVINCE_ID+" cityid='"+address.CITY_ID+"' areaid='"+address.AREA_ID+"' >"+
                            "<p class=\"address-type\" addresstype='"+address.ADDRESS_TYPE+"'>"+getAddress_AddressType(address.ADDRESS_TYPE)+"</p>"+
                            "<p class=\"address-sec\"><span>"+address.CONSIGNEE_NAME+"</span>&ensp;/&ensp;<span>"+address.CONSIGNEE_PHONE+"</span></p>"+
                            "<p class=\"address-det\">"+address.ADDRESS+"</p>"+
                            "<em class=\"address-edit\"></em>"+
                            "</li>");
                        if(i==0)
                            $(".address-main ul li").addClass("on");
                        $(".address-type").addClass(getAddress_AddressClass(address.ADDRESS_TYPE));

                    }
                }
            });
            $(".alert-bg").show();
            $(".address-alert").addClass("on");
            $("html,body").addClass("hidden");
        }
        return false;
    }
    // 点击弹出新建地址
    $(".new-address-btn").on('click',function(){
        $(".alert-bg").show();
        $(".address-alert").removeClass("on");
        $(".new-alert").addClass("on");
        $("html,body").addClass("hidden");
        //if($(".address-main ul").children().size()>0){
        //    $(".address-tips").hide();
        //}
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
    });
    //地址保存
    $(".new-address .address-btn .submit").on("click",function() {
        var addressid=$(this).parent().siblings("#newaddressid").val();
        var obj=$(this);
        var addresstype=$(this).parent().siblings(".new-form-box").find(".new-head .on").attr("addresstype");

        var provinceId=$("#ProvinceId").val();
        var cityId=$("#CityId").val();
        var areaId=$("#AreaId").val();
        var name=$("#newname").val();
        var address=$("#newaddress").html();
        var phone=$("#newphone").val();
        var apiUrl="mallconsignee/updateconsigneeaddress";
        if(addressid==""||addressid=="0") {
            apiUrl="mallconsignee/addconsigneeaddress";
        }
        if(provinceId=="-1" ||cityId=="-1"||areaId=="-1"){
            showMessage("请选择省市区.");
            return false;
        }
        if(address==""){
            showMessage("请输入详细地址.");
            return false;
        }
        if(name==""){
            showMessage("请输入姓名.");
            return false;
        }
        if(phone==""){
            showMessage("请输入手机号.");
            return false;
        }
        if(!regularPhone(phone)){
            showMessage("手机号不正确.");
            return false;
        }
        var reg=/^[^\'\\]*$/;
        if(!reg.test(name)){
            showMessage("姓名含有特殊字符.");
            return false;
        }
        if(!reg.test(address)){
            showMessage("详细地址含有特殊字符.");
            return false;
        }
        if(!reg.test(phone)){
            showMessage("手机号含有特殊字符.");
            return false;
        }

        invokeApi(apiUrl, {
            "addrid": addressid,
            "address": address,
            "areaid":areaId,
            "cityid":cityId,
            "provinceid":provinceId,
            "consigneename":name,
            "consingeephone":phone,
            "addresstype":addresstype
        },Math.random(), function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?"+data.error_code;
            } else {
                if(data.status==1){
                    //initDefaultAddress(data.address);
                    //initDefaultDeliverAddressChange(provinceId, cityId, areaId);
                    $("#ProvinceId").val(-1);
                    $("#CityId").val(-1);
                    $("#AreaId").val(-1);
                    $("#ProvinceIdValue").val("-1");
                    $("#CityIdValue").val("-1");
                    $("#AreaIdValue").val("-1");
                    $("#ProvinceIdText").val("");
                    $("#CityIdText").val("");
                    $("#AreaIdText").val("");
                    $("#newaddress").html("");
                    $("#newaddressid").val("");
                    $("#newname").val("");
                    $("#newphone").val("");
                    $(".close-alert, .back, .close").click();
                    getAddressList();
                }else {
                    showMessage(data.message);
                }
            }
        });
    });
    //初始化默认地址
    function initDefaultAddress(address){

        if(address!=null && address.ADDR_ID!=""){
            $(".pay-contact dl dt span").first().html(address.CONSIGNEE_NAME);
            $(".pay-contact dl dt span").next().html(address.CONSIGNEE_PHONE);
            $(".pay-contact dl dd em").text(address.ADDRESS);
            $(".pay-contact dl dd i").html(getAddress_AddressType(address.ADDRESS_TYPE));
            $(".pay-contact dl dd em,i").show();
            $(".pay-contact dl dd span").hide();
            $(".pay-contact dl dt").show();
            $("#address").val(address.ADDR_ID);
            if(address.AREA_ID==0){
                $("#ProvinceIdValue").val(address.PROVINCE_ID);
                $("#CityIdValue").val(address.CITY_ID);
                $("#AreaIdValue").val("-1");
                fillProvince($("#ProvinceIdValue").val());
                fillCity($("#CityIdValue").val());
                fillArea($("#AreaIdValue").val());

                $("#newaddress").html(address.ADDRESS);
                $("#newname").val(address.CONSIGNEE_NAME);
                $("#newphone").val(address.CONSIGNEE_PHONE);
                $("#newaddressid").val(address.ADDR_ID);
                $(".new-address-btn").click();
            }
        }else{
            $(".pay-contact dl dt span").first().html("");
            $(".pay-contact dl dt span").next().html("");
            $(".pay-contact dl dd em").text("");
            $(".pay-contact dl dd i").html("");
            $("#address").val("");
            $(".pay-contact dl dd em").hide();
            $(".pay-contact dl dd i").hide();
            $(".pay-contact dl dd").append("<span>没有收货地址，请点击添加</span>");
            $(".pay-contact dl dt").hide();
        }
    }
    //删除地址
    $(".address-btn .del").on("click",function(){
        var addrid=$("#newaddressid").val();
        if(addrid=="")
            return;
        var defaultId=$("#address").val();
        invokeApi("mallconsignee/deleteconsigneeaddress", {
            "addrid": addrid
        },Math.random(), function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data.status==1){
                    if(addrid==defaultId){//删除了默认的地址，重新找出一个默认地址
                        //initDefaultAddress(data.address);
                        //initDefaultDeliverAddressChange(data.address.PROVINCE_ID,data.address.CITY_ID,data.address.AREA_ID);
                    }
                    $("#ProvinceId").val(-1);
                    $("#CityId").val(-1);
                    $("#AreaId").val(-1);
                    $("#ProvinceIdValue").val("-1");
                    $("#CityIdValue").val("-1");
                    $("#AreaIdValue").val("-1");
                    $("#ProvinceIdText").val("");
                    $("#CityIdText").val("");
                    $("#AreaIdText").val("");
                    $("#newaddress").html("");
                    $("#newname").val("");
                    $("#newphone").val("");
                    $("#newaddressid").val("");
                    $(".close-alert, .back, .close").click();
                    getAddressList();
                }
            }
        });
    });
    //选择收货地址确认
    $(".address .submit").on("click",function(){
        var obj=$(this).parent().siblings(".address-main").find("ul .on");
        var addrId=obj.attr("addrid");
        var defaultId=$("#address").val();
        if(addrId!=defaultId) {
            var addressType = obj.find(".address-type").attr("addresstype");
            var name = obj.find(".address-sec span").first().text();
            var phone = obj.find(".address-sec span").next().text();
            var address = obj.find(".address-det").text();
            var a = {
                CONSIGNEE_NAME: name,
                CONSIGNEE_PHONE: phone,
                ADDRESS: address,
                ADDRESS_TYPE: addressType,
                ADDR_ID: addrId
            };
            var bindcode=GetQueryString("bindcode");
            topay(bindcode,addrId);
        }
        $(".close-alert, .back, .close").click();
    });
    function  topay(bindcode,addrId){
        invokeApi("mallactive/createactiveorder",{"addrId":addrId,"bindcode":bindcode},Math.random(), function (ret) {
            isCommit=0;
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?errcode="+data.error_code;
            } else {
                isCommit=0;
                //$(obj).removeAttr("disabled");
                if(data.status==0){
                    //showMessage("订单生成失败");
                    showMessage(data.message);
                }
                if(data.status==1){
                    window.top.location.href = "/wechatpay/towechatpay.html";
                }
                if(data.status==2){
                    window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==3){
                    window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==4){
                    window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==5){
                    window.top.location.href =data.url;
                }
                if(data.status==6){
                    var orderno=data.orderno;
                    window.top.location.href = "/paysuccess.html?orderno="+orderno;
                }
            }

        });
    }

    //地址修改
    $('body').on("click",".address-edit",function(){
        var obj=$(this).parent();
        var addrId=obj.attr("addrid");
        var provinceid=obj.attr("provinceid");
        var cityid=obj.attr("cityid");
        var areaid=obj.attr("areaid");

        var addressType=obj.find(".address-type").attr("addresstype");
        var name=obj.find(".address-sec span").first().text();
        var phone=obj.find(".address-sec span").next().text();
        var address=obj.find(".address-det").text();
        var a=$(".new-address");
        $("#newaddressid").val(addrId);
        $(a).find(".new-head span").removeClass("on");
        $(a).find(".new-head span[addresstype='"+addressType+"']").addClass("on");

        $("#ProvinceIdValue").val(provinceid);
        $("#CityIdValue").val(cityid);
        $("#AreaIdValue").val(areaid);
        fillProvince($("#ProvinceIdValue").val());
        fillCity($("#CityIdValue").val());
        fillArea($("#AreaIdValue").val());

        $("#newaddress").html(address);
        $("#newname").val(name);
        $("#newphone").val(phone);

        $(".new-address-btn").click();
    });
    // 当输入详细地址时，输入法遮挡，地址上移
    var $newAddress = $(".new-address #newaddress");
    $newAddress.on("focus",function(){
        $(".new-address").addClass("up");
    });
    $newAddress.on("blur",function(){
        $(".new-address").removeClass("up");
    });
    // 选择地址切换
    $('body').on("click",".address-main .dyclick",function(){
        $(this).addClass('on').siblings().removeClass('on');
    });
    // 家，公司，朋友tab切换
    $('.new-head span').click(function(){
        $(this).addClass('on').siblings().removeClass('on');
    });
    var click=0;
    //地推活动支付
    $("#btn-buy").click(function(){

        var cityId=$("#AllCityId").val();
        var cityName = $("#AllCityId").find("option:selected").text();
        var bindcode=GetQueryString("bindcode");
        var sign=GetQueryString("s");
        var source=GetQueryString("source");
        var level=GetQueryString("level");
        var types=GetQueryString("types");
        if(level==""){
            level="1";
        }
        if(types==""){
            types="1";
        }
        var name="";
        if(cityId=="-1"){
            alert("请选择您所在的城市");
            return false;
        }
        if(click==1){
            return false;
        }
        click=1;
        var page="/active/act_fit/formpay";
        var referrer = document.referrer;
        invokeApi("mallactive/insertactivepv",{"page":page,"bindcode":bindcode,"source":source,"level":level,"types":types,"referrer":referrer},"",function(ret){
        });
        //var active=JSON.stringify(activeInfo(bindcode,name,cityId,cityName,from));
        invokeApi("mallactive/fittopay",{"bindCode":bindcode,"name":name,"cityId":cityId,"cityName":cityName,"sourceUserId":source,"s":sign},"",function(ret){

            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?err="+data.error_code+"&"+data.error_msg;
            } else {
                if(data.status==0){
                    //showMessage("订单生成失败");
                    click=0;
                    alert(data.message);
                }

                var returnUrl=encodeURIComponent("http://wechat.lechun.cc/active/act_fit/fit_invite.html?bindcode="+bindcode+"&source="+source+"&level="+level+"&types="+types);
                if(data.status==1){
                    //window.top.location.href = "/wechatpay/towechatpay.html?return="+returnUrl;
                }
                if(data.status==2){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==3){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==4){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==5){
                    window.top.location.href = data.url+"&return="+returnUrl;
                }
                if(data.status==6){
                    window.top.location.href = "http://wechat.lechun.cc/active/act_fit/fit_invite.html?bindcode="+bindcode+"&source="+source+"&level="+level+"&types="+types;
                }
                click=0;
            }
        });

        // /active/act_fit/fit_invite.html
    });

    //放弃优惠
    $("#btn_unbuy").click(function(e){
        var page="/active/act_fit/unpay";
        var referrer = document.referrer;
        var bindcode=GetQueryString("bindcode");
        var sign=GetQueryString("s");
        var source=GetQueryString("source");
        var level=GetQueryString("level");
        var types=GetQueryString("types");
        if(level==""){
            level="1";
        }
        if(types==""){
            types="1";
        }
        invokeApi("mallactive/insertactivepv",{"page":page,"bindcode":bindcode,"source":source,"level":level,"types":types,"referrer":referrer},"",function(ret){
            window.location.href="/";
        });
    });
    //activeInfo   bindCode,name,cityId,cityName,sourceUserId
    function activeInfo(bindCode,name,cityId,cityName,from){
        var o = {
            bindCode : bindCode,
            name : name,
            cityId : cityId,
            cityName:cityName,
            sourceUserId:from
        };
        return o;
    }
    //兑奖
    var isClick=0;
    $("#btn-prize").click(function(){
        if(!confirm("确定兑奖吗？只有一次兑奖机会噢~")) {
            return false;
        }
        if(isClick==1){
            alert("请勿重复点击");
            return false;
        }
        isClick=1;
        var bindcode=GetQueryString("bindcode");
        invokeApi("mallactive/getactiveprize",{"bindcode":bindcode},"",function(ret) {
            var data = eval(ret);
            isClick=0;
            if (data.error_code != null) {
                window.top.location.href = "/404.html?err=" + data.error_code + "&" + data.error_msg;
            } else {
                if(data.status==1){
                    alert("兑奖成功");
                    window.location.href="/active/act_fit/fit_medal.html";
                }else{
                    alert("兑奖失败："+data.message);
                }
            }
        });
    });
//地推活动支付
    $("#btn-5yuanbuy").click(function(){

        var cityId=110100;
        var cityName = "";
        var bindcode=GetQueryString("bindcode");
        var sign=GetQueryString("s");
        var source=GetQueryString("source");
        var level=GetQueryString("level");
        var types=GetQueryString("types");
        if(level==""){
            level="1";
        }
        if(types==""){
            types="1";
        }
        var name="";
        if(cityId=="-1"){
            alert("请选择您所在的城市");
            return false;
        }
        if(click==1){
            return false;
        }
        click=1;
        var page="/active/act_fit/formpay";
        var referrer = document.referrer;
        invokeApi("mallactive/insertactivepv",{"page":page,"bindcode":bindcode,"source":source,"level":level,"types":types,"referrer":referrer},"",function(ret){
        });
        //var active=JSON.stringify(activeInfo(bindcode,name,cityId,cityName,from));
        invokeApi("mallactive/fittopay",{"bindCode":bindcode,"name":name,"cityId":cityId,"cityName":cityName,"sourceUserId":source,"s":sign},"",function(ret){

            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?err="+data.error_code+"&"+data.error_msg;
            } else {
                if(data.status==0){
                    //showMessage("订单生成失败");
                    click=0;
                    var href=$("#message_pay a").attr("href");
                    if(href!="")
                        $("#message_pay").addClass("on");
                    else{
                        alert(dta.message);
                    }
                }

                var returnUrl=encodeURI("/active/act_fit/fit_invite.html?bindcode="+bindcode);
                if(data.status==1){
                    //window.top.location.href = "/wechatpay/towechatpay.html?return="+returnUrl;
                }
                if(data.status==2){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==3){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==4){
                    //window.top.location.href = "/account/order_list.html?status=1";
                }
                if(data.status==5){
                    window.top.location.href =data.url+"&return="+returnUrl;
                }
                if(data.status==6){
                    window.top.location.href = "/active/act_fit/fit_invite.html?bindcode="+bindcode;
                }
                click=0;
            }
        });

        // /active/act_fit/fit_invite.html
    });
//fit活动首页首屏应用判断设备尺寸
    var screenH = window.screen.height;
    $(".js-top-box").css('height',screenH);
//12问活动
    $('body').on('click',".ask-list .ask-card",function(){
        var questionId=$(".info h1 strong").attr("questionId");
        var answerId=$(this).attr("answerid");
        var seq=$("#axis_num").text();
        $("#answerok span").text("");
        $("#answerokinfo").text("");
        $("#answerok i").removeClass("icon-err").removeClass("icon-ok");
        $("#btn-ask-ok").hide();
        $("#btn-ask-err").hide();
        $("#btn-ask-cash").hide();
        invokeApi("mallactive/commitanswer",{"questionid":questionId,"answerid":answerId},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?err="+data.error_code+"&"+data.error_msg;
            } else {
                $("#answerokinfo").text(data.message)
                if(data.status==1||data.status==2){
                    $("#answerok span").text("回答正确");
                    $("#answerok i").removeClass("icon-err").addClass("icon-ok");
                    if(parseInt(seq)==12){
                        //window.location.href="/active/act_12ask/12ask_final.html";
                        $(".tip-last").show();
                        $("#btn-ask-cash").show();
                    }else {
                        $("#btn-ask-ok").show();
                    }

                }else{
                    $("#answerok span").text("啊哦错啦");
                    $("#answerok i").removeClass("icon-ok").addClass("icon-err");
                    $("#btn-ask-err").show();
                }
            }
        });
        $('#alert_ask').addClass('on');
        $("html,body").addClass("hidden");
    });
    var hostUrlAskApi = "";
    $('#btn-ask-ok').on('click',function(){
        initQuestion();
        $(".alert-common").removeClass("on");
        $("html,body").removeClass("hidden");
    });

});
function initQuestion(){
    invokeApi("mallactive/getnextqeustion",{},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html?err="+data.error_code+"&"+data.error_msg;
        } else {
            if(data.status==1){
                $(".info h1 span").text(data.QUESTION);
                $(".info h1 strong").html(data.SEQUENCE);
                $(".info h1 strong").attr("questionId",data.ID);
                $("#axis_num").text(data.SEQUENCE);
                var answer=data.answer;
                $(".cs-on").css("width",((data.SEQUENCE-1)/11*100)+"%");
                $(".cur-sign").css("left",((data.SEQUENCE-1)/11*100)+"%");
                $(".ask-list").children().remove();
                for (var i = 0; i < data.answer.length; i++) {
                    var a=eval(data.answer[i]);
                    $(".ask-list").append("<li class=\"dyclick clearfix ask-card\" answerId='"+ a.ANSWER_ID+"'> <i class=\"icon-abc\">"+ a.ORDERS+"</i><div class=\"card\">" +
                        a.ANSWER+"</div></li>")
                }

            }
            if(data.status==2){
                window.location.href="/active/act_12ask/12ask_final.html";
            }
            if(data.status==0){
                showMessage("活动暂未开始");
            }
        }
    });
}