$(function () {


    //移动端
    var swiper = new Swiper('.map_swiper', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        loop: false,
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 30,
        onSlideChangeEnd: function (swiper) {
            $(".lechun_box .swiper-slide-next,.lechun_box .swiper-slide-prev").addClass("sw");
            $(".lechun_box .swiper-slide-next,.lechun_box .swiper-slide-prev,.swiper-slide-active").removeClass("swiper-fist");
            $(".swiper-slide-active").removeClass("sw");
        }
    });
    var swiper1 = new Swiper('.story_swiper', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 30
    });


})
;
