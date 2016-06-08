//head中的adobedtm用动态方式引入，解决加载慢的问题
/*$(window).load(function(){
		var s = document.createElement('script');
		s.src = '//assets.adobedtm.com/852e96eed9e29df1fb13035d1f233bb8c2c56c8a/satelliteLib-a647f567a5845369df41d9808a92ab370cc03e8f.js';
		var x = document.getElementsByTagName('head')[0];
		x.appendChild(s);			
		console.log(x.innerHTML);
});*/


//如果页面加载完成，则移除loading
$(window).load(function(){
	$(".loader").fadeOut();						
});


//IE8下 限制宽度
		$(window).bind("load resize",function(){
				if( document.documentMode==8 ){
						var windowH = $(window).width();
						if( windowH<=1200 ){
								$(".footer").css("width", 1200);
						}else{
							$(".footer, .grayBg").css("width", "auto");
						}
				}
		});
//banner轮播 start
		var windowH = $(window).width(),
			bannerLen = $(".banner2 li").length,
			index, t;
		//设置banner UL的宽度
		$(window).bind("load resize",function(){
				windowH = $(window).width();
				index = $(".pagesBottom span.current").index();
				if( document.documentMode==8 ){
						if( windowH<=1200 ){
								$(".banner2, .banner2 li").width(1200);
								$(".banner2 ul").width(1200*bannerLen);	
								if(index==0){
										$(".banner2 ul").css({"margin-left": 0});
								}else if(index==1){
										$(".banner2 ul").css({"margin-left": -1200+"px"});
								}
								
						}else{
								$(".banner2").width("auto");
								$(".banner2 li").width(windowH);
								$(".banner2 ul").width(windowH*bannerLen);
								if(index==0){
										$(".banner2 ul").css({"margin-left": 0});
								}else if(index==1){
										$(".banner2 ul").css({"margin-left": -windowH+"px"});
								}
						}
				}else{
					$(".banner2 li").width(windowH);
					$(".banner2 ul").width(windowH*bannerLen);
					if(index==0){
							$(".banner2 ul").css({"margin-left": 0});
					}else if(index==1){
							$(".banner2 ul").css({"margin-left": -windowH+"px"});
					}
				}
		});
		//点击切换
		$(".pagesBottom span").click(function(){
				clearInterval(t);
				$(this).addClass("current").siblings().removeClass("current");						  					  
				index = $(this).index();
				if( document.documentMode==8 && windowH<=1200){
						if(index==0){
								$(".banner2 ul").animate({
									"margin-left": 0				 
								}, 600, interval);
						}else if(index==1){
								$(".banner2 ul").animate({
									"margin-left": -1200+"px"						 
								}, 600, interval);
						}
				}else{
						if(index==0){
								$(".banner2 ul").animate({
									"margin-left": 0				 
								}, 600, interval);
						}else if(index==1){
								$(".banner2 ul").animate({
									"margin-left": -windowH+"px"						 
								}, 600, interval);
						}
				}
		});
		//自动轮播
		var interval = function(){
				t = setInterval(function(){
					if( document.documentMode==8 && windowH<=1200){
							if(index==0){
									index = 1;
									$(".banner2 ul").animate({
										"margin-left": -1200+"px"		 
									},600);
							}else if(index==1){
									index = 0;
									$(".banner2 ul").animate({
										"margin-left": 0						 
									},600);
							}
					}else{
						if(index==0){
								index = 1;
								$(".banner2 ul").animate({
									"margin-left": -windowH+"px"		 
								},600);
						}else if(index==1){
								index = 0;
								$(".banner2 ul").animate({
									"margin-left": 0						 
								},600);
						}
					}
					$(".pagesBottom span").eq(index).addClass("current").siblings().removeClass("current");
			}, 5000);
		}
		interval();
//banner轮播 end

//菜单hover效果
		var currentItem = $("#nav a.current").index(),
				navLineWidth = parseInt($("#navLine").width()),
				space = currentItem*navLineWidth-navLineWidth;
		$("#nav a").hover(function(){
				var index = $(this).index(),
				space2 = index*navLineWidth-navLineWidth;
				$("#navLine").css("transform", "translateX(" + space2 + "px)");
		}, function(){
				$("#navLine").css("transform", "translateX(" + space + "px)");
		});
//菜单当前项指示
	$(window).bind("load resize",function(){
			currentItem = $("#nav a.current").index();
			navLineWidth = parseInt($("#navLine").width());
			space = currentItem*navLineWidth-navLineWidth;
			$("#navLine").css("transform", "translateX(" + space + "px)");
			if( document.documentMode==8 ){
				$("#navLine").css("margin-left", space + "px");
			}

	});

