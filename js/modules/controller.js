define(['jquery'], function($){


	//Should move some of this code to a "view" module.
	var controller = new Object();

	//View Globals
	var $jsContainer = $('.js-container'),
		$navHotspots = $('.js-hotspot'),
		$navCircles = $('.js-circle'),
		$logo = $('.js-logo'),
		$desktopNav = $('.js-desktopNav'),
		$body = $('.js-body'),
		$parallax = $('.js-parallax'),
		$introText = $('.js-intro'),
		$panels = $('.js-panel'),
		$theyAreLinks = $('.js-theyAre'),
		$buttons = $('.js-button'),
		$touchToggle = $('#touchToggle'),
		$mobileNav = $('nav, #mobile'),
		$menuLinks = $('.menuLink'),
		mobileNavAnimating = false,
		initialScroll = true,
		validEmail = false,
		formVal = null,
		$videoLoop = $('#outroVid'),
		$window = $(window),
		videoFactor = 720 / 1280,
		$parallaxOne = $('.one'),
		$parallaxTwo = $('.two'),
		$outro = $('#outro'),
		$intro = $('#intro');

	controller.init = function(){

		controller._setupSizeCover();

		//Email Validation
		$('#email').on('keyup', function(){
			formVal = $(this).val();
			if (controller._validateEmail(formVal) == true){
				validEmail = true;
				$('#submitButton, #arrow').removeClass('invalid');
			}else{
				validEmail = false;
				$('#submitButton, #arrow').addClass('invalid');
			}

			if (!formVal){
				$('#submitButton, #arrow').addClass('invalid');
			}
		});

		$('#js-emailForm').submit(function(e){
			if (validEmail == true){
				//submit
			}else{
				e.preventDefault();
				//no submit
			}
		})

		$window.on('resize', function(){
			controller._setupSizeCover();
		});

		//DOM is ready at this point
		//Load in elements here
		$mobileNav.removeClass('loading');
		$logo.removeClass('loading pulsing');
		window.setTimeout(function(){
			$parallax.removeClass('hidden');
			$('.triangle').removeClass('loading');
			$('nav, #mobile').addClass('menuTrans');
		}, 1500);
		
		window.setTimeout(function(){
			$desktopNav.removeClass('hidden');
			$introText.removeClass('hidden');
			$body.removeClass('scrollLocked');
		}, 2500);

		window.setTimeout(function(){
			$introText.removeClass('introTrans');
			$parallax.removeClass('introTrans');
		}, 3300);


		//Bindings
		$(window).on('scroll', function(){
			controller._scroll();
		});

		//Passwords
		$('.js-password').on('keyup', function(e){
			controller._passwordHandler(this, e);
		})

		$('#scrollToTop').on('click touchstart',function(){
			$mobileNav.removeClass('active');
			controller._phoneScrollTop();
		})

		//Desktop Scroll
		$navHotspots.on('click', function(e){
			controller._scrollTo($navHotspots.index(this));
		})

		//Phone Scroll
		$menuLinks.on('click touchstart', function(e){
			$mobileNav.toggleClass('active');
			controller._phoneScrollTo($menuLinks.index(this) +1);
		})

		//Toggle Phone Menu
		var flag = false;
		$touchToggle.on('click touchstart', function(){

		if (!flag) {
			flag = true;
			setTimeout(function(){ flag = false; }, 100);
			$mobileNav.toggleClass('active');
		}

		return false
		})

		//tap = topActivePanel; ptap = previousTopActivePanel
		$jsContainer.on('panelChange', function(e, tap, ptap){
			//This is how we know it's a 2 to 3 transition!
			if (tap + ptap == 5){
				controller._backgroundSwitch(tap, ptap);
			};

		});

		$('#submitButton').on('click', function(){
			$('#js-emailForm').submit();
		})

	};


	//PRIVATE FUNCTIONS BELOW

	controller._passwordHandler = function(me, e){

		var inputName = $(me).attr("name");		

		switch(inputName){
			case "nada":
				if ($(me).val() == "nadamfg"){
					window.open('http://www.bit.ly/nadamfg','_blank');
					$(me).val("");
				}
				break;
			case "mainframe":
				if ($(me).val() == "mainframe"){
					window.open('http://www.themainframe.is','_blank');
					$(me).val("");
				}
				break;
			case "motion":
				if ($(me).val() == "motionmfg"){
					window.open('http://www.bit.ly/motionmfg','_blank');
					$(me).val("");
				}
				break;
			case "vegas":
				if ($(me).val() == "100mfg"){
					window.open('http://www.bit.ly/100mfg','_blank');
					$(me).val("");				
				}
				break;
		};
	}

	//Would love to wrap the below in a IIFE somehow...?
	var previousTopActivePanel = 1,
		previousNavPanel = 1;

	controller._scroll = function(){
		var docHeight = $(document).height(),
			windowHeight = $(window).height(),
			panelHeight = Math.max(500, windowHeight),
			scrollTop = Math.max(0, $(document).scrollTop()),
			navPanel = Math.floor(Math.abs((scrollTop+(panelHeight*0.25))/panelHeight))+1,
			topActivePanel = Math.floor(Math.abs((scrollTop)/panelHeight))+1,
			activePercentage = Math.min(1, 1-((scrollTop/panelHeight) - topActivePanel +1)),
			inverseActivePercentage = Math.abs((scrollTop/panelHeight) - topActivePanel +1);

			if (initialScroll){
				$('html, body').animate({
					scrollTop:0
				}, 0);
				initialScroll = false;
			}

			//console.log('AP :'+activePercentage+' IAP :'+inverseActivePercentage);

			//console.log($panels);

			//Intro Text Parallax Effect
			// $introText.css({
			// 	//opacity:activePercentage,
			// 	'padding-top':800*inverseActivePercentage+'px'
			// });

			//Performance tweaks
			if (topActivePanel >= 3){
				$outro.removeClass('hidden');
				$intro.addClass('hidden');
			}else{
				$outro.addClass('hidden');
				$intro.removeClass('hidden');
			}

			//Parallax Background
			var parallaxOneTranslate = ((inverseActivePercentage*0.90)-0.15)*windowHeight*1.2;

			$parallaxOne.css({
				'-webkit-transform': 'translate3d(0px,'+parallaxOneTranslate+'px,0px)',
				'-moz-transform': 'translate3d(0px,'+parallaxOneTranslate+'px,0px)',
				'-ms-transform': 'translate3d(0px,'+parallaxOneTranslate+'px,0px)',
				'-o-transform': 'translate3d(0px,'+parallaxOneTranslate+'px,0px)',
				'transform': 'translate3d(0px,'+parallaxOneTranslate+'px,0px)',
			})

			var parallaxTwoTranslate = ((inverseActivePercentage*0.80)-0.05)*windowHeight*1.1;

			$parallaxTwo.css({
				'-webkit-transform': 'translate3d(0px,'+parallaxTwoTranslate+'px,0px)',
				'-moz-transform': 'translate3d(0px,'+parallaxTwoTranslate+'px,0px)',
				'-ms-transform': 'translate3d(0px,'+parallaxTwoTranslate+'px,0px)',
				'-o-transform': 'translate3d(0px,'+parallaxTwoTranslate+'px,0px)',
				'transform': 'translate3d(0px,'+parallaxTwoTranslate+'px,0px)',
			})

			//OTHER IDEA?
			//Make ParallaxTwo fixed
			// $parallaxTwo.css({
			// 	'opacity':activePercentage*0.7
			// })


			// $introText.css({
			// 	'-webkit-transform': 'translate(0%,'+((inverseActivePercentage*40)-50)+'%)',
			// 	'-moz-transform': 'translate(0%,'+((inverseActivePercentage*40)-50)+'%)',
			// 	'-ms-transform': 'translate(0%,'+((inverseActivePercentage*40)-50)+'%)',
			// 	'-o-transform': 'translate(0%,'+((inverseActivePercentage*40)-50)+'%)',
			// 	'transform': 'translate(0%,'+((inverseActivePercentage*40)-50)+'%)',
			// })

			//Trigger Dropins
			if (activePercentage < 0.4){
				var $me = $($panels[topActivePanel]).find($('.js-lasso'));

					$me.removeClass('hidden');
					window.setTimeout(function(){
						$me.removeClass('introTrans')
					}, 800);
				
				//Drop In Dudes
				if(topActivePanel == 3 && $($theyAreLinks[0]).hasClass('hidden')){
					var dudeCounter = 0;

					var dudeInterval = window.setInterval(function(){
						$($theyAreLinks[dudeCounter]).removeClass('hidden');
						dudeCounter++;

						if (dudeCounter == 6){
							clearInterval(dudeInterval);
						};

					}, 200);
				};

				//Drop in Projects
				if(topActivePanel == 2 && $($buttons[0]).hasClass('hidden')){
					var buttonCounter = 0;

					var buttonInterval = window.setInterval(function(){
						$($buttons[buttonCounter]).removeClass('hidden');
						buttonCounter++;

						if (buttonCounter == 4){
							clearInterval(buttonInterval);
						};

					}, 200);

				};
			};


			//Trigger for Panel Changes
			if (previousTopActivePanel != topActivePanel){
				$jsContainer.trigger('panelChange', [topActivePanel, previousTopActivePanel]);
			};

			if (previousNavPanel != navPanel){
				controller._updateNav(navPanel, previousNavPanel);
			}

			//Update Top Active Panel
			previousTopActivePanel = topActivePanel;
			previousNavPanel = navPanel;

			//Move Movers
			//controller._movers();
	};

	controller._backgroundSwitch = function(tap, ptap){
		var $jsBackground = $('.js-background');

		$.each($jsBackground, function(){
			$(this).toggleClass('active');
		});
	};

	controller._updateNav = function(tap, ptap){
		$($navCircles[tap-1]).addClass('active');
		$($navCircles[ptap-1]).removeClass('active');
	};

	controller._scrollTo = function(index){
		initialScroll = false;
		var windowHeight = $(window).height();

		$('html, body').animate({
			scrollTop: index*windowHeight+1
		}, 800);
	};

	controller._phoneScrollTop = function(){
		initialScroll = false;
		$('html, body').animate({
			scrollTop: 0
		}, 1);
	};

	controller._phoneScrollTo = function(index){
		initialScroll = false;
		var phoneScroll = 0,
			windowHeight = $(window).height();

		switch(index){
			case 1:
		  		phoneScroll = $('#believe').offset().top;
		  		break;
			case 2:
		  		phoneScroll = $('#theyare').offset().top;
		  		break;
			case 3:
		  		phoneScroll = $('#building').offset().top;
		  		break;
			case 4:
		  		phoneScroll = $('#outro').offset().top;
		  		break;
		}

		$('html, body').animate({
			scrollTop: (phoneScroll - (windowHeight*0.12))
		}, 1);
	};

	controller._validateEmail = function(email){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}


	controller._setupSizeCover = function() {
		windowHeight = $window.height();
		windowWidth = $window.width();
		windowFactor = windowHeight/windowWidth;
		coverWidth = windowHeight/videoFactor;
		coverHeight = windowWidth*videoFactor;
		coverTranslateX = (coverWidth - windowWidth) / 2;
		coverTranslateY = (coverHeight - windowHeight) / 2;

		if (windowFactor >= videoFactor){
			$videoLoop.css({
				height: windowHeight,
				width: windowHeight/videoFactor,
				'transform': 'translate('+(-coverTranslateX)+'px,0px)',
				'-ms-transform': 'translate('+(-coverTranslateX)+'px,0px)',
				'-webkit-transform': 'translate('+(-coverTranslateX)+'px,0px)',
			})
		}else if (windowFactor < videoFactor){
			$videoLoop.css({
				width: windowWidth,
				height: windowWidth*videoFactor,
				'transform': 'translate(0px,'+(-coverTranslateY)+'px)',
				'-ms-transform': 'translate(0px,'+(-coverTranslateY)+'px)',
				'-webkit-transform': 'translate(0px,'+(-coverTranslateY)+'px)',
			})
		}
	}

	// controller._movers = function(){
	// 	//EXPERIMENTAL MOVER STUFF
	// 	function map_range(value, low1, high1, low2, high2) {
	// 	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	// 	}

	// 	var $movers = $('.js-mover');

	// 	$.each($movers, function(){
	// 		var $me = $(this),
	// 			myMargin = $me.data('margin'),
	// 			mySpeed = $me.data('speed'),
	// 			$myParent = $me.parents('.js-panel'),
	// 			$myParentIndex = $panels.index($myParent),
	// 			$myParentOffset = $myParent.offset().top,
	// 			$windowHeight = $(window).height(),
	// 			$windowScrollTop = $(window).scrollTop(),
	// 			$windowScrollTopNormalised = $windowScrollTop - ($windowHeight*($myParentIndex-2)),
	// 			movementCoefficient = map_range($windowScrollTopNormalised/$windowHeight, 1, 3, 1, -1);

	// 		$me.css({
	// 			'margin-top': mySpeed*2*$windowHeight*movementCoefficient+'px'
	// 		});

	// 	});

	// };

	return controller;
});