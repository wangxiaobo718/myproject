$(function () {
    var ary = [
        {
            "time": "Q3 2018",
            "tile": "白皮书和官网上线",
            "introduce": "HealthChainTech 白皮书和官网上线，中国、澳大利亚办公室落地，启动私募，研究室 筹建，小型 POC 项目开发测试"
        },
        {"time": "Q1 2019", "tile": "POC测试", "introduce": "小型 POC 测试项目在 EOSIO 网络试运行,MVP 项目原型开发"},

        {
            "time": "Q3 2018",
            "tile": "医疗数据平台1.0版本测试上线",
            "introduce": "HealthChainTech 白皮书和官网上线，中国、澳大利亚办公室落地，启动私募，研究室 筹建，小型 POC 项目开发测试"
        },
        {"time": "Q1 2019", "tile": "POC测试", "introduce": "小型 POC 测试项目在 EOSIO 网络试运行,MVP 项目原型开发"},
        {
            "time": "Q3 2018",
            "tile": "白皮书和官网上线",
            "introduce": "HealthChainTech 白皮书和官网上线，中国、澳大利亚办公室落地，启动私募，研究室 筹建，小型 POC 项目开发测试"
        },
        {"time": "Q1 2019", "tile": "POC测试", "introduce": "小型 POC 测试项目在 EOSIO 网络试运行,MVP 项目原型开发"},
        {
            "time": "Q3 2018",
            "tile": "侧链开发测试",
            "introduce": "HealthChainTech 白皮书和官网上线，中国、澳大利亚办公室落地，启动私募，研究室 筹建，小型 POC 项目开发测试"
        },
        {"time": "Q1 2019", "tile": "POC测试", "introduce": "HealthChainTech 医疗数据平台 3.0 上线，HealthChainTech 子链开发更多应用场景 扩充，非洲、南美办公室落地"},

    ];
    var str = "";
    for (var i = 0; i < ary.length; i++) {
        str += '<div class="timeline__item timeline__item--"+' + i + '><div class="timeline__item__station"></div><div class="timeline__item__content">' +
            '<h2 class="timeline__item__content__date">' + ary[i].time + '</h2><p class="timeline__item__content__description">' + ary[i].tile + '</p><p class="introduce">' + ary[i].introduce +'</p></div></div>'
    }
    $(".wrapper").html(str);
    var h = $(".wrapper div.timeline__item:last").position().top;
    $('head').append("<style>.timeline::before{height:"+h+"px!important}</style>");
    $(".wrapper div.timeline__item:even").addClass("right");
    $(".a").mouseover(function () {
        $(this).find("img").attr("src","images/foot/a.png")
    }).mouseout(function () {
        $(this).find("img").attr("src","images/foot/a1.png")

    })
});