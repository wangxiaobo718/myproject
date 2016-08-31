document.write("<script src='/js/dev/Common.js'></script>");
$(document).ready(function() {
    var orderno=GetQueryString("orderno");
    var ordermainno=GetQueryString("ordermainno");
    getOrderDetail(ordermainno,orderno);
    function getOrderDetail(ordermainno,orderno){
        var statusClass;
        invokeApi("mallorder/getcustomerorderdetail",{"orderMainNo":ordermainno,"orderNo":orderno},"",function(ret) {
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if(data!=null&&data.product!=undefined) {
                    if(data.isedit!=1){
                        showMessage("该订单不符合修改条件.");
                        return false;
                    }
                    var product = data.product;
                    $(".edit-order-list").html("");
                    for (var i = 0; i < product.length; i++) {
                        var p=product[i];
                        $(".edit-order-list").append('<li>' +
                            '<p class="clearfix">' +
                            '<em>' + p.PRODUCT_NAME + '</em><strong>X&nbsp;' + p.QUANTITY + '</strong><i class="price">¥' + p.TOTAL_PRICE + '</i>' +
                            '</p>' +
                            (data.ORDER_CLASS==1?'<span>￥' + p.UNIT_PRICE + '/盒</span>':'') +
                            '</li>');
                    }
                    $(".pay-contact h3 span").html(data.CONSIGNEE_NAME+" / <em>"+data.CONSIGNEE_PHONE+"</em>");
                    $(".address-box .adress").html(data.CONSIGNEE_ADDR);
                    $(".address-box .adress").attr("areaId",data.CONSIGNEE_AREAID);
                    $(".address-box i").html(getAddress_AddressType(data.ADDRESS_TYPE));
                    <!--配送时间-->
                    $(".delivery-time span em").html(data.DELIVER_DATE_SHOW);



                }
            }
        });
    }






    // 当输入详细地址时，输入法遮挡，地址上移
    //var $newAddress = $(".new-address #newaddress");
    //$newAddress.on("focus",function(){
    //    $(".new-address").addClass("up");
    //});
    //$newAddress.on("blur",function(){
    //    $(".new-address").removeClass("up");
    //});

    //选择配送日期确认
    $(".model-btn .submit").on('click',function() {
        var mod=$(".model-select-con .model-con.on");

        var count=1;
        if(mod.attr("id")=="l1") {
            count=1;
            var date=$(mod).find(".data-show .on").attr("date");
            invokeApi("mallorder/editOrderDeliverDate",{"orderno":orderno,"deliverdate":date},"",function(ret){
                var data=eval(ret);
                if (data.error_code != null) {
                    window.top.location.href = "/404.html";
                } else {
                    if(data.status==1){
                        $(".pay-time .delivery-time span em").html($(mod).find(".data-show .on").html());
                        $(".model-three").children().removeClass("on");
                        $(".model-three .l1").addClass("on");
                        $(".close-alert, .back, .close").click();
                    }else{
                        showMessage(data.message);

                    }
                }
            });
        }

        //$("#imgdelivercount").attr("src","'/images/give"+count+".png'");
        //$("#imgdelivercount").attr("alt","'配送"+count+"次'");


    });


    //选择收货地址确认
    $(".address .submit").on("click",function(){
        var a = addressConfirm(this);
        var addrId= a.ADDR_ID;
        //var defaultId=$("#address").val();
        //if(addrId!=defaultId) {
            initDefaultAddress1(a);
        //}
        console.log(a);
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
        invokeApi("mallorder/wechattopay",{"addrId":addrId,"deliver":deliver,"cashno":cashno,"groupId":groupId,"quantity":quantity},Math.random(), function (ret) {
            isCommit=0;
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
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
                    window.top.location.href = "/account/order_list.html";
                }
                if(data.status==3){
                    window.top.location.href = "/account/order_list.html";
                }
                if(data.status==4){
                    window.top.location.href = "/account/order_list.html";
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
    function updateAmount(count){
        //合计
        var quantity=$(".edit-order-list").attr("quantity");
        var amount=parseFloat($(".edit-order-list").attr("amount"));
        var cashAmount=parseFloat($(".edit-order-list").attr("cashAmount"));
        var fee=parseFloat($(".edit-order-list").attr("fee"));

        if(quantity==undefined || amount==undefined||cashAmount==undefined||fee==undefined)
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
            }
        }

        var totalAmount=parseFloat(amount)-parseFloat(cashAmount)+parseFloat(fee);
        totalAmount=totalAmount<0?0:totalAmount;
        $(".pay-wechat dl dt span em").html(totalAmount.toFixed(2));
        $(".pay-wechat dl dd em").html(cashAmount.toFixed(2));
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



    // 关闭遮罩
    $(".close-alert, .back, .close").on('click',function(){
        //if ($("#address").val() == 0) {
        //    return ;
        //}
        $(".alert-bg").hide();
        $(this).closest(".alert").removeClass("on");
        $("html,body").removeClass("hidden")
        return false;
    });

    // 点击配送模式弹出配送选择
    $(".pay-time").on('click',function(){
        var addr=$(".address-box .adress").html();
        var areaId=$(".address-box .adress").attr("areaId");
        initDefaultDeliverAddressChange1(0,0,areaId,addr,orderno);
        $(".alert-bg").show();
        $(".model-alert").addClass("on");
        $("html,body").addClass("hidden");
        return false;
    });

    // 点击弹出订单购物车
    $("#edit-product").on('click',function(){
        invokeApi("mallorder/getOrderProduct",{"orderno":orderno},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                $(".set-list").children().remove();
                var count=0;
                var amount=0;
                for (var i = 0; i < data.length; i++) {
                    var shop = eval(data[i]);
                    count+=shop.QUANTITY;
                    amount+=parseFloat(shop.PRO_PRICE)*shop.QUANTITY;
                    var unedit="";
                    var undecrease="decrease";
                    if(shop.isedit==0){
                        undecrease="undecrease";
                        unedit="(不可更改)";
                    }
                    if(shop.QUANTITY==0){
                        undecrease="undecrease";
                    }
                    var unin="increase";
                    if((shop.LIMIT_BUY_COUNT!=0 && shop.QUANTITY>=shop.LIMIT_BUY_COUNT)||shop.isedit==0){
                        unin="unincrease";
                    }
                    $(".set-list").append('<li><p>'+shop.PRO_NAME+' ¥'+shop.PRO_PRICE+'<span>'+unedit+'</span></p><section class="opera"><i class="dyclick '+unin+'"></i>'+
                        '<input type="hidden" name="productid" id="p'+shop.PRO_ID+'" value="'+shop.PRO_ID+'" amount="'+shop.PRO_PRICE+'" cart="1" >'+
                        '<input class="num" type="text" readonly="readonly" limitcount="'+shop.LIMIT_BUY_COUNT+'" value="'+shop.QUANTITY+'">'+
                        '<i class="dyclick '+undecrease+'"></i></section></li>');
                }
                $(".set-cart em").html(count);
                $(".set-bottom em").html(amount.toFixed(2));

                $(".set-bottom span").html("原数量："+count+"<em>"+"原金额："+amount.toFixed(2)+"</em>");


                $(".set-list").attr("quantity",count);
                $(".set-list").attr("amount",amount.toFixed(2));
                $(".alert-bg").show();
                $(".settlement").addClass("on");
                $("html,body").addClass("hidden");
            }
        });

        return false;
    });



    // 弹出层选择配送日期
    $('body').on("click",".data-show .dyclick",function(){
        if($(this).attr("use")=="1") {
            $(this).addClass('on').siblings().removeClass('on');
        }
    });

    // 选择地址切换
    //$('body').on("click",".address-main .dyclick",function(){
    //    $(this).addClass('on').siblings().removeClass('on');
    //});

    // 家，公司，朋友tab切换
    //$('.new-head span').click(function(){
    //    $(this).addClass('on').siblings().removeClass('on');
    //});
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
                window.top.location.href = "../../../404.html";
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
    function initDefaultDeliverAddressChange1(provinceId,cityId,areaId,address,orderno){
        invokeApi("malldeliver/getorderdefaultdeliver",{"provinceId":provinceId,"cityId":cityId,"areaId":areaId,"address":address,"orderno":orderno},"",function(ret){
            var data = eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                initDefaultDeliver(data.deliver,1,data.undelivercount);
                //$("#delivermode").val("");
                //$(".pay-model dl dd").first().html("请选择您的配送日期");
                //$(".model-three li").removeClass("on");
            }
        });
    }
//初始化默认配送信息
    function initDefaultDeliver(deliver,inventory,count){
        $(".model-three").children().removeClass("on");
        $(".model-three .l1").addClass("on");
        $(".data-two li").remove();
        $("#sel_date").empty();
        var fee=0;
        if(deliver!=null){
            $(".pay-model dl dd").first().html(deliver.showDate);
            if(count==undefined||count==0){
                $("#l1 h3 p1").text("请选择您希望送达的日期");
                $(".model-con.on h3 span em").html(deliver.showToday);
            }else{
                $("#l1 h3 p1").text("剩余配送次数"+count+"次:");
                $(".model-con.on h3 span em").html("每7天配送一次");
                $(".model-con.on h3 span p").html("请选择最近一次配送日期");
            }

            //$(".model-con.on h3 span em").html(deliver.showToday);
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
            $(".pay-model dl dd").first().attr("enabled","1");
            //getDefaultDeliver(deliverType);
        }else{
            $(".data-two").append("<li class=\"address-none\"><img src='/images/address-none.png'><p>阿哦，该地址还未开通，</p><p>点击确认反馈给我们～</p></li>");
            $(".pay-model dl dd").first().attr("enabled","0");
            if(inventory!=undefined&&inventory==0){
                $(".pay-model dl dd").first().html("暂无库存");
            }else {
                $(".pay-model dl dd").first().html("您的地址没有匹配的配送信息");
            }
        }
    }
    var numVal;
    // 减
    $('body').on('click','.opera .decrease',function(e) {
        e.preventDefault();
        e.stopPropagation();
        limitCount = parseInt($(this).siblings('.num').attr("limitcount"));
        if (limitCount >= 0) {
            $(this).siblings("i").removeClass("unincrease").addClass("increase");
        }
        numVal = parseInt($(this).siblings('.num').val());
        if(numVal<=1) {
            //$(this).siblings('.num').attr("hidden", "hidden");
            //$(this).attr("hidden", "hidden");
            $(this).addClass("undecrease");
            numVal = 0;
            //$(this).siblings('.num').val(numVal);

        }else {
            numVal--;
        }
        var totalAmount=0;
        var totalCount=0;
        $(this).siblings('.num').val(numVal);
        $(".set-list li").each(function(){
            var amount=$(this).find("input[name='productid']").attr("amount");
            var count=$(this).find(".num").val();

            totalCount+=parseInt(count);
            totalAmount+=parseInt(count)*parseFloat(amount);
        });

        $(".set-cart em").html(totalCount);

        $(".set-bottom > em").html(totalAmount.toFixed(2));


    });
// 加
    $('body').on('click','section.opera .increase',function(e){
        e.preventDefault();
        e.stopPropagation();
        var isProduct=1;
        var limitCount=0;
        //$(this).siblings('.num').removeAttr("hidden");
        //(this).siblings('.decrease').removeAttr("hidden");
        $(this).siblings('.undecrease').addClass("decrease").removeClass("undecrease");
        numVal = parseInt($(this).siblings('.num').val());
        limitCount=parseInt($(this).siblings('.num').attr("limitcount"));

        if(numVal>=100){
            showMessage("已超过上限");
            return;
        }
        if(limitCount<0){
            return;
        }
        if(limitCount>0 &&(numVal+1)>=limitCount){
            $(this).addClass("unincrease");
            if(numVal>=limitCount)
                return ;
        }

        $(this).siblings(".decrease").removeClass("invalid");
        numVal++;
        var totalAmount=0;
        var totalCount=0;
        $(this).siblings('.num').val(numVal);
        $(".set-list li").each(function(){
            var amount=$(this).find("input[name='productid']").attr("amount");
            var count=$(this).find(".num").val();
            totalCount+=parseInt(count);
            totalAmount+=parseInt(count)*parseFloat(amount);
        });

        $(".set-cart em").html(totalCount);
        $(".set-bottom > em").html(totalAmount.toFixed(2));
    });
    $("#editproductok").click(function(){
        var totalAmount=0;
        var totalCount=0;
        var products="";
        $(".set-list li").each(function(){
            var amount=$(this).find("input[name='productid']").attr("amount");
            var count=$(this).find(".num").val();
            var productId=$(this).find("input[name='productid']").val();
            totalCount+=parseInt(count);
            totalAmount+=parseInt(count)*parseFloat(amount);
            if(count>0){
                products+=productId+":"+count+";";
            }
        });
        var oldCount=parseInt($(".set-list").attr("quantity"));
        var oldAmount=parseFloat($(".set-list").attr("amount"));
        if(oldCount!=totalCount){
            showMessage("修改后的数量不等于原数量。");
            return ;
        }
        if(oldAmount!=totalAmount){
            showMessage("修改后的金额不等于原金额。");
            return ;
        }
        invokeApi("mallorder/editOrderProduct",{"orderno":orderno,"products":products },"",function(ret){
            var data=eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if (data.status == 1) {
                    var product=data.products;
                    $(".edit-order-list").html("");
                    for (var i = 0; i < product.length; i++) {
                        var p=product[i];
                        $(".edit-order-list").append('<li>' +
                            '<p class="clearfix">' +
                            '<em>' + p.PRODUCT_NAME + '</em><strong>X&nbsp;' + p.QUANTITY + '</strong><i class="price">¥' + p.TOTAL_PRICE + '</i>' +
                            '</p>' +
                            (p.ORDER_CLASS==1?'<span>￥' + p.UNIT_PRICE + '/盒</span>':'') +
                            '</li>');
                    }
                    $(".close-alert, .back, .close").click();

                }else{
                    showMessage(data.message);
                }
            }
        });
    });
});
//初始化默认地址
function initDefaultAddress1(address){
    var orderno=GetQueryString("orderno");
    if(address!=null && address.ADDR_ID!=""){
        invokeApi("mallorder/editOrderAddress",{"addressid":address.ADDR_ID,"orderno":orderno},"",function(ret){
            var data=eval(ret);
            if (data.error_code != null) {
                window.top.location.href = "/404.html";
            } else {
                if (data.status == 1) {
                    $(".pay-contact h3 span").html(address.CONSIGNEE_NAME + " / <em>" + address.CONSIGNEE_PHONE + "</em>");
                    $(".address-box .adress").html(address.ADDRESS);
                    $(".address-box .adress").attr("areaId",address.AREA_ID);
                    $(".address-box i").html(getAddress_AddressType(address.ADDRESS_TYPE));
                    $(".close-alert, .back, .close").click();
                }else{
                    showMessage(data.message);
                }
            }
        });

    }else{
        $(".pay-contact h3 span").html("");
        $(".address-box .adress").html("");
        $(".address-box i").html("");
    }
}