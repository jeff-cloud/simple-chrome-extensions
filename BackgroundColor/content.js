
chrome.runtime.onMessage.addListener(
	function(request) {
		var selector = request.selector;
		var color = request.color;

		updateColor(selector, color);
	}
);

function updateColor(selector, color) {
	var all = document.querySelectorAll(selector);

	if(all) {
		var i;
		for(i = 0; i<all.length; ++i) {
			all[i].style.backgroundColor=color;
		}
	}
}

//render the page
(function() {
	
	chrome.runtime.sendMessage( { type : 'page.render' }, function(response) {
		console.log(response);

		//invalid message
		if(!response || !response.length) {
			return;
		}

		var i;

		for(i=0; i<response.length; ++i) {
			updateColor(response[i].selector, response[i].color);
		}
	});
	
}());
			
			
		
