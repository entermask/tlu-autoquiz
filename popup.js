
function checkGrade()
{
	chrome.storage.sync.get(['grade'], (r) => {
		if(r.grade)
		{
			document.querySelector('.point').innerHTML = r.grade;
		}
	});
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case 'checkAuto':
		document.querySelector('button').innerHTML = 'Bật Auto';
		break;
		case 'checkGrade':
		checkGrade();
		break;
	}
});

document.querySelector("button").onclick = function() { 
	chrome.storage.sync.get(['auto'], (r) => {
		if(!r.auto)
		{
			chrome.storage.sync.set({ auto : true });
			document.querySelector('button').innerHTML = 'Tắt Auto';
			chrome.extension.sendMessage({
				type: "auto"
			});
		} else {
			chrome.storage.sync.set({ auto : false });
			document.querySelector('button').innerHTML = 'Bật Auto';
		}
	});
};

(function(){
	checkGrade();
})();