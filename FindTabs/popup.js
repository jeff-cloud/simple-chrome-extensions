(function() {
	var app = angular.module("app", []);

	var ctrl = app.controller("tabCtrl", function($scope) {
		chrome.windows.getAll({ populate : true }, function(windows) {
			$scope.$apply(function() {
				$scope.result = { windows: windows};
			});
		});

		$scope.moveTab = function(w, t) {
			console.log("Moving " + w + " : " + t);
			chrome.windows.getCurrent({}, function(cw) {
				chrome.tabs.move(t, {windowId : cw.id, index : -1 },  function(tab) {
					console.log(tab.title);
				});
			});
		};
	});
} () );
