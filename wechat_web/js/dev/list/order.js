document.write("<script src='/js/dev/Common.js?v=1'></script>" );
$(document).ready(function() {
    var today;
    var  deliverType=GetQueryString("type");
    var count=1;
    if(deliverType=="2")
        count=4;
    if(deliverType=="3")
        count=3;
    var groupId=GetQueryString("groupId");
    var quantity=GetQueryString("quantity");
    var api="gocreateorderfromcart";
    if(groupId!=""&&quantity!=""){
        api="gocreateorderdirectfromgroup";
    }
    if(groupId=="3083280275052539250"){
        $(".coupon-btn span").html("爱情不打折");
    }

    //初始化
    $("#cashId").val("");
    invokeApi("mallorder/"+api,{"count":count,"groupId":groupId,"quantity":quantity},Math.random(),function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html?"+data.error_code;
        } else {
            if(data.status=="0"){

                showMessage(data.message,"/");
                setTimeout(function(){
                    window.location.href="/";
                },2000);
                return;
            }
            //地址
            var address=eval(data.address);
            // var addr_selected = JSON.parse(window.sessionStorage.getItem("selectedADDR"));
            // console.log(addr_selected);
            // if(addr_selected){
            //     address = addr_selected;
            // }
            initDefaultAddress(address);
            //配送信息
            var deliver=eval(data.deliver);
            var fee=0;
            if(deliver!=null)
                fee=deliver.freight;
            initDefaultDeliver(deliver,data.inventory);
            $("#delivermode").val("");
            $(".pay-date").first().html("请选择您的配送模式");
            $(".model-three li").removeClass("on");
            //商品信息
            var productList=eval(data.productlist);
            var quantity=0;
            for (var i = 0; i < productList.length; i++) {
                var product = eval(productList[i]);
                quantity+=product.quantity;
                $(".order-list").append("<li>"+
                    "<input type='hidden' id='p"+product.productId+"' value='"+product.productId+"'>"+
                    "<p class=\"clearfix\">"+
                    "<em>"+product.productName+"</em>"+
                    "<strong>X "+product.quantity+"</strong>"+
                    "<i class=\"price\">¥"+product.factPrice*product.quantity+"</i>"+
                    "</p>"+
                    "<span>￥"+product.factPrice+"/"+product.unit+"</span>"+
                    "</li>");
            }

            //优惠券
            //var cash=eval(data.defaultcashticket);
            var cashlist=eval(data.cashticketlist);
            $("#giftbalance1").text(data.giftBalance);
            if(parseFloat($("#giftbalance1").text())>0){
                $("#giftpay").addClass("on");
            }
            $(".order-list").attr("amount", data.totalAmount);
            $(".order-list").attr("fee", fee);
            $(".order-list").attr("quantity", quantity);
            //合计
            updateAmount();
            if ($("#address").val() == 0) {
                $(".pay-contact").click();
            }
        }
    });

    //初始化优惠券
    function initCashTicket(cashlist){
        var cashAmount=0;
        if(groupId=="3083280275052539250"){
            $(".order-list").attr("cashAmount","0");
           return;
        }
        if(cashlist!=null&&cashlist.length>0){
            $(".coupon-list").children().remove();
            for(var i=0;i<cashlist.length;i++) {
                var cash = cashlist[i];
                if(i==0){//默认
                    if(cash!=null)
                        cashAmount=cash.enableticketamount;
                    $(".coupon-btn span em").html(cashAmount);
                    $("#cashId").val(cash.TICKET_NO);
                    //
                    $(".pay-wechat dl dd em").html(cashAmount);
                    $(".total-table .total-discount em").html(cashAmount);
                }

                $(".coupon-list").append("<li>"+
                    "<section class=\"img\">"+
                    "<a class=\"use-rules\" href=\"\" title=\"\">使用细则</a>"+
                    "<img src=\"images/coupon1.jpg\" alt=\"\" title=\"\">"+
                    "</section>"+
                    "<section class=\"info\">"+
                    "<strong>￥"+cash.TICKET_AMOUNT+"</strong>"+
                    "<input type='hidden' name='cashlist' value='"+cash.TICKET_NO+"' amount='"+cash.TICKET_AMOUNT+"' enamount='"+cash.enableticketamount+"'>"+
                    "<dl class=\"info-right\">"+
                    "<dt><a href=\"#\" class='dyclick' title=\"\">立即使用</a></dt>"+
                    "<dd>"+
                    "<span>"+cash.times+"</span>"+
                    "<p>"+cash.TICKET_NAME+"</p>"+
                    "<p>"+cash.REMARK+"</p>"+
                    "</dd>"+
                    "</dl>"+
                    "</section>"+
                    "</li>");
            }
        }else{
            //优惠券弹窗无券状态
            $(".coupon-alert .coupon-box .coupon-list").html('<img src="/images/coupon-none.png" alt=""/>'+
                '<p>啊哦，还没有优惠券噢，赶紧去抢 。</p>');
        }

        $(".order-list").attr("cashAmount",cashAmount);
        updateAmount();
    }
    //选择收货地址确认
    $(".address .submit").on("click",function() {
        var obj = $(this).parent().siblings(".address-main").find("ul .on");
        var a = addressConfirm(this);
        //console.log(a);
        if (a != undefined) {
            invokeApi("mallconsignee/updateAddressLastTime", a, "", function (ret) {
                initDefaultAddress(a);
                initDefaultDeliverAddressChange(obj.attr("provinceid"), obj.attr("cityid"), obj.attr("areaid"), a.ADDRESS);
            });
        }
    });
    //初始化默认地址
    function initDefaultAddress(address){

        if(address!=null && address.ADDR_ID!=""){
            $(".pay-contact dl dt span").first().html(address.CONSIGNEE_NAME);
            $(".pay-contact dl dt span").next().html(address.CONSIGNEE_PHONE);
            $(".pay-contact dl dd em").text(address.ADDRESS+' '+address.HOUSENUM);
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

                $("#newaddress").html(address.ADDRESS+' '+address.HOUSENUM);
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
    //初始化默认配送信息
    window.initDefaultDeliver = function(deliver,inventory){
        $(".model-three").children().removeClass("on");
        $(".model-three .l1").addClass("on");
        $(".data-two li").remove();
        $("select[name='sel_date']").children().remove();
        $("#sel_date").empty();
        if(groupId=="3083280275052539250"){
            $(".l2,.l3").hide();
            //$(".data-show li").first().addClass("valentine");
        }
        var fee=0;
        if(deliver!=null){
            $(".pay-date").first().html(deliver.showDate);
            $(".model-con.on h3 span em").html(deliver.showToday);
            $(".data-first-time").attr("showdate",deliver.showDate);
            $(".data-first-time").attr("date",deliver.delviverDate);
            $(".data-first-time").parent().siblings("h3").html("第一次送 /"+deliver.showDate+"：");
            fee=deliver.freight;
            $("#delivermode").val(deliver.delviverDate+"|1|1");
            today=deliver.delviverDate;
            var Dates=deliver.dates;
            for ( var p in Dates ){ // 方法

                var use=Dates[p];

                if ( typeof ( Dates [ p ]) == " function " ){ Dates [ p ]() ;
                } else {
                    var date= p.split('|')[0];
                    var dates=p.split('|')[1];

                    var disabled="";
                    if(use=="0"){
                        disabled='disabled';
                    }
                    if(date==deliver.delviverDate){
                        $(".data-two").append("<li class='dyclick on "+disabled+"' use='"+use+"' date='"+date+"'>"+dates+"</li>");
                    }else{
                        $(".data-two").append("<li class='dyclick "+disabled+"' use='"+use+"' date='"+date+"'>"+dates+"</li>");
                    }
                    if(use=="1")
                        $("select[name='sel_date']").append("<option value='"+date+"'>"+dates+"</option>");

                }
            } // 最后显示所有的属性
            $(".pay-date").first().attr("enabled","1");
            updateAmount();
            getDefaultDeliver(deliverType);
        }else{
            $(".data-two").append("<li class=\"address-none\"><img src='/images/address-none.png'><p>阿哦，该地址还未开通，</p><p>点击确认反馈给我们～</p></li>");
            $(".pay-date").first().attr("enabled","0");
            if(inventory!=undefined&&inventory==0){
                $(".pay-date").first().html("暂无库存");
            }else {
                $(".pay-date").first().html("您的地址没有匹配的配送信息");
            }
        }
        $(".order-list").attr("fee",fee);


    }
    function initDefaultDeliverAddressChange(provinceId,cityId,areaId,address){
        invokeApi("malldeliver/getdefaultdeliver",{"provinceId":provinceId,"cityId":cityId,"areaId":areaId,"address":address,"groupId":groupId,"quantity":quantity},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                initDefaultDeliver(data.deliver);
                $("#delivermode").val("");
                $(".pay-date").first().html("请选择您的配送模式");
                $(".model-three li").removeClass("on");
            }
        });
    }

    /* 当输入详细地址时，输入法遮挡，地址上移
    var $newAddress = $(".new-address #newaddress");
    $newAddress.on("focus",function(){
        $(".new-address").addClass("up");
    });
    $newAddress.on("blur",function(){
        $(".new-address").removeClass("up");
    });
    */

    //得到默认配送方式
    function getDefaultDeliver(type){
        if(type!="1" && type!="2" && type!="3")
            return ;

        $(".model-select-box .model-tit li").removeClass("on");
        $(".model-select-box ul li.l"+type).addClass("on").click();
        //var count=1;
        //if(type=="2")
        //    count=4;
        //if(type=="3")
        //    count=3;
        //updateAmount(count);
        $(".model-btn .submit").click();

    }

    //选择配送日期确认
    $(".model-btn .submit").on('click',function() {
        var mod=$(".model-select-con .model-con.on");
        if($(".pay-date").first().attr("enabled")=="0"){
            invokeApi("malldeliver/saveundeliverecord",{"addressid":$("#address").val()},"",function(ret){
                $(".close-alert, .back, .close").click();
            });
            $(".close-alert, .back, .close").click();
        }
        var count=1;
        if(mod.attr("id")=="l1") {
            count=1;
            var date=$(mod).find(".data-show .on").attr("date");
            $("#delivermode").val(date+"|1|"+count);
            $("#delivermode").siblings("dl").find("dd").html($(mod).find(".data-show .on").html());
            $(".model-three").children().removeClass("on");
            $(".model-three .l1").addClass("on");

        }
        if(mod.attr("id")=="l2") {
            var date=$(mod).find(".data-first-time").attr("date");
            count=$(mod).find(".data-show .on").attr("count");
            $("#delivermode").val(date+"|7|"+count);
            var week=$(mod).find(".data-show .on").html();
            if($(mod).find(".data-show .on").className="custom")
            {
                week=$(mod).find(".data-show .on").attr("count")+"周";
            }
            $("#delivermode").siblings("dl").find("dd").html($(mod).find(".data-first-time").attr("showdate")+"开始，连续配送"+week);
            $(".model-three").children().removeClass("on");
            $(".model-three .l2").addClass("on");
        }
        if(mod.attr("id")=="l3") {
            var date=$(mod).find(".data-first-time").attr("date");
            count=$(mod).find("#pscount .data-first .data-distribution").val();
            var pv=$(mod).find("#pspinlv .data-first .data-distribution").val();

            $("#delivermode").val(date+"|"+pv+"|"+count);
            $("#delivermode").siblings("dl").find("dd").html($(mod).find(".data-first-time").attr("showdate")+"开始，每隔"+pv+"天，连续配送"+count+"次");
            $(".model-three").children().removeClass("on");
            $(".model-three .l3").addClass("on");
        }
        //$("#imgdelivercount").attr("src","'/images/give"+count+".png'");
        //$("#imgdelivercount").attr("alt","'配送"+count+"次'");
        $("#imgdelivercount .num").text(count);

        //重新加载优惠券
        invokeApi("mallorder/selectenablecashticket",{"count":count,"groupId":groupId,"quantity":quantity},Math.random(),function(ret){
            var data = eval(ret);
            initCashTicket(data);
        });
        //重新生成金额和数量
        updateAmount(count);


        $(".close-alert, .back, .close").click();
    });
    //加减日期
    $(".reduce-date").on("click", function (ret) {
        var obj=$(this).siblings(".data-first-time");
        var date = $(obj).attr("date");
        invokeApi("malldeliver/getnextdate", {"deliverdate": date,"date":today, "isadd": 0}, "", function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                var date=data.date;
                $(obj).attr("date", date.split("|")[0]);
                $(obj).attr("showdate",date.split("|")[1]);
                $(obj).parent().siblings("h3").html("第一次送 /"+date.split("|")[1]+"：");
                $(obj).find("select[name='sel_date']").val(date.split("|")[0]);
            }
        });
    });
    $(".add-date").on("click",function (ret) {
        var obj=$(this).siblings(".data-first-time");
        var date = $(obj).attr("date");
        invokeApi("malldeliver/getnextdate", {"deliverdate": date,"date":today, "isadd": 1}, "", function (ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                var date=data.date;
                $(obj).attr("date", date.split("|")[0]);
                $(obj).attr("showdate",date.split("|")[1]);
                $(obj).parent().siblings("h3").html("第一次送 /"+date.split("|")[1]+"：");
                $(obj).find("select[name='sel_date']").val(date.split("|")[0]);
            }
        });
    });
    //自定义配送
    $("#definecount").on("focus",function (){

        $(this).parent().attr("count","");
        $(this).val("");
    });
    $("#definecount").on("keyup",function (){
        var num=$(this).val();
        //$(this).siblings("span").html(num+"周");
        $(this).parent().parent().attr("count",num);
        $(this).parent().parent().parent().siblings("h3").find("em").html(num);
        updateAmount(num);
    });
    $("#definecount").on("blur",function(){
        $(this).keyup();
    });
    //优惠券立即使用
    $("body").on("click",".coupon-list .dyclick",function(){
        var cash=$(this).parent().parent().siblings("input[name=cashlist]");
        var cashno=$(cash).val();
        var cashAmount=$(cash).attr("enamount");
        $(".coupon-btn span em").html(cashAmount);
        $("#cashId").val(cashno);
        $(".order-list").attr("cashAmount",cashAmount);
        updateAmount();
        $(".close-alert, .back, .close").click();
    });



    //提交订单去支付
    var isCommit=0;
    $(".wechat-btn").on("click",function(){
        if(isCommit==1){
            showMessage("请勿重复提交");
            return false;
        }

        var obj=$(this);
        //$(obj).attr("disabled", true);

        var addrId=$("#address").val();
        var deliver=$("#delivermode").val();
        var cashno=$("#cashId").val();
        if(addrId==""){
            showMessage("请选择收货地址");
            isCommit=0;
            return false;
        }

        if(deliver==""||deliver.split('|')[0]=="undefined"){
            //showMessage("请选择配送模式");
            $(".pay-model").click();
            isCommit=0;
            return false;
        }
        isCommit=1;
        var groupId=GetQueryString("groupId");
        var quantity=GetQueryString("quantity");
        var isGift=$("#giftpay").hasClass("on")?1:0;
        var bindCode=GetQueryString("bindCode");
        invokeApi("mallorder/wechattopay",{"addrId":addrId,"deliver":deliver,"cashno":cashno,"groupId":groupId,"quantity":quantity,"isgift":isGift,"bindCode":bindCode},Math.random(), function (ret) {
            isCommit=0;
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html?err="+data.error_code;
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
    });
    //更新金额信息
    function updateAmount(count,id){
        //合计
        var quantity=$(".order-list").attr("quantity");
        var amount=parseFloat($(".order-list").attr("amount"));
        var cashAmount=parseFloat($(".order-list").attr("cashAmount"));

        var fee=parseFloat($(".order-list").attr("fee"));
        var giftBalance=0;
        if($("#giftpay").hasClass("on")){
            giftBalance=parseFloat($("#giftbalance1").text());
        }

        if(quantity==undefined || amount==undefined||cashAmount==undefined||fee==undefined||giftBalance==undefined)
            return ;
        if(isNaN(quantity)|| isNaN(amount)||isNaN(fee)||isNaN(giftBalance)||isNaN(cashAmount))
            return ;
        if(count!=undefined) {
            quantity = quantity * parseInt(count);
            amount = parseInt(count) * amount;
        }else{
            var mod=$(".model-select-con .model-con.on");
            if(mod.attr("id")=="l1"){
                count=1;
            }
            if(mod.attr("id")=="l2"){
                count=$(mod).find(".data-show .on").attr("count");
            }
            if(mod.attr("id")=="l3"){
                count=$(mod).find("#pscount .data-first .data-distribution").val();
            }
            if(count!=0){
                quantity = quantity * parseInt(count);
                amount = parseInt(count) * amount;
            }else{
                return;
            }
        }
        var totalAmount=parseFloat(amount)-parseFloat(cashAmount)+parseFloat(fee)-giftBalance;
        totalAmount=totalAmount<0?0:totalAmount;
        if(id!=undefined&&id != "giftpay") {
            if (id == "wechatpay") {
                if ($("#" + id).hasClass("on")) {
                    if (totalAmount ==0 ||giftBalance==0) {
                        $("#giftpay").removeClass("on");
                        giftBalance=0;
                        $("#giftbalanceInfo").html("(使用:¥0.00)");
                        totalAmount = parseFloat(amount) - parseFloat(cashAmount) + parseFloat(fee);
                        totalAmount = totalAmount < 0 ? 0 : totalAmount;
                    }
                }else{
                    giftBalance=parseFloat($("#giftbalance1").text());
                    totalAmount = parseFloat(amount) - parseFloat(cashAmount) + parseFloat(fee)-giftBalance;
                    totalAmount = totalAmount < 0 ? 0 : totalAmount;
                    if(totalAmount>0){
                        $("#wechatpay").addClass("on");
                    }

                    if(giftBalance>0){
                        if (parseFloat(amount) - parseFloat(cashAmount) + parseFloat(fee) > 0) {
                            $("#giftpay").addClass("on");
                            $("#giftbalanceInfo").html("(使用:¥" + (parseFloat(amount) - totalAmount - parseFloat(cashAmount) + parseFloat(fee)).toFixed(2) + ")");
                        }
                    }else{
                        $("#wechatpay").addClass("on");
                    }
                }
            }
        }else {
            if (totalAmount > 0) {

                $("#wechatpay").addClass("on");
            } else {
                $("#wechatpay").removeClass("on");
            }
            if (giftBalance <= 0) {
                $("#giftpay").removeClass("on");
                $("#giftbalanceInfo").html("");
            } else {
                if (parseFloat(amount) - parseFloat(cashAmount) + parseFloat(fee) > 0) {
                    $("#giftpay").addClass("on");
                    $("#giftbalanceInfo").html("(使用:¥" + (parseFloat(amount) - totalAmount - parseFloat(cashAmount) + parseFloat(fee)).toFixed(2) + ")");
                }
            }
        }
        $(".pay-wechat dl dt span em").html(totalAmount.toFixed(2));
        $(".pay-wechat dl dd em").html((parseFloat(amount)-totalAmount+parseFloat(fee)).toFixed(2));
        $(".total-table .total-num span em").html(totalAmount.toFixed(2));
        $(".total-table .total-discount em").html(cashAmount.toFixed(2));
        $(".order-total em").html(quantity);
        $(".order-other .price em").html(fee.toFixed(2));
        $(".order-total span em").html(totalAmount.toFixed(2));
        $(".total-table .total-num span em").html(totalAmount.toFixed(2));
    }
    //一周已送，自由定制 选择日期
    $("select[name='sel_date']").on("change",function(){
        $(this).parent().attr("date",$(this).val());
        $(this).parent().attr("showdate",$(this).find("option:selected").text());
        $(this).parent().parent().siblings("h3").html("第一次送 /"+$(this).find("option:selected").text()+"：");
    });
    //一周已送，周点击
    $(".data-three li").on("click",function(){
        var count=$(this).attr("count");
        if(count=="")
            count=0;
        $(this).parent().siblings("h3").find("em").html(count);
        updateAmount(count);
    });
    // 加减法
    var num;
    $(".reduce-num").on("click",function(){
        num = $(this).next().val();
        if (num >3) {
            num--;

            $(this).siblings(".data-distribution").val(num);
            $(this).parent().prev().children("em").html(num);
            var count=$("#pscount .data-first .data-distribution").val();
            updateAmount(count);
        };
    })
    $(".add-num").on("click",function(){
        num = $(this).prev().val();
        num++;
        $(this).siblings(".data-distribution").val(num);
        $(this).parent().prev().children("em").html(num);
        var count=$("#pscount .data-first .data-distribution").val();
        updateAmount(count);
    })
    $("#l3count").change(function(){
        var num=$(this).val();
        $(this).siblings(".data-distribution").val(num);
        $(this).parent().prev().children("em").html(num);
        var count=$("#pscount .data-first .data-distribution").val();
        updateAmount(count);
    });
    $("#l3period").change(function(){
        var num=$(this).val();
        $(this).siblings(".data-distribution").val(num);
        $(this).parent().prev().children("em").html(num);
        var count=$("#pscount .data-first .data-distribution").val();
        updateAmount(count);
    });

    // 关闭遮罩
    $(".close-alert, .back, .close").on('click',function(){
        if ($("#address").val() == 0) {
            return ;
        }
        $(".alert-bg").hide();
        $(this).closest(".alert").removeClass("on");
        $("html,body").removeClass("hidden")
        return false;
    });

    // 点击配送模式弹出配送选择
    $(".pay-model").on('click',function(){
        $(".alert-bg").show();
        $(".model-alert").addClass("on");
        $("html,body").addClass("hidden");
        return false;
    });

    // 点击弹出优惠券
    $(".coupon-btn").on('click',function(){
        if(groupId=="3083280275052539250"){
            return;
        }
        $(".alert-bg").show();
        $(".coupon-alert").addClass("on");
        $("html,body").addClass("hidden");
        return false;
    });

    // 弹出层切换配送模式
    $('.model-select-box .model-tit li').click(function(){
        if($(".pay-date").first().attr("enabled")=="0")
            return;
        var c=$(this).attr("class");
        $(this).addClass('on').siblings().removeClass('on');
        $('.model-select-con .model-con').eq($(this).index()).addClass('on').siblings().removeClass('on');


        if(c=="l1"){
            updateAmount(1);
        }
        if(c=="l2"){
            var obj=$(".model-select-con #"+c+" .data-three .on");
            $(obj).click();
            //$(this).parent().siblings("h3").find("em").html(count);
            //updateAmount(count);
        }
        if(c=="l3"){
            var count=$(".model-select-con #"+c+" #pscount h3 em").text();
            updateAmount(count);
        }
    });

    // 弹出层选择配送日期
    $('body').on("click",".data-show .dyclick",function(){
        if($(this).attr("use")=="1") {
            $(this).addClass('on').siblings().removeClass('on');
        }
    });




    //兑换
    $(".btn-exchange").on("click",function(){
        var cashno=$(".coupon-code").val();
        if(cashno.trim()==''){
            showMessage("请输入优惠券号");
            return false;
        }
        var obj=$(this);
        $(obj).attr("disabled", true);
        invokeApi("mallcashticket/activecashticket",{"cashticketno":cashno},Math.random(),function(ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "404.html";
            } else {
                $(obj).removeAttr("disabled");
                if(data.state==1){
                    showMessage("激活成功");
                    window.location.reload();
                }
                else{
                    showMessage("激活失败");
                }
            }
        });
    });
    $("#return").on("click",function(){
        var s=$("#delivermode").val();
       updateAmount(s.split("|")[2]);
    });
    $("body").on("click",".address-type,.address-sec,.address-det",function(){
        $(this).parent().addClass('on').siblings().removeClass('on');
        $(".address .submit").click();
    });
    //支付方式自切换
    $('body').on("touchend",".topay-way-list .topay-way",function(){
        var id=$(this).attr("id");
        $(this).toggleClass('on');
        var s=$("#delivermode").val();
        updateAmount(s.split("|")[2],id);


    });
});




