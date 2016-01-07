var masterPassword = null;
var currentFingerprint = null;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponseRaw) {
	var sendResponse = function(res) {
		console.log(message, '->', res);
		sendResponseRaw(res);
	}
	switch(message.method) {
		case 'getPassword': {
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
			return false;
		}
		case 'setPassword': {
			if(message.password) {
				masterPassword = message.password;
				currentFingerprint = fingerprint(masterPassword);
				sendResponse({ status: true, state: 'unlocked', fingerprint: currentFingerprint });
			}
			else {
				sendResponse({ status: false, error: 'no password given' });
			}
			return false;
		}
		case 'lock': {
			masterPassword = null;
			sendResponse({ status: true, state: 'locked' });
			return false;
		}
		case 'status': {
			var state = masterPassword ? 'unlocked' : 'locked';
			sendResponse({ status: true, state: state, fingerprint: currentFingerprint });
			return false;
		}
		default: {
			sendResponse({ status: false, error: 'invalid message' });
			return false;
		}
	}
});
