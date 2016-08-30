/*七夕活动*/
/**
 * 购买套数可从 roseNode.num.val() 获取
 * maxVal:最大购买数量
 * 限量剩余$('.valentine-tips p').html('限量剩余'+resNum+'盒')
 * **/
$(function(){
    var roseNode = {
        num : $('.rose-buy-count .num'),
        add : $('.rose-buy-count div .increase'),
        remove : $('.rose-buy-count div .undecrease'),
        total : $('.rose-all-price em')
    };
    var numVal = 1;
    var maxVal = 10;
    var interval = 1000;
    invokeApi("malllisting/get77group",{},"",function (ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html?"+data.error_code;
        } else {
            if(data.status==1){
                $(".valentine-wrap").show();
                var times=data.seconds;
                /**ShowCountDown(times);**/
                var limitNum = data.limitCount - parseInt(data.balanceCount);
                $(".info-price em").html("¥"+data.price+"/套");
                $(".pro-price-rose span").html("<em>心动价 </em>¥"+data.price+"/套");
                $('.valentine-tips h4').html('每日限量'+data.limitCount+'套');
                $('.valentine-tips p').html('限量剩余'+data.balanceCount+'套');
                roseNode.total.html(data.price);
                $("#group77").val(data.groupId);
                $("#group77").attr("price",data.price);
                var int =window.setInterval(
                    function(){
                        ShowCountDown(times);
                        times--;
                    }, interval);
                if(data.balanceCount<=0){
                    clearInterval(int);
                }
                buyBox(data.balanceCount);

            }else{
                $(".valentine-wrap").hide();
                $(".info-price em").html("¥99/套");
                $(".pro-price-rose span").html("<em>心动价 </em>¥99/套");
                $('.valentine-tips p').html('今日售罄');
                $('.valentine-buy').html("今日售罄");
                ShowCountDown(0);
            }
        }
    });

    //购买弹框功能
    function buyBox(bNum){
        var nowTime = new Date();
        var endTime = new Date(2016,7,7,13,0,0);//8月需要减一
        var decTime = endTime.getTime() - nowTime.getTime();
        var btnHtml;
        var btnTou;
        if(bNum <=0){
            btnHtml = '今日售罄';
            btnTou = 'none';
            $('.valentine-tips p').html('今日售罄');
            $('.valentine-tips time').html('00 : 00 : 00');
            //if(decTime<=0){
            //    btnHtml = '立即购买';
            //    btnTou = 'block';
            //}else{
            //    btnHtml = '周日13:00开始送爱';
            //    btnTou = 'none';
            //}
        }else{
            btnHtml = '立即购买';
            btnTou = 'block';
        }
        $('.valentine-buy').html(btnHtml);
        $('.valentine-buy').on('touchend',function(e){
            e.preventDefault();
            e.stopPropagation();
            $('.alert-valentine-box').css('display',btnTou).on('touchmove',function(e){
                e.preventDefault();
            });
        });
    }

    $('.alert-valentine-box').on('click',function(){
        $(this).hide();
    });
    $('.rose-buy-box').on('click',function(e){
        e.preventDefault();
        e.stopPropagation();
    });

    //套装add
    roseNode.add.on('touchend',function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).parents('.rose-buy-count').find('.undecrease').addClass('decrease');
        if(numVal<maxVal-1){
            numVal++;
        }else{
            numVal = maxVal;
            $(this).addClass('unincrease');
        }
        roseNode.num.attr('value',numVal);
        roseNode.total.html(numVal*99);
    });
    //套装remove
    roseNode.remove.on('touchend',function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).parents('.rose-buy-count').find('.increase').removeClass('unincrease');
        if(numVal>2){
            numVal--
        }else{
            numVal=1;
            $(this).removeClass('decrease');
        }
        roseNode.num.attr('value',numVal);
        roseNode.total.html(numVal*99);
    });

    //转到结算页
    $('.rose-topay').on('touchend',function(e){
        e.preventDefault();
        e.stopPropagation();
        var dataPro = {
            pid : $('input[name="group77"]').val(),//商品pid
            pnum : roseNode.num.val(),//套装数量
            ptotal : roseNode.total.html()//总价格
        };
        window.location.href="/topay.html?type=1&groupId="+dataPro.pid+"&quantity="+dataPro.pnum;
    });

    //倒计时
    /**
     * ShowCountDown(2016,8,9);可填截止日期年、月、日
     * **/
    function ShowCountDown(d)
    {
        var leftsecond = d;
        var hour=Math.floor(leftsecond/3600);
        var minute=Math.floor((leftsecond-hour*3600)/60);
        var second=Math.floor(leftsecond-hour*3600-minute*60);
        var valentineAct = $('.valentine-tips time');
        function zeroTime(item){
            return item<10?'0'+item:item;
        }
        var timeI = zeroTime(hour)+' : '+zeroTime(minute)+' : '+zeroTime(second);
        if(hour<=0 && minute<=0 && second<=0){
            timeI = "00 ：00 ：00";
        }
        valentineAct.html(timeI);
    }
    
    //普通玫瑰样式修改
    //$('.single-pro li').each(function(){
        //if($(this).find('input[name="productid"]').attr('id') == 'p3039934053343201111'){
            //$(this).find('.pro-info').css('color','#ff0b5b');
            //$(this).find('.tag-box .tag').css('border-color','#ff0b5b');
            //$(this).find('.opera .increase').css('background-image','url("/images/act/valentine/icon-rose-add.png")');
            //$(this).find('.opera .decrease').css('background-image','url("/images/act/valentine/icon-rose-remove-on.png")');
        //}
    //})

});