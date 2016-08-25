
FastClick.attach(document.body);
$(function () {
var $total=0;
function box(ele,ele1){
    $(ele).click(function () {
        var $num = $(this).parent().children(".num").val();
        var n=++$num;

        $(this).parent().children(".num").attr("value",n);
        if ($num >= 1) {
            $(this).parent().children(".img_gray").css("display","block");
        }
       var num1=$(".price_1").children(".num").val();
       var num2=$(".price_2").children(".num").val();
       var num3=$(".price_3").children(".num").val();
       var num4=$(".price_4").children(".num").val();
        $total+=1;
        $(".total").text($total);
        if(num4>0&&num1>0){
                $(".pay .span1").text("乐纯真爱特供")
        }else if(num4>0&&num2>0){
            $(".pay .span1").text("乐纯真爱特供")
        }else if(num4>0&&num3>0){
            $(".pay .span1").text("乐纯真爱特供")
        }

    });
    $(ele1).click(function () {
        var $num = $(this).parent().children(".num").val();
        if ($num > 0) {
            $(this).parent().children(".num").attr("value",--$num);
        }
        if ($num < 1) {
            $(this).parent().children(".img_gray").css("display","none");
        }
        $total-=1;
        $(".total").text($total);

    });
}
    box(".price_1 .img2", ".price_1 .img_gray");
    box(".price_2 .img2", ".price_2 .img_gray");
    box(".price_3 .img2", ".price_3 .img_gray");
    box(".price_4 .img2", ".price_4 .img_gray");





});