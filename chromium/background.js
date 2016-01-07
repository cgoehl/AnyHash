var masterPassword = null;
var currentFingerprint = null;

var defaultState = {
	masterpassword: null,
	fingerprint: null,
	largeFingerprintImage: null,
	displayFingerprint: null,
};

var state = Object.assign({}, defaultState);

function setPassword(password) {
	state.masterPassword = password;
	state.fingerprint = generateFingerprint(password);
	state.displayFingerprint = btoa(String.fromCharCode.apply(null, state.fingerprint)).substr(0, 20);
	state.largeFingerprintImage = generateFingerprintImage(state.fingerprint, 7).url;
	var icon = generateFingerprintImage(state.fingerprint, 1);
	chrome.browserAction.setIcon({ imageData: icon.imageData });
}

function resetPassword() {
	state = Object.assign({}, defaultState);
	chrome.browserAction.setIcon({ path: {19: 'chromium/icon19.png', 38: 'chromium/icon38.png' }});
}

function status(v, more) {
	var r = {
		status: v,
		state: state.masterPassword ? 'unlocked' : 'locked',
		fingerprint: state.displayFingerprint,
		fingerprintImage: state.largeFingerprintImage
	};
	return Object.assign(r, more);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponseRaw) {
	var sendResponse = function(res) {
		console.log(message, '->', res);
		sendResponseRaw(res);
	}
	switch(message.method) {
		case 'getPassword': {
			if (!state.masterPassword) {
				sendResponse({ status: false, error: 'locked' });
				return false;
			}
			var defaultSettings = {
				ignoreTld: true,
				ignoreVhost: true,
				length: 20,
				iteration: 0
			};

			var settings = Object.assign({}, defaultSettings, {})
			var password = generate(message.url, state.masterPassword, settings)
			sendResponse({ status: true, url: message.url, password: password });
			return false;
		}
		case 'setPassword': {
			var password = message.password;
			if(password) {
				setPassword(password)
				sendResponse(status(true));
			}
			else {
				sendResponse(status(false, { error: 'no password given' }));
			}
			return false;
		}
		case 'lock': {
			resetPassword();
			sendResponse(status(true));
			return false;
		}
		case 'status': {
			sendResponse(status(true));
			return false;
		}
		default: {
			sendResponse({ status: false, error: 'invalid message' });
			return false;
		}
	}
});
