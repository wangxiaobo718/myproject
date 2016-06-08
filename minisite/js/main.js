
/**
 * banner 倒计时
 * 使用GMT时间比较
 */
function countDown() {
	if ($('.date-panel .countdown').length < 1)
		return;

	var $elem = $('.date-panel .countdown'),
	limitGMT = $elem.data('timeArea') || 08, //时区
	limitTime = $elem.data('time') ? new Date($elem.data('time')) : new Date('2015/10/26 17:0:0'); //到期时间,firefox不支持短横分隔符，如2015-05-27格式

	(function interval() {
		var now = new Date();
		var GMT = now.getTimezoneOffset() / 60; //这里获得的时区为反数，如+8变为-8

		var limitSec = parseInt(limitTime.getTime() / 1000) - limitGMT * 60 * 60,
		nowSec = parseInt(now.getTime() / 1000) + GMT * 60 * 60,
		sec = limitSec - nowSec,
		min = parseInt(sec / 60),
		hour = parseInt(min / 60),
		day = parseInt(hour / 24),
		date = {
			day : day,
			hour : hour % 24,
			min : min % 60,
			sec : sec % 60
		};
		if (sec < 0) {
			return
		}
		$elem.find('.day').text(date.day);
		$elem.find('.hour').text(date.hour);
		$elem.find('.minute').text(date.min);
		$elem.find('.sec').text(date.sec);
		setTimeout(interval, 1000);
	})()

}

function share() {

	$(document).on("click", ".js-email-btn", function (e) {
		var title = $(this).attr("data-email-title") || "";
		var body = $(this).attr("data-email-body") || "";
		var email = $(this).attr("data-email-addr") || "information@huawei.com";
		var url = $(this).attr("data-email-url") || document.URL;

		title = title.replace("{网页title}", document.title);
		body = body.replace("{网页title}", document.title);
		body = body.replace("{网页url}", url);

		$(this).attr("href", "mailto:" + email + "?subject=" + title + " &body=" + body);

		//return false;
	})
	.on("click", ".js-print, .js-print-btn", function (e) {
		window.print();
		return false;
	})
	.on("click", ".js-fade-box-btn", function (e) {
		$(".js-body-not-close").filter(":visible").not($(this).attr("data-related-selector")).fadeOut(500);
		$($(this).attr("data-related-selector")).fadeToggle(500);
		return false;
	})
	.on("click", ".js-share-btn", function (e) {
		var $this = $(this);
		$($this.attr("data-related-selector")).css({
			"top" : $this.position().top - (50 * 5 + 10)
		});
		return false;
	})

	.on("click", ".js-share-item-btn", function (e) {
		var share_url_list = {
			"twitter" : "https://twitter.com/intent/tweet?url=%url%&text=%title%&via=huawei.com",
			"facebook" : "https://facebook.com/sharer.php?u=%url%&s=100&p[title]=%title%&p[summary]=%description%&p[url]=%url%&p[images][0]=%img%",
			"googleplus" : "https://plus.google.com/share?url=%url%",
			"weibo" : "http://service.weibo.com/share/share.php?url=%url%&title=%title%&pic=%img%&searchPic=true",
			"linkedin" : "http://www.linkedin.com/shareArticle?mini=true&url=%url%&title=%title%&summary=%description%&source=%url%",

		};
		var $this = $(this);
		var cmd = $this.attr("data-cmd");
		var title = $this.attr("data-share-title") || $this.parent().attr("data-share-title") || document.title;
		var description = $this.attr("data-share-description") || $this.parent().attr("data-share-description") || $("meta[name='description']").attr("content") || "";
		var img = $this.attr("data-share-img") || $this.parent().attr("data-share-img") || "";
		var url = $this.attr("data-share-url") || $this.parent().attr("data-share-url") || document.URL;
		description = encodeURIComponent(description);

		if (cmd == "weixin") {
			var weixin_qrcode = $("#js-weixin-qrcode");
			if (!weixin_qrcode.length)
				weixin_qrcode = $('<div id="js-weixin-qrcode" class="weixin-qrcode"/>').appendTo("body").wrap('<div class="hidden"/>');
			weixin_qrcode.children("div").remove().end().qrcode({
				render : "div",
				text : url,
				size : 250
			}).fadeIn();
			$("#fancyboxHandle").attr("href", "#js-weixin-qrcode").trigger("click");

			return false;
		}
		title = encodeURIComponent(title);
		img = encodeURIComponent(img);
		url = encodeURIComponent(url);
		var share_url = share_url_list[cmd] || "";
		share_url = share_url.replace("%title%", title);
		share_url = share_url.replace("%description%", description);
		share_url = share_url.replace(/%url%/g, url);
		share_url = share_url.replace("%img%", img);

		window.open(share_url);
		return false;
	});
}

