/**
 * 会员活动激活
 * **/
$(function(){
    var perUrl = 'http://apitest.lechun.cc:9080/lechunuser/user/investigate/active';
    //单选框样式选中
    $('.sex-item input').on('touchend',function(e){
        e.preventDefault();
        $(this).parents('.sex-item').find('.select-on').removeClass('select-on');
        $(this).parents('.select-radio').addClass('select-on');
        $(this)[0].checked = true;
    });
    $('.money-item input').on('touchend',function(e){
        e.preventDefault();
        $(this).parents('.money-item').find('.select-on').removeClass('select-on');
        $(this).parents('.select-radio').addClass('select-on');
        $(this)[0].checked = true;
    });
    $('.child-item input').on('touchend',function(e){
        e.preventDefault();
        $(this).parents('.child-item').find('.select-on').removeClass('select-on');
        $(this).parents('.select-radio').addClass('select-on');
        $(this)[0].checked = true;
        if($('.child-on')[0].checked){
            $('.child-item select').show();
        }else{
            $('.child-item select').hide();
        }
    });
    $('.submit-btn').on('touchend',function (e) {
        e.preventDefault();
        e.stopPropagation();
        var flag;
        $('.child-on').val($('.age-select').val());
        for(var i=0;i<$('.must-do').length;i++){
            if($('.must-do').eq(i).val() == ''){
                $('.must-do').eq(i).css('border-color','#e51616').focus();
                alert('"'+$('.must-do').eq(i).siblings().attr('data-name')+'"不能为空');
                // return false;
                flag = false;
                return flag;
            }else{
                if(!(/^1[3|4|5|7|8]\d{9}$/.test($('#phone').val()))){
                    $('#phone').css('border-color','#e51616').focus();
                    alert('请填写正确的手机号');
                    return false;
                    flag = false;
                }else{
                    $('.must-do').eq(i).css('border-color','#f9c44d');
                    $('#phone').css('border-color','#f9c44d');
                    flag= true;
                }

            }
        }

        if(flag){
            $.ajax({
                url: perUrl,
                type: 'POST',
                dataType: 'jsonp',
                jsonp: 'callbackjsonp',
                data:$('form').serialize(),
                success: function (result) {
                    if(result.code ==10000){
                        $('.vip-box').show();
                        $('.vip-box-wrap a').on('touchend',function(e){
                            e.preventDefault();
                            $('.vip-box').hide();
                            window.location.href = '/account/personal_vip.html';
                        });
                    }else{
                        alert(result.msg);
                    }
                }
            });
        }


    });
});
