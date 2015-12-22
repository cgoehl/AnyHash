
function init() {
	chrome.runtime.sendMessage({ method: "status" }, function(response) {
		$("body").addClass(response.state);
	});
}

$(function() {
	init();
	$("#passwordForm").submit(function(event) {
		console.log(arguments);
		event.preventDefault();
		var password = document.getElementById("masterpassword").value;
		chrome.runtime.sendMessage({
			method: "setPassword",
			password: password
		}, function(response) {
			window.close();
		});
		return false;
	});
	$("#lockButton").click(function() {
		chrome.runtime.sendMessage({
			method: "lock"
		}, function(response) {
			window.close();
		});
	})


	chrome.tabs.query({ active: true, currentWindow: true}, function (tabs){
		var currentTab = tabs[0];
		console.log(currentTab);
	});
})
