
function setFingerprint(fingerprint) {
	$("#fingerprint").text(fingerprint);
}

function setFingerprintImage(url) {
	$("#fingerprintImage").attr('src', url);
}

function init() {
	chrome.runtime.sendMessage({ method: "status" }, update);
}

function update(response) {
	console.log(response);
	$("body").addClass(response.state);
	if (response.state === 'locked') return;
	setFingerprint(response.fingerprint);
	setFingerprintImage(response.fingerprintImage);
}



$(function() {
	init();
	$("#passwordForm").submit(function(event) {
		console.log(arguments);
		event.preventDefault();
		var password = document.getElementById("masterpassword").value;
		if(!password.length) return;
		chrome.runtime.sendMessage({
			method: "setPassword",
			password: password
		}, function(response) {
			update(response);
			window.close();
		});
		return false;
	});
	$("#lockButton").click(function() {
		chrome.runtime.sendMessage({
			method: "lock"
		}, function(response) {
			update(response);
			window.close();
		});
	})


	chrome.tabs.query({ active: true, currentWindow: true}, function (tabs){
		var currentTab = tabs[0];
		console.log(currentTab);
	});
})
