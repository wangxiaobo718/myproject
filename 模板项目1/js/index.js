$(function () {
    $("body").click(function () {
        $(".a1-ul,.a1-ul1").slideUp(200);
    });
    $("#a1").click(function (event) {
        $(".a1-ul").slideToggle(200);
        $(".a1-ul1").slideUp(200);
        event.stopPropagation();
    });
    $('.a2').click(function (event) {
        $(".a1-ul1").slideToggle(200);
        $(".a1-ul").slideUp(200);
        event.stopPropagation();
    });


    $("#zi").on("mouseover", function (ev) {
        $(".zi-bot").stop().slideDown(200);
        //$(".ai").attr("id","ai");
        ev.stopPropagation();
    }).on("mouseout", function (ev) {
        $(".zi-bot").stop().slideUp(200);
        //$(".ai").attr("id","");
        ev.stopPropagation();
    });

});

(function () {
    window.onscroll = function () {
        var curT = win("scrollTop");
        var cliH = win("clientHeight") / 5;
        if (curT >= cliH) {
            $("#nav-fixed").addClass('nav-fixed');

        } else {
            $("#nav-fixed").removeClass("nav-fixed");
        }
    };
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }
}());



!(function () {
    $(window).scroll(function () {

        if ($(window).scrollTop() > 260) {
            $("#go").css("display", "block");
        } else {
            $("#go").css("display", "none");
        }
        $("#go").click(function () {
            $("body").stop().animate({scrollTop: 0});
        })
    })
}());


//ÂÖ²¥Í¼
!(function () {
    var outer = document.getElementById("outer");
    var inner = document.getElementById("inner");
    var tip = document.getElementById("tip");
    var oUl = inner.getElementsByTagName("ul");
    var imgList = inner.getElementsByTagName("div");
    var tipList = tip.getElementsByTagName("li");
    var innerRight = document.getElementById("innerRight");
    var innerLeft = document.getElementById("innerLeft");
    animate(oUl[0], {left: 116}, 1600, 1);
    animate(imgList[0], {opacity: 1}, 1000, 1);
    var step = 0;
    var autoTimer = null;


    function move() {
        step++;
        if (step >= imgList.length) {
            step = 0;
        }
        animate(imgList[step], {opacity: 1}, 1000, 1);
        for (var i = 0; i < imgList.length; i++) {
            if (i !== step) {
                animate(imgList[i], {opacity: 0}, 800);
            }
        }
        for (var k = 0; k < imgList.length; k++) {
            imgList[k].ind = k;
            if (step === imgList[k].ind) {
                animate(oUl[k], {left: 380}, 1600, 1);
            } else {
                oUl[k].style.left = -1500+ "px";
            }
        }

        changeTip();
    }
    for (var k = 0; k < imgList.length; k++) {
        imgList[k].ind = k;
        if (step === imgList[k].ind) {
            animate(oUl[k], {left: 380}, 1600, 1);
        } else {
            oUl[k].style.left = -1500+ "px";
        }
    }

    autoTimer = window.setInterval(move, 6000);
    function changeTip() {
        var tempStep = step >= tipList.length ? 0 : step;
        for (var i = 0; i < tipList.length; i++) {
            tipList[i].className = i === tempStep ? "select" : null;
        }
    }

    for (var i = 0; i < tipList.length; i++) {
        tipList[i].index = i;
        tipList[i].onclick = function () {
            window.clearInterval(autoTimer);
            animate(imgList[this.index], {opacity: 1}, 300);
            for (var i = 0; i < imgList.length; i++) {
                if (i !== this.index) {
                    animate(imgList[i], {opacity: 0}, 300);
                }
            }
            step = this.index;
            //autoTimer = window.setInterval(move, 6000);
            changeTip();
            for (var k = 0; k < imgList.length; k++) {
                imgList[k].ind = k;
                if (step === imgList[k].ind) {
                    animate(oUl[k], {left: 380}, 1600, 1);
                } else {
                    oUl[k].style.left = -1500 + "px";
                }
            }
            autoTimer = window.setInterval(move, 6000);
        };
    }
    inner.onmouseenter = function () {
        window.clearInterval(autoTimer);
    };
    inner.onmouseleave = function () {
        autoTimer = window.setInterval(move, 6000);
    };


}())