//链接点击时，检测用户是否注册
		$(".desc_content a, .caiyeji a, .anliji a, .floatList.download a").click(function(){
				if($.cookie('name')){
						return true;
				}else{
						window.location.href = "register.html?source=" + document.getElementById('source').value;						
						return false;
				}
		})
		var source_ = getQueryStringParamValue("source");
		$("#source").val(source_);
		function getQueryStringParamValue(strQStrParam){
			var defaultValue = null;
			var strURL = document.location.href;
			var strQStrParamValue = '';
			if (strURL.indexOf('?') != -1) {
				strQStrParamValue = strURL.substr(strURL.indexOf('?') + 1);
				if (strQStrParamValue.indexOf(strQStrParam) != -1) {
					strQStrParamValue = strQStrParamValue.substr(strQStrParamValue.indexOf(strQStrParam));
					strQStrParamValue = strQStrParamValue.substr(strQStrParamValue.indexOf('=') + 1);
					if (strQStrParamValue.indexOf('&') != -1)
						strQStrParamValue = strQStrParamValue.substr(0, strQStrParamValue.indexOf('&'));
					return strQStrParamValue;
				} else {
					strQStrParamValue = defaultValue;
					return strQStrParamValue;
				}
			} else {
				strQStrParamValue = defaultValue;
				return strQStrParamValue;
			}
		}

//注册成功后 改写cookie值
		if ($.cookie('name') == 'ok') {
				$.cookie('name', 'success', { expires: 365 });
		};



//大事件展开
		$(".eventList .listTitle").click(function(){
				$(this).next(".listContent").slideToggle();								  
		});


//案例分享位移动效
		$(".tuwen .liBox").hover(function(){
				$(this).addClass("hover");
		},function(){
				$(this).removeClass("hover");
		})


//案例分享图片区域高度自适应
		$(".floatList.tuwen .listImg").each(function(){
				var imgH = $(this).find("img").height();
				$(this).height(imgH);
				
		});
//案例分享图片区域高度自适应
		$(window).bind("resize", function(){
				$(".floatList.tuwen .listImg").each(function(){
						var imgH = $(this).find("img").height();
						$(this).height(imgH);	
				});	
		});

//移动端 菜单显示动效
		$("#topMenu").click(function(){
				$(this).toggleClass("show");
				$("#nav").toggleClass("show");	
				$("#wrapper").toggleClass("move");
		});

//视频播放事件
		var flashVedioPlayerInit = function(){
				var skinSrc='flash/ent_cn_huaweie.xml'
			   var swfPlayer='flash/player.swf';
			   var $videoWidth = $(window).width()>=768?800:$(window).width()-80;
			   var $videoHeight = $videoWidth*9/16; 
			   //$('a.vedioparam').fancybox({width:800,height:450,autoDimensions:false});
			   $('a.vedioparam').attr("href","#flash_player");
			   $("#fancybox-wrap").css('left',40);
			   $('a.vedioplay').each(function(index, element) {
						 $(this).click(function(){
								  var v = $(this).parent().find('.vedioparam:eq(0)');            
								  var flashPlayId = "flash_player" + index;
								  if(index>0){ $("#fancybox-content").empty().attr("style",'');}
								  //HuaWei.page.flashVedioPlayer('flash_player',v.attr('flafile'),$videoWidth,v.attr('vedioheight'),'true');
								  $('#flash_player').css({'width':$videoWidth+'px','height':$videoHeight+'px'});
		
								  $('a.vedioparam').fancybox({
										   content:"<div id="+flashPlayId+"></div>",
											  hideOnContentClick: false,
											  width:$videoWidth,
											  height:$videoHeight,
											  autoDimensions:false, 
											  onComplete: function() {
													   
															  jwplayer(flashPlayId).setup({
															  'stretching':'exactfit',
															  'width':$videoWidth,
															  'height':$videoHeight,
															  'flashplayer': swfPlayer,
															  'skin':skinSrc,
															  'id': flashPlayId,
															  'autostart': true,
															  'file': v.attr('flafile'),
																ga:{}
															  });
															  
											 },
											 onCleanup: function() {
													   
													 jwplayer(flashPlayId).stop();
													
													 if($("#fancybox-wrap").attr("class")){
															  
															  $("#fancybox-overlay").unbind();
															  $("#fancybox-content").unbind();
															  $("#fancybox-wrap").unbind();
															  $(window).unbind("resize.fb scroll.fb");
															  $(document).unbind('keydown.fb');
															  $("#fancybox-overlay").fadeOut('fast');
															  $("#fancybox-wrap").animate({width:'hide',height:'hide'}, 300);
															  $("#fancybox-close").hide();
			   
															  return false;
													 }
										   }
								  });
								  v.trigger('click');
						 });
		  }); 
		};
		
		if( $("a.vedioplay").length>0 ){
			flashVedioPlayerInit();
		}


