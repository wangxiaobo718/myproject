(function (window) {
    "use strict";
    /**
     * 定义WeixinJsApi
     */
    var WeixinJsApi = {
        version: 0.1,
        filename: 'WeixinJsApi.js',
        hostUrl: 'wechat.lechun.cc', //验签服务器域名，可通过引用本脚本的url参数修改，例如：src="../WeixinJsApi.js?hostUrl=www.lechun.cc"
        //appId: '',//验签appId，可通过引用本脚本的url参数修改，例如：src="../WeixinJsApi.js?hostUrl=www.lechun.cc?hostUrl=www.lechun.cc&appId=wx1233454"
        queryArgs: null, //文件引用传入的参数
        timestamp: 0, //*时间戳: 可作状态码，0未验签，>0验签成功，<0验签失败
        hideMenu: 0,//*是否隐藏菜单: 0不隐藏，1隐藏
        readySuccess: null
    };
    // 将WeixinJsApi暴露到window下：全局可使用，对旧版本向下兼容
    window.WeixinJsApi = WeixinJsApi;
    /**
     * 对象简单继承，后面的覆盖前面的，继承深度：deep=1
     * @private
     */
    var _getQueryArgs = function () {
        if (WeixinJsApi.queryArgs) {
            return WeixinJsApi.queryArgs;
        }
        var sc = document.getElementsByTagName('script');
        var paramsArr = []; // sc[sc.length - 1].src.split('?')[1].split('&');
        for (var ii = 0, len = sc.length; ii < len; ii++) {
            if (sc[ii].src && sc[ii].src.indexOf(WeixinJsApi.filename) > -1) {
                var flagParam = sc[ii].src.split('?');
                if (flagParam && flagParam.length > 1) {
                    paramsArr = flagParam[1].split('&');
                    break;
                }
            }
        }
        var args = {},
            argsStr = [],
            param, t, name, value;
        for (var ii = 0, len = paramsArr.length; ii < len; ii++) {
            param = paramsArr[ii].split('=');
            name = param[0], value = param[1];
            if (typeof args[name] == "undefined") { //参数尚不存在  
                args[name] = value;
            } else if (typeof args[name] == "string") { //参数已经存在则保存为数组  
                args[name] = [args[name]]
                args[name].push(value);
            } else { //已经是数组的  
                args[name].push(value);
            }
        }
        WeixinJsApi.queryArgs = args;
        return args;
    }
    /**
        @obsolete
        */
    WeixinJsApi.getArg = function (fileName, argName) {
        var sc = document.getElementsByTagName('script');
        var paramsArr = [];
        for (var ii = 0, len = sc.length; ii < len; ii++) {
            if (sc[ii].src && sc[ii].src.indexOf(fileName) > -1) {
                var flagParam = sc[ii].src.split('?');
                if (flagParam && flagParam.length > 1) {
                    paramsArr = flagParam[1].split('&');
                    break;
                }
            }
        }
        var param, t, name, value;
        for (var ii = 0, len = paramsArr.length; ii < len; ii++) {
            param = paramsArr[ii].split('=');
            name = param[0], value = param[1];
            if (name == argName) { //参数尚不存在  
                return value;
            }
        }
        return null;
    };
    /**
     * 解析链接
     * @private
     */
    var _resolveUrl = function (url) {
        return hostUrl + url;
    }
    ////////////////////////////////一、初始化与基础接口//////////////////////////////
    /*
    @private 注入成功执行事件
    */
    WeixinJsApi.readySuccess = function (callback) {
        callback();
    }
    /*
    1.初始化与微信验签
    @protected
    */
    WeixinJsApi.ready = function (readySuccess) {
        WeixinJsApi.readySuccess = readySuccess;
        //var _hostUrl = _getQueryArgs()['hostUrl'];
        //if (_hostUrl) {
        //    WeixinJsApi.hostUrl = _hostUrl;
        //}
        var _hideMenu = _getQueryArgs()['hideMenu'];
        if (_hideMenu == 1)
        { WeixinJsApi.hideMenu = _hideMenu; }
        /*
        var _appId = _getQueryArgs()['appId'];
        if (_appId) {
            WeixinJsApi.appId = _appId;
        }
        */

        invokeApi("/mallwechat/jsapihandler", {sType: "signature", url: location.href},"",
        function(data){
            WeixinJsApi.config(data, readySuccess);
        });

    };
    WeixinJsApi.printError = function (req, status, err) {
        console.log('something went wrong', status, err);
        //alert(status);
    };
    /*
    @private 微信js注入
    */
    WeixinJsApi.config = function (data, readySuccess) {

        //debugger;
        //alert(data.appId);
        //alert(data.signature);
        //alert(readySuccess);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideOptionMenu'
                ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        //验签成功：暂时未用
        wx.ready(function () {
            WeixinJsApi.timestamp = data.timestamp;
            if (WeixinJsApi.hideMenu == 1) {
                WeixinJsApi.hideOptionMenu();
            }
            WeixinJsApi.readySuccess(readySuccess);
            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideOptionMenu'
                ],
                success: function (res) {
                    //alert(JSON.stringify(res));
                },
                fail: function (res) {
                    //alert(12);
                    //alert(JSON.stringify(res));
                }
            })
        });
        //验签失败：暂时未用
        wx.error(function (res) {
            //debugger;
            WeixinJsApi.timestamp = -data.timestamp;
            alert(res.errMsg);
            //config.log(res.errMsg+"错误信息188");
        });
    };

    WeixinJsApi.onMenuShareTimeline = function (data) {
        wx.onMenuShareTimeline(data);
    }

    WeixinJsApi.onMenuShareAppMessage = function (data) {
        wx.onMenuShareAppMessage(data);
    }
    WeixinJsApi.onMenuShareWeibo = function (data) {
        wx.onMenuShareWeibo(data);
    }

    WeixinJsApi.onMenuShareQQ = function (data) {
        wx.onMenuShareQQ(data);
    }

    WeixinJsApi.share = function (title, link, desc, imgUrl, success,cancel, fail) {

        var data = {
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            success: success || function () { }, //如果未定义，赋空事件
            cancel:cancel|| function () { },//如果未定义，赋空事件
            fail: fail || function () { } //如果未定义，赋空事件
        };
        var dataTimeline = {
            title: title,
            link: link,
            imgUrl: imgUrl,
            success: success || function () { }, //如果未定义，赋空事件
            cancel:cancel|| function () { },//如果未定义，赋空事件
            fail: fail || function () { } //如果未定义，赋空事件
        };

        WeixinJsApi.onMenuShareTimeline(dataTimeline);

        WeixinJsApi.onMenuShareAppMessage(data);
        //WeixinJsApi.onMenuShareQQ(data);
        //WeixinJsApi.onMenuShareWeibo(data);
        // config.log("设置分享事件423");
    }
    ////////////////////////////////四、界面操作//////////////////////////////
    /*
     * 1.隐藏右上角菜单接口
     */
    WeixinJsApi.hideOptionMenu = function () {
        wx.hideOptionMenu();
    };
    /*
     * 2.显示右上角菜单接口
     */
    WeixinJsApi.showOptionMenu = function () {
        wx.showOptionMenu();
    }

    WeixinJsApi.hideMenuItems = function (menuListStr, success, fail) {
        wx.hideMenuItems({
            menuList: menuListStr.split(','),
            success: success || function () { },
            fail: fail || function () { }
        });
    }
    /*
     * 4.批量显示功能按钮接口
     */
    WeixinJsApi.showMenuItems = function (menuListStr, success, fail) {
        wx.showMenuItems({
            menuList: menuListStr.split(','),
            success: success || function () { },
            fail: fail || function () { }
        });
    }
    /*
     * 5.隐藏所有非基础按钮接口
     */
    WeixinJsApi.hideAllNonBaseMenuItem = function () {
        wx.hideAllNonBaseMenuItem();
    }
    /*
     * 6.显示所有功能按钮接口
     */
    WeixinJsApi.showAllNonBaseMenuItem = function () {
        wx.showAllNonBaseMenuItem();
    }
    /*
     * 7.关闭当前网页窗口接口
     */
    WeixinJsApi.closeWindow = function () {
        wx.closeWindow();
    }
    ////////////////////////////////四、设备信息//////////////////////////////
    /**
    1.获取网络状态接口
    * 使用方法：
    * WeixinApi.getNetworkType(function(networkType){
    *
    * });
    */
    WeixinJsApi.getNetworkType = function (callback) {
        if (callback && typeof callback == 'function') {
            wx.getNetworkType({
                success: function (res) {
                    callback(res.networkType); // 返回网络类型2g，3g，4g，wifi
                },
                fail: function (res) {
                    callback("");
                }
            });
        }
    }
    /**
    2.判断当前网页是否在微信内置浏览器中打开
    */
    WeixinJsApi.openInWeixin = function () {
        //debugger;
        return /MicroMessenger/i.test(navigator.userAgent);
    }
    WeixinJsApi.wechatPay=function (data) {
        wx.chooseWXPay(data);
    }
})(window);