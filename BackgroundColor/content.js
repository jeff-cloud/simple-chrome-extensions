
chrome.runtime.onMessage.addListener(
	function(request) {
		var selector = request.selector;
		var color = request.color;

		var all = document.querySelectorAll(selector);

		if(all) {
			var i;
			for(i = 0; i<all.length; ++i) {
				all[i].style.backgroundColor=color;
			}
		}
	}
);
