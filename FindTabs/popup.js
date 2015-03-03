(function() {
	var app = angular.module("app", []);

	var ctrl = app.controller("tabCtrl", function($scope) {
		var getAllTabs = function() {
			chrome.windows.getAll(
				{ populate : true }, 
				function(windows) {
			
			chrome.windows.getCurrent({ populate : true }, function(currWindow) {
				$scope.$apply(function() {
					$scope.otherWindows = [];
					$scope.allWindows = windows;
					$scope.currWindow = currWindow;

					$scope.allWindows.forEach(function(w) {
						if($scope.currWindow.id !== w.id) {
							$scope.otherWindows.push(w);
						}
					});

					$scope.allTabs = [];

					windows.forEach(function( w ) {
						w.tabs.forEach(function(t) {
							$scope.allTabs.push(t);
						});
					});
				});
			});

				}); //windows.getAll
		};

		getAllTabs();

		$scope.moveTab = function(w, t) {
			chrome.windows.getCurrent({}, function(cw) {
				chrome.tabs.move(t, {windowId : cw.id, index : -1 },  function(tab) {
					//console.log(tab.title);
					getAllTabs();
				});
			});
		};

		$scope.moveAllTabs = function(tabs) {
			var tabIds = [];
			tabs.forEach(function(tab) {
				tabIds.push(tab.id);
			});

			chrome.windows.getCurrent({}, function(cw) {
				chrome.tabs.move(tabIds, {windowId : cw.id, index : -1 },  function(tabs) {
					//console.log(tab.title);
					getAllTabs();
				});
			});

		}
	});
} () );
