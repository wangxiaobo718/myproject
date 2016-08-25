var netWorkType;//网络类型
var bindCode;
var status;
var shareUrl;
//分享成功函数
var suc = function (res) {
    var shareResult="success";
    var page=window.location.pathname;
    if(page.indexOf("fit.html")>=0){
        page="/active/act_fit/fit.html";
    }
    if(page.indexOf("fit_invite.html")>=0){
        page="/active/act_fit/fit_invite.html";
    }
    if(page.indexOf("fit_medal.html")>=0){
        page="/active/act_fit/fit_medal.html";
    }
    var url=shareUrl;
    invokeApi("mallactive/saveactiveshare",{"bindcode":bindCode,"shareresult":shareResult,"networktype":netWorkType,"page":page,"shareurl":url},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            if (data.state == 1) {
                $("#alert_share").removeClass("on");
                //$("#alert_share").hide();
                if(data.issubscribe==1) {
                    window.location.href = "http://wechat.lechun.cc/?source=1";
                }else{
                    window.location.href = "http://wechat.lechun.cc/active/act_fit/fit_attention.html";
                }
            }else{

            }
        }
    });
}
//分享取消函数
var cancel = function (res) {
    var shareResult="cancel";
    var page=window.location.pathname;
    var url=window.location.href;
    invokeApi("mallactive/saveactiveshare",{"bindcode":bindCode,"shareresult":shareResult,"networktype":netWorkType,"page":page,"shareurl":url},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {
            //alert("取消分享");
        }
    });
}
//分享失败函数
var fai = function (res) {
    var shareResult="fail";
    var page=window.location.pathname;
    var url=window.location.href;
    invokeApi("mallactive/saveactiveshare",{"bindcode":bindCode,"shareresult":shareResult,"networktype":netWorkType,"page":page,"shareurl":url},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html";
        } else {

        }
    });
}

function share(){
    var type=1;
    var page=window.location.pathname;
    var source=GetQueryString("source");
    if (page.indexOf("share_success1.html") < 0) {
        type=2;
    }
    invokeApi("mallactive/sharebefore",{"bindcode":bindCode,"source":source,"types":type},"",function(ret){
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "/404.html?err="+data.error_code+"&"+data.error_msg;
        } else {
            //分享信息初始化，必须调用。
            WeixinJsApi.ready(function () {
                //if(data.status==1){
                //    if (page.indexOf("share_success1.html") >= 0) {
                //        //$("#shareImage").attr("src", "/images/share-success.jpg");
                //        $("#shareImage").show();
                //    }
                //}else {
                //    if (page.indexOf("share_success1.html") >= 0) {
                //        WeixinJsApi.hideOptionMenu();
                //        $("#shareImage").attr("src", "/images/share-fail.jpg");
                //        $("#shareImage").show();
                //    }
                //}
                shareUrl=data.URL;
                WeixinJsApi.share(data.TITLE, data.URL, data.DIGEST, data.IMAGE_URL, suc, cancel, fai);
                WeixinJsApi.getNetworkType(function(networkType) {
                    netWorkType=networkType;
                });
            });

        }
    });
}

$(function () {
    bindCode=GetQueryString("bindcode");
    share();

    //判断在否在微信浏览器中打开
    //if (!WeixinJsApi.openInWeixin()) {
    //    alert("请在微信浏览器中打开");
    //}
    //window.close();
});
