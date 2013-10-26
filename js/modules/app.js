define(['controller', 'ga'], function(controller, ga){

	app = new Object();

	app.init = function(){
		controller.init();		
	}

	return app;
});