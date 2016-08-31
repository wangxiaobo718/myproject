document.write("<script src='/js/dev/Common.js?v=1'></script>");
$(document).ready(function() {

    // 点击弹出地址
    $(".pay-contact").on('click',function() {
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
                        $(".address-main ul").append("<li class='clearfix dyclick' addrid='"+address.ADDR_ID+"' provinceid="+address.PROVINCE_ID+" cityid='"+address.CITY_ID+"' areaid='"+address.AREA_ID+"' >"+
                            "<p class=\"address-type\" addresstype='"+address.ADDRESS_TYPE+"'>"+getAddress_AddressType(address.ADDRESS_TYPE)+"</p>"+
                            "<p class=\"address-sec\"><span>"+address.CONSIGNEE_NAME+"</span>&ensp;/&ensp;<span>"+address.CONSIGNEE_PHONE+"</span></p>"+
                            "<p class=\"address-det\">"+address.ADDRESS+' '+address.HOUSENUM+"</p>"+
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
    });
    /* 当输入详细地址时，输入法遮挡，地址上移
     var $newAddress = $(".new-address #newaddress");
     $newAddress.on("focus",function(){
     $(".new-address").addClass("up");
     });
     $newAddress.on("blur",function(){
     $(".new-address").removeClass("up");
     });
     */
    //搜索地址
    $("#newaddress").on("click",function(){
        if($("#ProvinceId").val() == -1 || $("#CityId").val() == -1 || $("#AreaId").val() == -1){
            showMessage("请选择省市区");
            return;
        }
        $(".address-search").addClass("on");
        $("html,body").addClass("hidden");
        $("#address_search").focus();

    });
    //取消搜索地址
    $(".cancle").on("click",function(){
        $("#address_search").val('');
        $(".search-list").html('');
        $(".address-search").removeClass("on");
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
        var housenum=$("#housenum").val();
        var longitude=$("#longitude").val();
        var latitude=$("#latitude").val();
        var phone=$("#newphone").val();
        var apiUrl="mallconsignee/updateconsigneeaddress";
        if(addressid==""||addressid=="0") {
            apiUrl="mallconsignee/addconsigneeaddress";
        }
        if(provinceId=="-1" ||cityId=="-1"||areaId=="-1"){
            showMessage("请选择省市区.");
            return false;
        }
        if(address.indexOf("地表建筑名称") != -1){
            showMessage("请输入详细地址.");
            return false;
        }
        if(housenum==""){
            showMessage("请输入门牌号.");
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
            "housenum": housenum,
            "longitude":longitude,
            "latitude":latitude,
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
                    initDefaultAddress(data.address);
                    initDefaultDeliverAddressChange(provinceId, cityId, areaId,address);
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
                    $("#housenum").val("");
                    $("#longitude").val("");
                    $("#latitude").val("");
                    //$(".address .submit").click();
                    $(".close-alert, .back, .close").click();
                    //修改以订单页
                    if("undefined" != typeof initDefaultAddress1) {
                        initDefaultAddress1(data.address);
                    }
                    //首页地址及获取配送时间 on 20160804 by wanghanxiao start
                    if("undefined" != typeof showAddress){
                        showAddress();
                    }
                    //end                   
                }else {
                    showMessage(data.message);
                }
            }
        });
    });

    //选择收货地址确认
    // $(".address .submit").on("click",function(){

    // });
    //地址修改
    $('body').on("click",".address-edit",function(e){
        e.stopPropagation();
        var obj=$(this).parent();
        var addrId=obj.attr("addrid");
        var provinceid=obj.attr("provinceid");
        var cityid=obj.attr("cityid");
        var areaid=obj.attr("areaid");

        var addressType=obj.find(".address-type").attr("addresstype");
        var name=obj.find(".address-sec span").first().text();
        var phone=obj.find(".address-sec span").next().text();
        var address=obj.find(".address-det").text();
        var housenum=obj.find(".address-det").attr("housenum");
        var longitude = obj.find(".address-det").attr("longitude");
        var latitude = obj.find(".address-det").attr("latitude");
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
        $("#housenum").val(housenum);
        $("#longitude").val(longitude);
        $("#latitude").val(latitude);
        $("#newname").val(name);
        $("#newphone").val(phone);

        $(".new-address-btn").click();
        //首页地址及获取配送时间 on 20160804 by wanghanxiao start
        // if("undefined" != typeof showAddress){
        //     showAddress();
        // }
        //end
    });
    // 点击弹出新建地址
    $(".new-address-btn").on('click',function(){
        if($("#newaddress").html() == ""){
            $("#newaddress").html("<span>写字楼、小区、地表建筑名称</span>");
        }
        $(".alert-bg").show();
        $(".address-alert").removeClass("on");
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
    });
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
                        initDefaultAddress(data.address);
                        initDefaultDeliverAddressChange(data.address.PROVINCE_ID,data.address.CITY_ID,data.address.AREA_ID,data.address.ADDRESS);
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
                    $("#housenum").val("");
                    $("#longitude").val("");
                    $("#latitude").val("");
                    $(".close-alert, .back, .close").click();
                    //首页地址及获取配送时间 on 20160804 by wanghanxiao start
                    if("undefined" != typeof showAddress){
                        showAddress();
                    }
                    //end
                }
            }
        });
    });

    // 关闭遮罩
    $(".close-alert, .back, .close").on('click',function(){
        if ($("#address").val() == 0) {
            return ;
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
        $("#newaddressid").val("");
        $("#newname").val("");
        $("#newphone").val("");
        $("#housenum").val("");
        $("#longitude").val("");
        $("#latitude").val("");
        $(".alert-bg").hide();
        $(this).closest(".alert").removeClass("on");
        $("html,body").removeClass("hidden")
        return false;
    });

    // 选择地址切换
    $('body').on("click",".address-main li.dyclick",function(){
        $(this).addClass('on').siblings().removeClass('on');
        $(".address .submit").click();
    });

    // 家，公司，朋友tab切换
    $('.new-head span').click(function(){
        $(this).addClass('on').siblings().removeClass('on');
        //$('.new-form-box').eq($(this).index()).addClass('on').siblings().removeClass('on');
    });
    //初始化默认地址
    function initDefaultAddress(address){

        if(address!=null && address.ADDR_ID!=""){
            $(".pay-contact dl dt span").first().html(address.CONSIGNEE_NAME);
            $(".pay-contact dl dt span").next().html(address.CONSIGNEE_PHONE);
            $(".pay-contact dl dd em").text(address.ADDRESS);
            $(".pay-contact dl dd i").html(getAddress_AddressType(address.ADDRESS_TYPE));
            $(".pay-contact dl dd em,.pay-contact dl dd i").show();
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
    function initDefaultDeliverAddressChange(provinceId,cityId,areaId,address){
        invokeApi("malldeliver/getdefaultdeliver",{"provinceId":provinceId,"cityId":cityId,"areaId":areaId,"address":address},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                //首页地址及获取配送时间 on 20160804 by wanghanxiao start
                if($(".model-three .l1") != null){
                    window.initDefaultDeliver(data.deliver);
                }
                //end 
                $("#delivermode").val("");
                $(".pay-model dl dd").first().html("请选择您的配送模式");
                $(".model-three li").removeClass("on");
            }
        });
    }
});
function addressConfirm(o){
    var a;

    var obj=$(o).parent().siblings(".address-main").find("ul .on");

    var addrId=obj.attr("addrid");

    var defaultId=$("#address").val();
    //if(addrId!=defaultId) {
        var addressType = obj.find(".address-type").attr("addresstype");
        var name = obj.find(".address-sec span").first().text();
        var phone = obj.find(".address-sec span").next().text();
        var address = obj.find(".address-det").text();
        console.log(addressType+name+phone+address);
        a = {
            CONSIGNEE_NAME: name,
            CONSIGNEE_PHONE: phone,
            ADDRESS: address,
            ADDRESS_TYPE: addressType,
            ADDR_ID: addrId,
            HOUSENUM:""
        };

    //}
    $(".close-alert, .back, .close").click();
    return a;
}

