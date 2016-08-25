$(document).ready(function(){
    invokeApi("mallactive/getcustomeractive",{},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html?errorcode="+data.error_code;
        } else {
            for (var i = 0; i < data.length; i++) {
                var active = eval(data[i]);
                var param="?bindcode="+active.BIND_CODE+"&success="+active.success;
                $(".active-list").html("<li class='clearfix act-li'>"+
                    "<a href='/active/act_microsoft/act_microsoft_success.html"+param+"'>"+
                    "<img src='/images/act/micrsoft/micr01.png' />"+
                    "<span class='btn-detail'>查看详情</span>"+
                    "</a>"+
                    "</li>");
            }
            $(".active-list").append("<li class='clearfix act-li'>"+
                "<a href='http://open.fengxuan.co/LC_Groupon/index'>"+
                "<img src='/images/act/group-purchase.png' />"+
                ""+
                "</a>"+
                "</li>");
        }
    });

});