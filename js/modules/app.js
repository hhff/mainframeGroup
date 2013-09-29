define(['controller'], function(controller){

	app = new Object();

	app.init = function(){
		controller.init();		
	}

	return app;
});