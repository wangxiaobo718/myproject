$(function () {

    $(".box").mousemove(function () {
        $(this).addClass("on")
    }).mouseout(function () {
        $(this).removeClass("on")
    });
    if($(window).width()>960){
        var $p=$(".list .box");
        var a=[];
        $p.each(function(){
            a.push($(this).height()+10);
        });
        for(var i=0;i<a.length;i++){
            for(var j = i + 1;j<a.length;j++){
                if(a[i]>a[j]){
                    var tmp = a[i];
                    a[i] = a[j];
                    a[j] = tmp;
                }
            }
        }
        $p.height(a[a.length-1])
    }
});