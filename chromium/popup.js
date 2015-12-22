
$(function() {
	$("#passwordForm").submit(function(event) {
		console.log(arguments);
		event.preventDefault();
		var password = document.getElementById("masterpassword").value;
		chrome.runtime.sendMessage({
			method: "setPassword",
			password: password
		}, function(response) {
			console.log(response);
		});
		return false;
	});

})
