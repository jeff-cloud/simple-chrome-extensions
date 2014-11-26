
var port = chrome.runtime.connect( { name : 'rule.last.inquery' });
var portSave = chrome.runtime.connect( { name : 'rule.save' } );

port.onMessage.addListener(function(msg) {
		var lastSelector = msg.selector;
		var lastColor = msg.color;
		var lastPage = msg.page;

		$('#selector').val(lastSelector);
		$('#color_demo').css( 'background-color', lastColor );
		$('#page').val(lastPage);
});

$(document).ready(function() {
	port.postMessage( "dummy" );

	//save
	$('#save').click( function() {
		var key = $('#page').val() + '[' + $('#selector').val() + ']';
		var color = $('#color_demo').css( 'background-color' );

		portSave.postMessage( { key : key, color : color } );
		window.close();
	});

	$('#cancel').click( function() {
		window.close();
	});
});


