(function() {
	var allWindows = [];

	var getAll = function() {
		chrome.windows.getAll( { populate : true } , function(windows) {
			allWindows = windows;
			console.log(windows);
		}) 
	};

	setInterval(getAll, 1000 * 60);

	getAll();

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if(request.command = 'retrieve') {
				sendResponse( { windows : allWindows } );
				console.log("on message");
				console.log(allWindows);
			}
		});
}());
