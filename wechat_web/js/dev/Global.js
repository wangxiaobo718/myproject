var hostUrl="http://apitest.lechun.cc";
var hostUrlGiftApi = 'http://apitest.lechun.cc:9080/lechunuser';
var domain="lechun.cc";
var loginCookieName="lechuncccookietest";
var gBeginSaleCount=6;
var gFreeFeightCount=6;
$(document).ready(function() {
    //判断cookie
    var url=encodeURI(window.location.href);
    //用于测试
    setCookie(loginCookieName,"a235c93cfeaf4514b463bd101704e6a4fa5e9f6062884d65a832fa2554c6e33f");

    var cookie=getCookie(loginCookieName);
    if(cookie==null){
        var cookielogin=GetQueryString("cookielogin");
        if(cookielogin!=""){
            setCookie(loginCookieName,unescape(cookielogin));
            return ;
        }

        if(domain!="lechun.cc"){
            window.location.href="http://wechat.lechun.cc/author_wexin_lechun.html?return="+escape(window.location.href);
        }
        else {
            //$.getJSON(hostUrl + "/mallwechat/wechatauthor?sign=&fresh=" + Math.random() + "&callback=?", {"url": url}, function (ret) {
            //    var data = eval(ret);
            //    if (data.error_code != null) {
            //
            //        window.top.location.href = "404.html?" + data.error_code;
            //    } else {
            //        window.location.href = data.url;
            //    }
            //});
        }
    }
    var bindcode=GetQueryString("bindcode");
    if(bindcode!="") {
        var c = getCookie("lechunbindcode");
        if (c == null) {
            setCookie("lechunbindcode",bindcode);
        }
    }

});
function getGlobalKey()
{
    var key="489430kjrewori430i0if93i943ewoi439";
    return key;
}
function invokeApi(url, data,fresh, call) {
    var cookie=getCookie(loginCookieName);
    if(cookie==null)
        return ;
    url=url.trim();
    if(url.substring(0,1)=="/")
        url=hostUrl+url;
    else
        url=hostUrl+"/"+url;
    var f_str=JSON.stringify(data);
    f_str=f_str.split("\"").join('');
    f_str=f_str.split(" ").join('');
    f_str=f_str.replace("{","").replace("}","");
    f_str=f_str.split(",").sort().join(",");
    var sign=$.md5(f_str+"_"+getGlobalKey());
    if(fresh!="")
        fresh ="&fresh="+ Math.random();

    $.getJSON( url + "?sign="+sign+fresh+"&callback=?", data, function(ret) {
        call(ret);
    });
}
function ajaxCommitForm(formId,url,success,fail)
{
    var submit_url = url=url.trim();
    if(url.substring(0,1)=="/")
        url=hostUrl+url;
    else
        url=hostUrl+"/"+url;

    var sign=$.md5(getGlobalKey());
    if(url.indexOf("?")>-1)
        url+="&sign="+sign;
    else
        url+="?sign="+sign;

    var options = {
        type:'POST',
        dataType:'json',
        url:submit_url,
        success:success,
        error:fail
    };
    $('#'+formId).ajaxSubmit(options);
}
//写cookies
function setCookie(name,value)
{
    var Days = 360;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ encodeURIComponent (value) + ";domain="+domain+";expires=" + exp.toGMTString();
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        var n=decodeURIComponent(arr[2]);
        //n=n.replace(/\"/g, "");
        return n;
    }
    else
        return null;
}
//function getCookie(sName)
//{
//    var aCookie = document.cookie.split("; ");
//    for (var i=0; i < aCookie.length; i++)
//    {
//        var aCrumb = aCookie[i].split("=");
//        if (sName == aCrumb[0]) {
//            var n=decodeURIComponent(aCrumb[1]);
//            n=n.replace(/\"/g, "");
//            return decodeURIComponent(n);
//        }
//    }
//    return null;
//}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURIComponent(r[2]);
    return "";
}