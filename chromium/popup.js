
function init() {
	chrome.runtime.sendMessage({ method: "status" }, function(response) {
		$("body").addClass(response.state);
		setBadge(response.state);
		setFingerprint(response.fingerprint);
	});
}

function setBadge(status) {
	var color = status === 'locked' ? '#DD0000' : '#00DD00';
	chrome.browserAction.setBadgeBackgroundColor({color: color});
	chrome.browserAction.setBadgeText({text: '\xa0'});
}

function setFingerprint(fingerprint) {
	$("#fingerprint").text(fingerprint);
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
			setBadge('unlocked');
			setFingerprint(response.fingerprint);
			window.close();
		});
		return false;
	});
	$("#lockButton").click(function() {
		chrome.runtime.sendMessage({
			method: "lock"
		}, function(response) {
			setBadge('locked');
			setFingerprint('');
			window.close();
		});
	})


	chrome.tabs.query({ active: true, currentWindow: true}, function (tabs){
		var currentTab = tabs[0];
		console.log(currentTab);
	});
})
