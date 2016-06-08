$(function(){
    $(".reg-box").removeClass("height");
	//表单验证
	var language = $('#submitBtn').attr('name');
	if(language == 'en'){
		var oemail = '<p class="prompt">A valid email address is required</p>';
        var otext = '<p class="prompt">this is required</p>';
        var opick = '<p class="prompt">Please choose at least one option</p>';
        var otextarea = '<p class="prompt">Please fill out at least 10 words</p>';
	} else {
        var oemail = '<p class="prompt">请填写正确的电子邮箱！</p>';
        var otext = '<p class="prompt">此项为必填项！</p>';
        var opick = '<p class="prompt">必选项，请至少选择一项！</p>';
        var otextarea = '<p class="prompt">必填项，请至少填写10个字以上！</p>';
	}

  	$(".input-wrap input[type=text]").bind("blur",textValid);
  	$(".input-wrap input[type=email]").bind("blur",emailValid);
  	$(".input-wrap select").bind("blur change",selectValid);
  	$(".pick input[type=radio]").bind("click",radioValid);
  	$(".pick input[type=checkbox]").bind("click",checkedValid);
  	$(".pick textarea").bind("blur",textareaValid);
  
    $('form').submit(function(){
        var through = $('.haveto').length;
        var $form = $('#LinkedIn-CustomComponent');
        var $trueLength = $form.find('.true').length;

        $(".input-wrap input[type=text]").trigger("blur");
        $(".input-wrap input[type=email]").trigger("blur");
        $(".input-wrap select").trigger("blur");

        $(".haveto input[type=hidden]").each(function(){
            var _this =$(this).parents('.haveto');
            var $currentValue = $(this).val();
            var prompt = _this.find('.prompt').length;
            if($currentValue==""){
                if (!prompt) {
                     _this.removeClass('true').find('p').addClass("textred").end().append(opick);
                }else{
                    return false;
                };
            }else {
                _this.addClass('true').find('p').removeClass("textred").end().find('.prompt').remove();
            }  
        })
        //思旭后台搜集信息，需打开下面注释
         if( $trueLength >= through ){
             $.cookie('name', 'ok', { expires: 365 });
         }else{
             return false;
         }

    })

    function postFn($form,callback){

        $.post("http://enterprise.huawei.com/enterpriseform/generalAction.do?method=save",$form.serialize(),function(data){
            //注册成功返回状态{}sucess
            //注册失败返回状态1、2
            //状态1表单和后台的表单字段数量对应不上
            //状态2 表单和后台的表单字段对应不上
            //根据状态去控制页面的操作
            if(data=="{}sucess"){
                //注册成功操作
               // console.log(data)

            	callback();
            }
            else if(data=="1"){
                console.log(data) 
                //注册失败1操作
            }
            else if(data=="2"){
                console.log(data)
                //注册失败2操作
            }else{}
        });
    }

	function callback(){
        $(".input-wrap input[type=text]").val('');
        $(".input-wrap input[type=email]").val('');
        $(".input-wrap select").val('');
        $(".pick textarea").val('');
        window.location = 'register-sucess.html';
        return false;
    }

 	function emailValid(){
        var _this = $(this).parents('.input-wrap');
        var ohaveto = _this.hasClass('haveto');
        var re =new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,5}$");
        var $currentValue = $(this).val().replace(/(^\s*)|(\s*$)/g, "");
        var prompt = _this.find('.prompt').length;
        if(ohaveto) {
            if($currentValue=="" || !re.test($currentValue)){
                if(!prompt) {
                    _this.removeClass('true').find('input[type=email]').addClass("red").end().append(oemail);
                }else{
                    return false;
                };
            }else {
                _this.addClass('true').find('input[type=email]').removeClass("red").end().find('.prompt').remove();
            }  
        }
    }

	function textValid(){
        var _this = $(this).parents('.input-wrap');
        var ohaveto = _this.hasClass('haveto');
	    var $currentValue = $(this).val().replace(/(^\s*)|(\s*$)/g, "");
        var prompt = _this.find('.prompt').length;

        if(ohaveto) {
            if($currentValue==""){
                if(!prompt) {
                    $(".reg-box").addClass("height");
                    _this.removeClass('true').find('input[type=text]').addClass("red").end().append(otext);
                }else{
                    return false;
                };
            }else {
                _this.addClass('true').find('input[type=text]').removeClass("red").end().find('.prompt').remove();
            }  
        }
    }

	function selectValid(){
	    var _this = $(this).parents('.input-wrap');
        var ohaveto = _this.hasClass('haveto');
	    var $currentValue = $(this).val();
        var prompt = _this.find('.prompt').length;
        if(ohaveto) {
            if($currentValue==""){
                if(!prompt) {
                    $(".reg-box").addClass("height");
                    _this.removeClass('true').find('select').addClass("red").end().append(otext);
                }else{
                    return false;
                };
            }else {
                _this.addClass('true').find('select').removeClass("red").end().find('.prompt').remove();
            }  
        }
    }

    function radioValid(){
        var _this = $(this).parents('.pick');
        var ohaveto = _this.hasClass('haveto');
        var $currentValue = $(this).val();
        var prompt = _this.find('.prompt').length;
        _this.find('input:hidden').val($currentValue);
        if(ohaveto){
            if ($currentValue == '') {
                if(!prompt) {
                    _this.removeClass('true').find('p').addClass("textred").end().append(opick);
                }else{
                    return false;
                };
            }else{
                _this.addClass('true').find('p').removeClass("textred").end().find('.prompt').remove();
            }
        }
    };

    function checkedValid(){
        var _this = $(this).parents('.pick');
        var ohaveto = _this.hasClass('haveto');
        var $currentValue = '';
	    var prompt = _this.find('.prompt').length;
        _this.find('input:checked').each(function(index,element){
            $currentValue += $(this).val()+',';
        })
        _this.find('input:hidden').val($currentValue);
        if(ohaveto) {
            if ($currentValue == '') {
                if(!prompt) {
                    _this.removeClass('true').find('p').addClass("textred").end().append(opick);
                }else{
                    return false;
                };
            }else{
                _this.addClass('true').find('p').removeClass("textred").end().find('.prompt').remove();
            }
        }
    }

    function textareaValid() {
        var _this = $(this).parents('.pick');
        var ohaveto = _this.hasClass('haveto');
	    var $currentValue = _this.find('textarea').val().replace(/(^\s*)|(\s*$)/g, "");
	    var	$currenlength = $currentValue.length;
	    var prompt = _this.find('.prompt').length;
        _this.find('input:hidden').val($currentValue);
        if(ohaveto) {
            if ($currenlength < 10) {
                if(!prompt) {
                    $(".reg-box").addClass("height");
                    _this.removeClass('true').find('p').addClass("textred").end().append(opick);
                }else{
                    return false;
                };
            }else{
                _this.addClass('true').find('p').removeClass("textred").end().find('.prompt').remove();
            }
        }
    }


});


	
	