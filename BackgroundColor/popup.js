$(document).ready( function() {
	
	/*
	 * http://hex-color.com/code/e1deb3
	 */
	var colorMap = [ "#636350", 
			"#75745E", 
			"#8A896E", 
			"#A2A181", 
			"#BFBD98", 
			"#E1DEB3", 
			"#E6E3BE",
			"#EAE7C8",
			"#EDEBD0",
			"#F0EED7",
			"#F2F1DD",
			"#F4F3E2" ];

	var i;
	for(i=0; i<colorMap.length; ++i) {
		$("#color_map").append("<div class='target_color' style='background:" + colorMap[i] + ";'></div>");
	}

	$('.target_color').hover(
		/* in */
		function() {
			$(this).addClass('highlighted');
		}, 
		/* out */
		function() {
			$(this).removeClass('highlighted');
		});


	$('.target_color').click( function() {
		var targetSelector = $('#target_selector').val().trim();
		var targetColor = $(this).css('background-color');

		console.log('target selector = ' + targetSelector);
		if(!targetSelector || targetSelector.length == 0) {
			chrome.tabs.executeScript(
				{code : 'document.body.style.backgroundColor="' + targetColor + '"'});
			console.log('No selector is specified');
			return;
		}		

		chrome.tabs.query( {active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, 
				{ 
					selector: targetSelector,
					color: targetColor
				});
			});
	});


});

