chrome.commands.onCommand.addListener(function(command) {
	//find the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabArray){
		var activeTab = tabArray[0];

		chrome.tabs.sendMessage(activeTab.id, "getSelection", function(response) {
			var url = "https://translate.google.com/";

			if(response && response.data) {
				url = url + "#auto/zh-CN/" + encodeURIComponent(response.data);
			}

			chrome.windows.create(
				{
					"url" : url,
					"focused": true,
					"type": "panel",
					"width": 1024,
					"height": 450 
				});	


		})
	});
});

