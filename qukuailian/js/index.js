$(function () {

    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        paginationClickable: true,
        // spaceBetween: 30,
        loop: true,
        // autoplay: 2500,
        autoplayDisableOnInteraction: false
    });

    $(".box").mousemove(function () {
        $(this).addClass("on")
    }).mouseout(function () {
        $(this).removeClass("on")
    });
    //新闻一样高度
    if ($(window).width() > 960) {
        var $p = $(".new_box .box");
        var a = [];
        $p.each(function () {
            a.push($(this).height() + 10);
        });
        for (var i = 0; i < a.length; i++) {
            for (var j = i + 1; j < a.length; j++) {
                if (a[i] > a[j]) {
                    var tmp = a[i];
                    a[i] = a[j];
                    a[j] = tmp;
                }
            }
        }
        $p.height(a[a.length - 1]);

    }
    if($(window).width()<768){
        $(".navbar-header").width($(window).width())
    }
    // 轮播图一样高度
    function heightFn() {
        var $imgH = $(".team_box .right img").height();
        $(".team_box .left").height($imgH)
        console.log($imgH)
    }
    heightFn();
    $(window).resize(function () {
        heightFn()
    });

   console.log( )
    // //移动端
    // var swiper = new Swiper('.map_swiper', {
    //     pagination: '.swiper-pagination',
    //     slidesPerView: 'auto',
    //     loop: false,
    //     centeredSlides: true,
    //     paginationClickable: true,
    //     spaceBetween: 30,
    //     onSlideChangeEnd: function (swiper) {
    //         $(".lechun_box .swiper-slide-next,.lechun_box .swiper-slide-prev").addClass("sw");
    //         $(".lechun_box .swiper-slide-next,.lechun_box .swiper-slide-prev,.swiper-slide-active").removeClass("swiper-fist");
    //         $(".swiper-slide-active").removeClass("sw");
    //     }
    // });
    // var swiper1 = new Swiper('.story_swiper', {
    //     pagination: '.swiper-pagination',
    //     slidesPerView: 'auto',
    //     centeredSlides: true,
    //     paginationClickable: true,
    //     spaceBetween: 30
    // });


})
;