$('#address_search').bind('input propertychange', function() { 
    var citys = getLngLat($("#CityId").find("option:selected").text(),initKey)
    var result = initKeyWordSearch($('#address_search').val(),initList);
});
function initKey(point){
    var result = initKeyWordSearch(point['lng'],point['lat'],$('#address_search').val(),initList);
}
var s_list = [];
function initList(data){
    s_list = [];
    var str = "";
    for (var i = 0; i < data.getCurrentNumPois(); i ++){
        var obj = {
            "province" : data.getPoi(i).province,
            "city" : data.getPoi(i).city,
            "title" : data.getPoi(i).title,
            "address" : data.getPoi(i).address,
            "lng" : data.getPoi(i).point.lng,
            "lat" : data.getPoi(i).point.lat,
            "city" : data.getPoi(i).city,
        };
        s_list.push(obj);
        str += '<li class="clearfix" idx=' + i + '><h4>' + data.getPoi(i).title + '</h4><p>' + data.getPoi(i).address + '</p></li>';
    }
    //str='<li class="clearfix" idx=-1><h4>' + $('#address_search').val() + '</h4><p></p></li>'+str;
    $(".search-list").html(str);
    $(".clearfix").on("click",function(){//选择地址
        if(s_list && s_list[$(this).attr("idx")] && s_list[$(this).attr("idx")]['lng']){
            $("#longitude").val(s_list[$(this).attr("idx")]['lng']);
            $("#latitude").val(s_list[$(this).attr("idx")]['lat']);
            getLocationByLatLng(s_list[$(this).attr("idx")]['lng'],s_list[$(this).attr("idx")]['lat'],s_list[$(this).attr("idx")]['address'] + " " + s_list[$(this).attr("idx")]['title'],initSelect);
        }
    });
}
function initSelect(curLoc,addr){
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
    if(_province != "" && _city != "" && (_area != "" || (curLoc['district'].indexOf("东莞市") > -1)||(curLoc['city'].indexOf("沈阳市") > -1)
                    ||curLoc['city'].indexOf("无锡市") > -1)){
        // $("#ProvinceId").val(_province);
        // $("#CityId").val(_city);
        // $("#AreaId").val(_area);
        fillProvince(_province);
        fillCity(_city);
        if(_area != ""){
            fillArea(_area);
        } else {
            $("#AreaId").val(-1);
        }
        //去掉XX省XX市XX区
        addr = addr.replace(curLoc['province'],"").replace(curLoc['city'],"").replace(curLoc['district'],"");
        $("#newaddress").html(addr);
        $("#address_search").val('');
        $(".search-list").html('');
        $(".address-search").removeClass("on");
    } else {
        showMessage("未开通此地区");
    }
}
//地址搜索列表容器高度
var screenH = window.screen.height;
var searchTitleH = $(".address-search .title").height();
var searchListH = screenH - searchTitleH -46;
$(".search-list").css('height',searchListH);

