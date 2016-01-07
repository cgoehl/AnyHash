
function setPass(element) {
	chrome.runtime.sendMessage({
			method: "getPassword",
			url: window.location.href
		}, function(response) {
			console.log("getPassword", response.status);
			if (response.status) {
				element.value = response.password;
			}
		}
	);
}

function toggleType(element) {
	var current = element.type;
	element.type = current === 'password' ? 'text' : 'password';
}

function init() {
	$('body').on('click', 'input[type=password], input[type=text]', function(event) {
		var target = event.toElement;
		if(event.ctrlKey) {
			setPass(target);
		} else
		if(event.altKey) {
			toggleType(target);
		}
	})
}

init();