//大事件轮播 大事件回顾
		$(".monthList li").click(function(){				  
				var index = $(this).index(".monthList li");
				var imgList = $(".imgScroll");
				var liLen = $(".monthList li").length
				//alert(index);
				$(".imgScroll li").removeClass("current").removeClass("pre").removeClass("next");
				$(".imgScroll li").eq(index).addClass("current");
			
				
				if( index==0 ){
					$(".imgScroll li").eq(liLen-1).addClass("pre");
					$(".imgScroll li").eq(index).next().addClass("next");	
				}else if( index==liLen-1 ){
					$(".imgScroll li").eq(0).addClass("next");
					$(".imgScroll li").eq(index).prev().addClass("pre");
				}else{
					$(".imgScroll li").eq(index).prev().addClass("pre");
					$(".imgScroll li").eq(index).next().addClass("next");	
				}
				
				//月份圆点状态改变
				$(".monthList li").removeClass("current");
				$(this).addClass("current");
});

//大会主题TAB 峰会介绍
		$(".titleTab li").click(function(){
				var index = $(this).index();
				$(this).addClass("current").siblings().removeClass("current");
				$(this).parent().next(".contentTab").find("li").eq(index).addClass("current").siblings().removeClass("current");
		});


//展厅图片轮播
//下一张
		$(".imgListWrap .btn.nextBtn").click(function(){
				var index = $(".imgList li.current").index();
				var liLen = $(".imgList li").length;
				var current, pre, next;
				if( index==liLen-2 ){
					current = index+1;
					pre = index;
					next = 0
				}else if( index==liLen-1 ){
					return;
					current = 0;
					pre = index;
					next = 1;
				}else{
					current = 	index+1;
					pre = index;
					next = index+2;
				}
				$(".imgList li").removeAttr("class");
				$(".imgList li").eq(current).addClass("current"); //下一项
				$(".imgList li").eq(pre).addClass("pre"); //当前项
				$(".imgList li").eq(next).addClass("next"); //下两项
		});
//上一张
		$(".imgListWrap .btn.prevBtn").click(function(){
				var index = $(".imgList li.current").index();
				var liLen = $(".imgList li").length;
				var current, pre, next;
				if( index==1 ){
					current = index-1;
					pre = liLen-1;
					next = index
				}else if( index==0 ){
					return;
					current = liLen-1;
					pre = liLen-2;
					next = index;
				}else{
					current = 	index-1;
					pre = index;
					next = index-2;
				}
				$(".imgList li").removeAttr("class");
				$(".imgList li").eq(current).addClass("current"); //下一项
				$(".imgList li").eq(pre).addClass("pre"); //当前项
				$(".imgList li").eq(next).addClass("next"); //下两项
		});



//兼容IE8的placeholder插件
		placeholderfun();
		function placeholderfun() {
			if (!('placeholder' in document.createElement('input'))) {
				function GetStringNumValue(pxstr) {
					return pxstr.substring(0, pxstr.length - 2);
				}
		
				$('.form-con input[placeholder]').each(function () {
					var $element = $(this),
							placeholder = $element.attr('placeholder');
					if ($element.attr('type') != 'password') {//非密码
						if ($element.val() === "") {
							$element.val(placeholder).addClass('placeholder');
							$element.css('color', '#aaa');
						}
						$element.focus(function () {
							if ($element.val() === placeholder) {
								$element.val("").removeClass('placeholder');
								$element.css('color', '#333');
							}
						}).blur(function () {
							if ($element.val() === "") {   //if($element.val()==="" &&  ($element.attr('type') != 'password')){
								$element.val(placeholder).addClass('placeholder');
								$element.css('color', '#aaa');
							} else if ($element.val() == placeholder) {
								$element.css('color', '#aaa');
							} else {
								$element.css('color', '#333');
							}
						}).closest('form').submit(function () {
							if ($element.val() === placeholder) {
								$element.val('');
							}
						});
					} else {//密码框
						if (placeholder) {
							// 文本框ID
							var elementId = $element.attr('id');
							if (!elementId) {
								var now = new Date();
								elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
								$element.attr('id', elementId);
							}
						}//end of if (placeholder)
						 // 添加label标签，用于显示placeholder的值
						var $label = $('<label>', {
							html: $element.val() ? '' : placeholder,
							'for': elementId,
							css: {
								position: 'absolute',
								cursor: 'text',
								color: '#aaaaaa',
								fontSize: $element.css('fontSize'),
								fontFamily: $element.css('fontFamily')
							}
						}).insertAfter($element);
						// 绑定事件
						var _setPosition = function () {
							$label.css({
								left: '60px',
								top: '10px'
							});
						};
						var _resetPlaceholder = function () {
							if ($element.val()) {
								$label.html(null);
							}
							else {
								_setPosition();
								$label.html(placeholder);
							}
						};
						_setPosition();
						$element.on('focus blur input keyup propertychange resetplaceholder', _resetPlaceholder);
					}
				});
			}
		}
