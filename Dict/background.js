chrome.commands.onCommand.addListener(function(command) {
	chrome.windows.create(
		{
			"url" : "https://translate.google.com/",
			"focused": true,
			"type": "panel",
			"width": 1024,
			"height": 450 
		});	
});

