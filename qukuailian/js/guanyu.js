$(function () {
    if($(window).width()>960){
        var $p=$(".youshi_box .box");
        var a=[];
        $p.each(function(){
            a.push($(this).height());
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