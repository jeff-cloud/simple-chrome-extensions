//Add context menu

console.log("Create context menus");

chrome.contextMenus.create( {
	"title": "Add Last Rule to Page",
	"contexts": ["page"],
	"onclick": saveRule
});

function saveRule(info) {
	var details = {};

	lastPage = info.pageUrl;
	chrome.windows.create( { 
		url: 'save_rule.html', 
		type: 'popup', 
		width: 700, 
		height: 150 } );
	
}

var defaultColor = "rgb(191, 189, 152)";
var defaultSelector = "div";
var preconfigPages = [
	"https://www.google.com/webhp",
	"https://www.google.com/search?",
	"http://confluence/display",
	"http://en.wikipedia.org/wiki"
];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(sender.tab && request.type === 'page.render' ) {
			//only handle messages from tabs
			var url = sender.tab.url;
			console.log("Background color update inquery from : " + url);

			(function() {
				var pIndex;
				var pattern;

				for(pIndex = 0; pIndex < preconfigPages.length; ++pIndex) {
					pattern = preconfigPages[pIndex];
					var length = pattern.length;
					if(pattern === url.substring(0, length)) {
						//matches
						sendResponse([{
							selector : defaultSelector,
							color    : defaultColor
						}]);
						return; //only once
					}
				}
			}());

		} else {
			return;
		}
	}
);

var lastSelector = "";
var lastColor = "";
var lastPage = "";

chrome.runtime.onConnect.addListener(function(port) {
        //create long-live connection
        //only interested in port with name "rule.update"
        if(port.name === 'rule.update') {
                port.onMessage.addListener(function(msg) {
                        console.log("Message recv: ");
                        console.log(msg);
                        lastSelector = msg.selector;
                        lastColor = msg.color;
                });
        }
	else if(port.name === 'rule.last.inquery') {
		port.onMessage.addListener(function(msg) {
			//don't need to check the message
			console.log("Somebody ask for the last rule.");
			port.postMessage( 
				{ 
					selector : lastSelector, 
					color : lastColor,
					page : lastPage
				} );
		});
	}
	else if(port.name === 'rule.save') {
		port.onMessage.addListener(function(msg) {
			console.log("Somebody want to save a rule.");
			console.log(msg);

                	var curr = localStorage["colorSchema"];
                	if(!curr) {
                        	curr = localStorage["colorSchema"] = {};
                	} 

                        curr[key] = color;
		});
	}
	else if(port.name === 'rule.saved') {
		port.onMessage.addListener(function(msg) {
			console.log("Somebody inquery all saved rules.");

			var curr = localStorage["colorSchema"];
			if(curr) {
				port.postMessage( curr );
			}
		});
	}
				
	
});

