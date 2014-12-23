//send back the selected text
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Request = " + request);

	if(request == 'getSelection') {
		sendResponse( { data: window.getSelection().toString() } );
	}
});
