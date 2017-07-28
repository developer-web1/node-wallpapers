var win_h = win_w = 0;
var $wallpapersScope = null;

function header_resize() {
	$("header .header-container").height($(window).height());
}

function header_init() {
	$(".header-bar").css('display', 'block');

	header_resize();

	$("header").mCustomScrollbar({
		scrollInertia: 300,
		contentTouchScroll: 100,
		callbacks: {
			onScrollStart: function (el) {
				var header_sb = $("header .mCSB_scrollTools");
				header_sb.addClass('active');
			},
			onScroll: function (el) {
				var header_sbb = $("header .mCSB_scrollTools");
				header_sbb.removeClass('active');
			}
		}
	});

	$("header nav a").click(function (event) {
		var elem = $(this);
		if ($(this).parent().children('ul').length > 0) {

			event.preventDefault();

			if (!$(this).parent().find('> ul a').hasClass('active')) {
				elem.toggleClass('active');
			}

			$(this).parent().find('> ul').stop().slideToggle(300, function () {

				$('header').mCustomScrollbar("update");
			});
		}

		var category = elem.attr("data-category");
		if (category) {
			$wallpapersScope.$apply("chooiseCategory(" + category + ")");
		}
	});

	//=========== Refresh ===========
	$(window).resize(function (event) {
		$('header').mCustomScrollbar("update");
	});

	// =========== Header Buttons ===========
	$("header .close-btn, .header-bar .menu-nav").click(function (event) {

		event.preventDefault();

		$("header, .header-bar").toggleClass('active');
		$("body").toggleClass('menu-visible');
	});
}

function completedLoad() {
	$wallpapersScope.$apply(function () {
		$wallpapersScope.loadCategory()
		$wallpapersScope.loadImage(30);
	});
}

function custom_scrollbar() {
	$("body").mCustomScrollbar({
		scrollInertia: 800,
		mouseWheelPixels: 400,
		contentTouchScroll: 400,
		keyboard: {
			enable: true,
			scrollAmount: 400,
			scrollType: "stepped"
		},
		callbacks: {
			whileScrolling: function (el) {
				$.force_appear();
			},
			onScrollStart: function (el) {
				var body_sb = $("body .mCSB_scrollTools");
				body_sb.addClass('active');
			},
			onScroll: function (el) {
				var body_sbb = $("body .mCSB_scrollTools");
				body_sbb.removeClass('active');
			},
			onTotalScroll: function (el) {
				$wallpapersScope.$apply("loadImage(12)");
			}
		}
	});
}

// =========== Animation ===========
function play_animation() {

	$(".gallery-grid").imagesLoaded(function () {

		$('.animated').each(function (index, el) {

			var current = $(this);

			current.appear();

			current.on('appear', function () {

				var animation = current.attr('data-animation');
				if (!current.hasClass('visible')) {

					var animationDelay = current.attr('data-animation-delay');
					if (animationDelay) {

						setTimeout(function () {
							current.addClass(animation + " visible");
						}, animationDelay);

					} else {
						current.addClass(animation + " visible");
					}
				}
			});

			if (current.is(':appeared') && !current.hasClass('visible')) {

				var animation = current.attr('data-animation');
				var animationDelay = current.attr('data-animation-delay');

				if (animationDelay) {

					setTimeout(function () {
						current.addClass(animation + " visible");
					}, animationDelay);

				} else {
					current.addClass(animation + " visible");
				}
			}
		});
	});
}

function page_resize() {
	$(".grid-row.page-simple").width($("body").width());
	$(".grid-row.page-simple").height($("body").height());
}

$(function () {
	$wallpapersScope = angular.element(document.getElementById("WallpapersApp")).scope();

	win_h = $(window).height();
	win_w = $(window).width();

	$("body").queryLoader2({
		barColor: "#ffffff",
		backgroundColor: "#121212",
		percentage: true,
		barHeight: 1,
		fadeOutTime: 500,
		maxTime: 500000,
		onComplete: function () {
			completedLoad();
		}
	});

	$("body").fitVids();

	$("body").imagesLoaded(function () {
		header_resize();
		page_resize();
		play_animation();
		//custom_scrollbar();
	});

	$(window).resize(function (event) {
		header_resize();
		page_resize();

//		portfolio_m_init();
	});
});