function player_init() {
	// bof jwplayer
	(function ($) {
		$(function ($) {
			// bof dom ready
			// fancybox handler
			if ($.fn.fancybox)
				$('<a href="#" id="play_video_fancyboxTag"></a>').appendTo("body").fancybox({
					padding : 0,
					onClosed : function () {
						pauseVideo();
					}
				});

			var playerInstance = null;

			function pauseVideo(e) {
				try {
					if (playerInstance)
						playerInstance.destroyPlayer();
				} catch (_e) {}
			}

			$(document).on("click", ".js_video_player, .js-play-btn", function (e) {
				var playerid = $(this).attr("data-player-id") || 'playerContainer';
				var video_path = $(this).attr("data-video-path");
				var autostart = ($(this).attr("data-player-autostart") || "1") == "1";
				var ismobile = $(window).width() < 768;
				if (ismobile)
					video_path = $(this).attr("data-video-path-mobile") || video_path;

				if ($(this).attr("data-play-nopop")) {
					//$(this).next("img").fadeOut();
					playerInstance = initPlayer(playerid, video_path, $(this).attr("data-img-path"), autostart);

					setTimeout(function () {
						if (!ismobile && playerInstance && playerInstance.getState() != "PLAYING")
							playerInstance.play();
					}, 2000);
					$(this).hide();
					return false;
				}

				if (!$("#player_wrapper").length)
					$('<div style="display:none;"><div id="player_wrapper"></div></div>').appendTo("body");
				$("#play_video_fancyboxTag").attr("href", "#player_wrapper").trigger("click");
				if (playerInstance)
					playerInstance.destroyPlayer();
				$("#player_wrapper").empty();
				$('<div id="' + playerid + '"/>').appendTo("#player_wrapper");
				//$("#player_wrapper").show();
				playerInstance = initPlayer(playerid, video_path, $(this).attr("data-img-path"), autostart);
				playerInstance.onFullscreen = function (e) {
					console.log(e); //alert(e);
				};

				setTimeout(function () {
					if (playerInstance && playerInstance.getState() != "PLAYING")
						playerInstance.play();
				}, 2000);

				return false;
			});

			window.initPlayer = function (playerid, videoPath, imgSrc, autoplay) {
				//if(jwplayer(playerid))return;
				autoplay = autoplay || false;
				var video_width = '100%';
				var video_height = '100%';
				//var videoPath=$("#"+playerid).attr("data-video-path");
				//var imgSrc=$("#"+playerid).attr("data-img-path");
				var skinSrc = 'js/carbon.xml';
				var swfPlayer = 'js/player_new.swf';
				return jwplayer(playerid).setup({
					//stretching : 'exactfit',
					skin : skinSrc,
					aspectratio : "16:9",
					width : video_width,
					height : video_height,
					image : imgSrc,
					file : videoPath,
					flashplayer : swfPlayer,
					autostart : autoplay,
					ga : {}
				});
			};

			// eof dom ready
		});
	})(jQuery);
	// eof jwplayer


}

function eventBinding() {
	$(document).on("click", ".js-email-btn", function (e) {
		var title = $(this).attr("data-email-title") || "";
		var body = $(this).attr("data-email-body") || "";
		var email = $(this).attr("data-email-addr") || "information@huawei.com";
		var url = $(this).attr("data-email-url") || document.URL;

		title = title.replace("{title}", document.title);
		body = body.replace("{title}", document.title);
		body = body.replace("{url}", url);

		$(this).attr("href", "mailto:" + email + "?subject=" + title + " &body=" + body);

	})
.on("click", ".js_weixin", function (e) {
			$(".weixin-qr").slideToggle(); //.stop(true, true).fadeIn();
		})
	
	;
}

function mobile_nav(){
        $(document)
        .on("click", ".js-mobile-menu-open", function(e) {
            var $container = $("#container");
            if (!$container.hasClass("mobile-menu-open")) {
                huawei.navMenuMobile.open();
            } else {
                huawei.navMenuMobile.close();
            }
			return false;
        });
	
	}
var huawei={};
huawei.navMenuMobile= {
        
        open: function() {
            $("#container, #footer, .share_nullbox").addClass("mobile-menu-open");
            //$("#footer").css("top", $("#container").height());
            $("#tab_main_nav_mobile_container").addClass("mobile-menu-open");
        },
        
        close: function() {
            $("#tab_main_nav_mobile_next_container").removeClass("mobile-menu-open");
//            $("#footer").css("top", "initial")
            $("#tab_main_nav_mobile_container").removeClass("mobile-menu-open");
            $("#container, #footer, .share_nullbox").removeClass("mobile-menu-open");
            return;
        }
    
    };

huawei.index_wookmark = function () {
	var $container = $('.wookmark');
	if(!$container.length) return;
	$container.imagesLoaded(function () {
		// images have loaded
	}).always(function (instance) {
		console.log('all images loaded');
		// initialize
		$container.masonry({
			//columnWidth: 200,
			itemSelector : '[class*="col-sm-"]'
		});
	});
};

huawei.agenda_tabs=function(){
	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
};

	function pageTop () {
        $('<a/>', {
            'id': 'top'
        }).appendTo('body');
        $(window).scroll(function() {
            var $scrollTop = $(window).scrollTop();
            if ($scrollTop > $(window).height()/2) {
				if($('#top').is(":hidden"))
                $('#top').fadeIn();
            } else {
				if(!$('#top').is(":hidden"))
                $('#top').fadeOut();
            }
        });
        $(document).on("click", '#top, .js-goto-top', function() {
            $('body,html').animate({
                'scrollTop': 0
            });
        });
    }
(function ($) {
	$(function ($) {
		// fancybox handler
		if ($.fn.fancybox)
			$('<a href="#" id="fancyboxHandle"></a>').appendTo("body").fancybox({
				padding : 0
			});
$(document).on("click", ".js-goto-section-btn", function(e){
	if($(window).width()<992)
			$(".js-mobile-menu-open").first().trigger("click");
	            $('html, body').stop().animate({
                scrollTop: $($(this).attr("data-section-selector")).offset().top
            }, 700);
return false;
	});
	mobile_nav();
		countDown();
		share();
		player_init();
		eventBinding();
		pageTop ();
		huawei.index_wookmark();
		huawei.agenda_tabs();
	});
})(jQuery);
