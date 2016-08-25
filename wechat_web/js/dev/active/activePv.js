/**
 * Created by liqun on 2016/6/1.
 */
$(function(){
    recordPv();
});
function recordPv(){
    var page=window.location.pathname;
    var referrer = document.referrer;
    var isnews=GetQueryString("isnews");

    if(page.indexOf("fit_start.html")>=0){
        page="/active/act_fit/fit_start.html";
        if(isnews=="1"){
            referrer="mp.weixin.qq.com";
        }
    }
    if(page.indexOf("fit.html")>=0){
        page="/active/act_fit/fit.html";
    }
    if(page.indexOf("fit_invite.html")>=0){
        page="/active/act_fit/fit_invite.html";
    }
    if(page.indexOf("fit_medal.html")>=0){
        page="/active/act_fit/fit_medal.html";
    }
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
    invokeApi("mallactive/insertactivepv",{"page":page,"bindcode":bindcode,"source":source,"level":level,"types":types,"referrer":referrer},"",function(ret){

    });



}