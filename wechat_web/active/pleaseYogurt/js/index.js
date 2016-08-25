//->解决click的300ms延迟
FastClick.attach(document.body);
//->解决click的300ms延迟
FastClick.attach(document.body);
$(function () {
    var red = "../../images/act/please/index/red_reduce.png";
    var yellow = "../../images/act/please/index/yellow_reduce.png";
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;

    function box(ele, ele1, color) {
        $(ele).click(function () {
            if (ele == ".price_1 .img2") {
                ++a;
            } else if (ele == ".price_2 .img2") {
                ++b
            } else if (ele == ".price_3 .img2") {
                ++c
            } else if (ele == ".price_4 .img2") {
                ++d
            }

            var $num = $(this).parent().children(".num").text();
            $(this).parent().children(".num").text(++$num)
            if ($num <= 0) {
                $(this).parent().children(".img1").css("display", 'none');

            }else{
                $(this).parent().children(".img_gray").css("display", 'block');
            }
            $(".total").text(a+b+c+d);
            console.log(a+b+c+d)
        });
        $(ele1).click(function () {
            var $num = $(this).parent().children(".num").text();
            if ($num > 0) {
                $(this).parent().children(".num").text(--$num);
            }
            if ($num < 1) {
                $(this).parent().children(".img1").attr("src", "../../images/act/please/index/gray_reduce.png");
            }
            if (ele1 == ".price_1 .img1") {
                --a;
            } else if (ele1 == ".price_2 .img1") {
                --b
            } else if (ele1 == ".price_3 .img1") {
                --c
            } else if (ele1 == ".price_4 .img1") {
                --d
            }
            $(".total").text(a+b+c+d);

        })
    }

    //轮播六盒装
    box(".price_1 .img2", ".price_1 .img1", red);
    box(".price_2 .img2", ".price_1 .img1", red);
    box(".price_3 .img2", ".price_1 .img1", red);
    box(".price_4 .img2", ".price_2 .img1", yellow);


    //$(".price_1 .img2").click(function () {
    //    var $num = $(this).parent().children(".num").text();
    //    $(this).parent().children(".num").text(++$num)
    //    if ($num >= 1) {
    //        $(this).parent().children(".img1").attr("src", "../../images/act/please/index/red_reduce.png");
    //    }
    //});
    //$(".price_1 .img1").click(function () {
    //    var $num = $(this).parent().children(".num").text();
    //    if ($num > 0) {
    //        $(this).parent().children(".num").text(--$num);
    //    }
    //    if ($num < 1) {
    //        $(this).parent().children(".img1").attr("src", "../../images/act/please/index/gray_reduce.png");
    //    }
    //})
    //礼品卡


});