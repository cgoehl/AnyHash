
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
		event.preventDefault();
		var password = $("#masterpassword").val();
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
	$("#manualForm").submit(function(event) {
		event.preventDefault();
		var token = $("#manualToken").val();
		chrome.runtime.sendMessage({
				method: "getPassword",
				url: token
			}, function(response) {
				console.log("getPassword", response.status);
				if (response.status) {
					$("#manualResult").val(response.password);
					$("#manualResult").select();
				}
			}
		);
		return false;
	});
	$("#manualCopy").click(function() {
		$("#manualResult").select();
		document.execCommand("Copy", false, null);
		window.close();
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
