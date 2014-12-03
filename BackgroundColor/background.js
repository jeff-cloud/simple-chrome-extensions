//Add context menu

console.log("Create context menus");

chrome.contextMenus.create( {
	"title": "Add page to preconfig",
	"contexts": ["page"],
	"onclick": saveRule
});

function saveRule(info) {
	var details = {};

	lastPage = info.pageUrl;
	var ans = prompt("Modify the page pattern", lastPage);
	if(ans) {
		addAndSaveOnePreconfigPage(ans);
	}
	
}

var defaultColor = "rgb(191, 189, 152)";
var defaultSelector = "div";
var preconfigPages = [];

var preconfigLoaded = false;

function loadPreconfigPages() {
	//already loaded
	if(preconfigLoaded) {
		return;
	}

	if(localStorage['preconfig']) {
		preconfigPages = JSON.parse(localStorage['preconfig']);
	}

	preconfigLoaded = true;
}

function savePreconfigPages() {
	localStorage['preconfig'] = JSON.stringify(preconfigPages);
	preconfigLoaded = false;
}

function addAndSaveOnePreconfigPage(pagePattern) {
	//sync the config first
	loadPreconfigPages();

	preconfigPages.push(pagePattern);

	//save it back
	savePreconfigPages();
}

function delAndSaveOnePreconfigPage(pagePattern) {
	//sync the config first
	loadPreconfigPages();

	var index = preconfigPages.indexOf(pagePattern);
	if(index > -1) {
		preconfigPages.splice(index, 1);
	}

	savePreconfigPages();
}


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// handle page.render request from content script
		if(sender.tab && request.type === 'page.render' ) {
			(function() {
				//only handle messages from tabs
				var url = sender.tab.url;
				console.log("Background color update inquery from : " + url);

				var pIndex;
				var pattern;

				loadPreconfigPages();

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

		} 
		//nandle page.list request from option page
		else if(request.type === 'page.list' ) {
			(function() {
				console.log("Option page requests a list of preconfigured pages.");

				//simply response with the list of pages
				loadPreconfigPages();
				sendResponse(preconfigPages);
			}());
		}
		else if(request.type === 'page.del' ) {
			(function() {
				console.log("Option page requests a delete on page " + request.page);

				delAndSaveOnePreconfigPage(request.page);
				sendResponse(null);
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

