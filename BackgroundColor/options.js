
$(document).ready( function() {

	$(document).on('click', '.page_item', function() {
		var pageUrl = this.innerText;
		var ans = confirm('Delete ' + pageUrl + '?');
		var curr = $(this);
		if(ans) {
			chrome.runtime.sendMessage( { 
					type : 'page.del',
					page : pageUrl 
				}, function(reponse) {
					curr.remove();	
				});
		}
	});
	
	chrome.runtime.sendMessage( { type : 'page.list' }, function(response) {
		if(!response) {
			console.log("Warning: invalid response");
			return;
		}

		var pIndex;

		for(pIndex=0; pIndex<response.length; ++pIndex) {
			$('#page_list').append($('<li class="page_item">' + response[pIndex] + '</li>'));
		}
	});

});
