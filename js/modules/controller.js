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
		$buttons = $('.js-button');

	controller.init = function(){

		//DOM is ready at this point
		//Load in elements here
		$logo.removeClass('loading pulsing');
		window.setTimeout(function(){
			$parallax.removeClass('hidden');
		}, 1000);
		
		window.setTimeout(function(){
			$desktopNav.removeClass('hidden');
			$introText.removeClass('hidden');
			$body.removeClass('scrollLocked');
		}, 1600);

		window.setTimeout(function(){
			$introText.removeClass('introTrans');
			$parallax.removeClass('introTrans');
		}, 2600);


		//Bindings
		$(window).on('scroll', function(){
			controller._scroll();
		});

		$(window).on('keydown', function(e){
			if (e.keyCode == 13){
				


			};
		});

		$navHotspots.on('click', function(e){
			controller._scrollTo($navHotspots.index(this));
		})

		//tap = topActivePanel; ptap = previousTopActivePanel
		$jsContainer.on('panelChange', function(e, tap, ptap){
			
			//This is how we know it's a 2 to 3 transition!
			if (tap + ptap == 5){
				controller._backgroundSwitch();
			};

			//Update nav here
			controller._updateNav(tap, ptap);

		});

	};


	//PRIVATE FUNCTIONS BELOW

	//Would love to wrap the below in a IIFE somehow...?
	var previousTopActivePanel = 1;

	controller._scroll = function(){
		var docHeight = $(document).height(),
			windowHeight = $(window).height(),
			panelHeight = Math.max(500, windowHeight),
			scrollTop = $(document).scrollTop(),
			topActivePanel = Math.floor(Math.abs(scrollTop/panelHeight))+1,
			activePercentage = Math.min(1, 1-((scrollTop/panelHeight) - topActivePanel +1)),
			inverseActivePercentage = Math.abs((scrollTop/panelHeight) - topActivePanel +1);

			console.log('AP :'+activePercentage+' IAP :'+inverseActivePercentage);

			//Intro Text Parallax Effect
			$introText.css({
				//opacity:activePercentage,
				'padding-top':800*inverseActivePercentage+'px'
			});

			//Parallax Background
			$('.one').css({
				top:activePercentage*-20+'%'
			})

			//Trigger Dropins
			if (activePercentage < 0.4){
				var $me = $($panels[topActivePanel]).find($('.js-lasso'));

					$me.removeClass('hidden');
					window.setTimeout(function(){
						$me.removeClass('introTrans')
					}, 800);
				
				//Drop In Dudes
				if(topActivePanel == 2 && $($theyAreLinks[0]).hasClass('hidden')){
					var dudeCounter = 0;

					var dudeInterval = window.setInterval(function(){
						$($theyAreLinks[dudeCounter]).removeClass('hidden');
						dudeCounter++;

						if (dudeCounter == 6){
							clearInterval(dudeInterval);
						};

					}, 300);
				};

				//Drop in Projects
				if(topActivePanel == 3 && $($buttons[0]).hasClass('hidden')){
					var buttonCounter = 0;

					var buttonInterval = window.setInterval(function(){
						$($buttons[buttonCounter]).removeClass('hidden');
						buttonCounter++;

						if (buttonCounter == 4){
							clearInterval(buttonInterval);
						};

					}, 300);

				};
			};


			//Trigger for Panel Changes
			if (previousTopActivePanel != topActivePanel){
				$jsContainer.trigger('panelChange', [topActivePanel, previousTopActivePanel]);
			};

			//Update Top Active Panel
			previousTopActivePanel = topActivePanel;

			//Move Movers
			controller._movers();
	};

	controller._backgroundSwitch = function(){
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
		var windowHeight = $(window).height();

		$('html, body').animate({
			scrollTop: index*windowHeight+1
		}, 800);
	};

	controller._createMovers = function(){

	}

	controller._movers = function(){
		//EXPERIMENTAL MOVER STUFF
		function map_range(value, low1, high1, low2, high2) {
		    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		}

		var $movers = $('.js-mover');

		$.each($movers, function(){
			var $me = $(this),
				myMargin = $me.data('margin'),
				mySpeed = $me.data('speed'),
				$myParent = $me.parents('.js-panel'),
				$myParentIndex = $panels.index($myParent),
				$myParentOffset = $myParent.offset().top,
				$windowHeight = $(window).height(),
				$windowScrollTop = $(window).scrollTop(),
				$windowScrollTopNormalised = $windowScrollTop - ($windowHeight*($myParentIndex-2)),
				movementCoefficient = map_range($windowScrollTopNormalised/$windowHeight, 1, 3, 1, -1);

			$me.css({
				'margin-top': mySpeed*2*$windowHeight*movementCoefficient+'px'
			});

		});

	};

	return controller;
});