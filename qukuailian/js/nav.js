$(function () {
    var winH = $(window).height();
    var winW = $(window).width();
    $(".alert_navbg").height(winH);
    if(winW<=768){
        $(".navbar-nav").height(winH);
    }
    $(".navbar-toggle").on("click", function () {
        if ($(".navbar_ul").is(":hidden")) {
            $(".alert_navbg").fadeIn();
            //$(".navbar_ul").animate({width: '2.8rem'}).fadeIn(100);
            $(".navbar_ul").fadeIn(100);
            $("body").css("overflow","hidden");
        } else {
            $(".navbar_ul").animate({width: '0'}).fadeOut(100);
        }
    });
    $(".alert_navbg").on("click", function () {
        $(this).fadeOut();
        $(".navbar_ul").fadeOut(100);
        $("body").css("overflow","scroll");

    });
    $(".alert_bg").on("click", function () {
        $(this).fadeOut();
        $(".alert_box").fadeOut();
        $("#weibo").fadeOut();
        $(".entrance").removeClass("click");

        $("body").css("overflow","scroll");

    });
});