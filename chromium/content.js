function getFields() {
	return document.querySelectorAll('input[type=password]');
}

function run() {
	var fields = getFields();
	if (!fields.length) return;

	chrome.runtime.sendMessage({
			method: "getPassword",
			url: window.location.href
		}, function(response) {
			console.log(response);
			if (response.status) {
				Array.prototype.forEach.call(fields, function (field){
					field.value = response.password;
				})
			}
		}
	);
}

run();
