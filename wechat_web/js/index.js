//->解决click的300ms延迟
FastClick.attach(document.body);
//->初始化Swiper
new Swiper(".swiper-container", {
    direction: "vertical",
    loop: true,
    //->当屏幕切换结束后执行 swipe:当前Swiper的一个实例
    onSlideChangeEnd: function (swipe) {
        var n = swipe.activeIndex,//->获取当前活动块(当前展示的)的索引
            slideAry = swipe.slides;//->当前容器中所有的slider(包含loop模式下克隆的那两个)-它是一个类数组集合
        var str="";
        //->让当前展示的那个有ID，其余的都移除ID
        [].forEach.call(slideAry, function (item, index) {

            if (index == n) {
                //->这个就是当前这一块,需要设定ID
                switch (index) {
                    case 1:
                        item.id = "page1";
                        $(".naidi").removeClass("naidi1");
                        break;
                    case 2:
                        item.id = "page2";
                        setTimeout(function () {
                            $(".naidi").addClass("naidi1");
                        }, 1900);

                        break;
                    case 3:
                        item.id = "page3";
                        $(".naidi").removeClass("naidi1");
                        break;
                    case 4:
                        item.id = "page4";
                        $("iframe").remove();
                        $(".next").removeClass("btn_next");
                        $(".pver").removeClass("btn_pver");
                        $(".next").css("opacity", 0);
                        $(".pver").css("opacity", 0);
                        break;
                    case 5:
                        item.id = "page5";

                        str+="<iframe class='ifr' src='05_long.html'></iframe>";
                        $(".page5").append(str);
                        setTimeout(function () {
                            $(".next").css("opacity", 1);
                            $(".next").addClass("btn_next");
                            $(".pver").css("opacity", 1);
                            $(".pver").addClass("btn_pver");
                        }, 1200);
                        break;
                    case 6:
                        item.id = "page6";
                        $("iframe").remove();
                        $(".next").css("opacity", 0);
                        $(".pver").removeClass("btn_pver");
                        $(".next").removeClass("btn_next");
                        $(".pver").css("opacity", 0);
                        break;
                    case 7:
                        item.id = "page1";
                        break;
                }
                return;
            }
            item.id = null;
        });
    }
});

