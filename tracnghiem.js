var url = location.href;

function getAnswer(text){ 
	text = text.split('</span>');
	return text[1];
}

function getId(text){
	text = text.split(':')[1];
	text = text.split('_')[0];
	return text;
}

function auto()
{
	chrome.storage.sync.get(['copied'], (r) => { 

		if(r.copied)
		{
			var _paste = JSON.parse(r.copied);
			for (var i = 0; i < document.querySelectorAll('.qtext').length; i++)
			{
				var ques = document.querySelectorAll('.qtext p')[i].innerHTML;
				if(_paste.question.indexOf(ques) != -1)
				{
					var index = _paste.question.indexOf(ques);
					for (var a = 0; a < document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div').length; a++)
					{
						var answer = getAnswer(document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div label')[a].innerHTML);
						if(answer == _paste.answer[index])
						{
							document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div label')[a].click();
							break;
						} else if(a == document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div').length-1)
						{
							document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div label')[0].click();
						}
					}
				} else {
					var dapan = Math.floor(Math.random() * Math.floor(3));
					document.querySelectorAll('.que:nth-child('+(i+1)+') .answer div label')[dapan].click();
				}
			}

		}

	});
}

function Auto()
{
	chrome.storage.sync.get(['grade'], (r) => { 
		if(r.grade)
		{
			if(r.grade > 7)
			{
				chrome.storage.sync.set({ copied : null, grade : null, auto : false });
				chrome.extension.sendMessage({
					type: "checkAuto"
				});
			}
			console.log('stop here');
			return false;
		}
	});

	console.log('run here');

	if(url.match('https://elearning.thanglong.edu.vn/mod/quiz/view.php') != null)
	{
		$('button[type=submit]').click();
	}
	
	if(url.match('https://elearning.thanglong.edu.vn/mod/quiz/attempt.php') != null)
	{
		auto();
		auto();
		setTimeout(function(){
			$('[name=next]').click();
		}, 1000);
	}
	if(url.match('https://elearning.thanglong.edu.vn/mod/quiz/summary.php') != null)
	{
		$('button[type=submit]')[1].click()
		setTimeout(function(){
			$('input[type=button]')[0].click();
		},300);
	}

	if(url.match('https://elearning.thanglong.edu.vn/mod/quiz/review.php') != null)
	{
		document.querySelectorAll('a.mod_quiz-next-nav')[1].click();
	}

}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case 'auto':
		Auto();
		break;
	}
});

window.onload = function()
{
	console.log('DEV.VIVOO.VN - TLU Quiz');
	console.log('DEV.VIVOO.VN - Đơn vị thiết kế WEBSITE, TOOL, APP Chất Lượng Nhất VIỆT NAM');

	chrome.storage.sync.get(['auto'], (r) => {
		if(r.auto)
		{
			Auto();
		} 
	});

	if(url.match('https://elearning.thanglong.edu.vn/mod/quiz/review.php') != null)
	{
		correct = '.answer .correct';

		chrome.storage.sync.get(['copied'], (r) => { 

			if(!r.copied)
			{
				var _copy = { question: [], answer: [] }
				chrome.storage.sync.set({ copied : JSON.stringify(_copy) });
			}

			var saved = JSON.parse(r.copied);

			var _question = saved.question, _answer = saved.answer;

			for (var i = 0; i < document.querySelectorAll(correct).length; i++)
			{
				var question = $('#q'+getId(document.querySelectorAll(correct+' input')[i].getAttribute('id'))+' .qtext p').html();
				var answer = getAnswer(document.querySelectorAll('.answer .correct label')[i].innerHTML);
				if(_question.indexOf(question) == -1)
				{
					_question.push(question);
					_answer.push(answer);
				}
			}

			var _copy = { question: _question, answer: _answer }

			chrome.storage.sync.set({ copied : JSON.stringify(_copy), grade : Number(document.querySelectorAll('td b')[0].innerHTML) });
			chrome.extension.sendMessage({
				type: "checkGrade"
			});
		});

	} else {

		auto();

	}
}