// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.type) {
		case "auto":
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendMessage(tab.id, {type: "auto"});
		});
		break;
	}
	return true;
});