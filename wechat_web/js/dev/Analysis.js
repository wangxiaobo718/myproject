//神策js文件引入
document.write("<script type='text/javascript' src='/js/dev/SensorsHead.js' ></script>");
document.write("<script type='text/javascript' src='/js/libary/sensorsdata.min.js' ></script>");
$(document).ready(function() {
    var cookieId=getCookie(loginCookieName);
    var source = GetQueryString("lcjiance");
    if (source == undefined || source == null)
        source = " ";

    setTimeout(function(){
        if(cookieId!=null&&cookieId!=undefined) {
            invokeApi("mallcustomer/getcustomerIdBytoken",{},"",function(ret){
                var data = eval(ret);
                if (data.error_code != null) {
                } else {
                    var uid=data.uid;
                    if(uid!="") {
                        sa.identify(uid, true);
                        sa.quick('autoTrack');
                    }
                }
            });
        }
        if(source==1){//乐纯头条
            sa.track('lcjiance',{dataFrom:'乐纯头条'});
        }
        if(source==2){   //乐纯食堂
            sa.track('lcjiance',{dataFrom:'乐纯食堂'});
        }
        if(source==3){   //乐纯口碑
            sa.track('lcjiance',{dataFrom:'乐纯口碑'});
        }
        if(source==4){   //乐纯plus
            sa.track('lcjiance',{dataFrom:'乐纯plus'});
        }
        if(source==5){   //纯吃货
            sa.track('lcjiance',{dataFrom:'纯吃货'});
        }
        if(source==6){
            sa.track('lcjiance',{dataFrom:'乐纯主文2'});
        }

    },1000);
    //微信支付按钮
    $(".pay-wechat .wechat-btn").on('click',function(){
        sa.track('wxPay',{from:'微信支付'});
    });


    $(".topay #topay").on('click',function(){
        sa.track('accounts',{from:'结算'});

    });

});


