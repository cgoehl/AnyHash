function getPassword(cb) {
	return chrome.storage.local.get('password', function(result) {
		cb(result.password);
	});
}

function setPassword(value) {
	chrome.storage.local.set({password: value}, console.log.bind(console));
}

function resetPassword() {
	return chrome.storage.local.remove('password');
}

function handleMessage(message) {

}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log(message);
	switch(message.method) {
		case 'getPassword': {
			getPassword(function (masterPassword) {
				if (!masterPassword) {
					sendResponse({ status: false, error: 'locked' });
				}
				var defaultSettings = {
					ignoreTld: true,
					ignoreVhost: true,
					length: 20,
					iteration: 0
				};

				var settings = Object.assign({}, defaultSettings, {})
				var password = generate(message.url, masterPassword, settings)
				sendResponse({ status: true, url: message.url, password: password });
			});
			return true;
		}
		case 'setPassword': {
			if(message.password) {
				setPassword(message.password);
				sendResponse({ status: true, state: 'unlocked' });
			}
			else {
				sendResponse({ status: false, error: 'no password given' });
			}
			return false;
		}
		case 'lock': {
			resetPassword();
			sendResponse({ status: true, state: 'locked' });
			return false;
		}
		case 'status': {
			getPassword(function (masterPassword) {
				var state = masterPassword ? 'unlocked' : 'locked';
				sendResponse({ status: true, state: state });
			});
			return true;
		}
		default: {
			sendResponse({ status: false, error: 'invalid message' });
			break;
		}
	}
});
