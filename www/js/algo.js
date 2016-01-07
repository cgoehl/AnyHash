function generateFingerprint(password) {
	var salt = 'fingerprint:fingerprint'
	return scryptCore(password, salt, 64);
}

function generateFingerprintImage(key, sizeFactor) {
	sizeFactor = sizeFactor || 1;
	var rectSize = sizeFactor * 3;
	var imageSize = sizeFactor * 16 + rectSize;
	var canvas = document.createElement('canvas');
	canvas.width = imageSize;
	canvas.height = imageSize;
	var ctx = canvas.getContext('2d');
	function makeColor(r, g, b) {
		return 'rgb(' + [r,g,b].join(',') + ')';
	}

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, imageSize, imageSize);

	ctx.globalCompositeOperation = 'multiply';

	for(var i = 0; i < key.length; i = i + 4) {
		ctx.fillStyle = makeColor(key[i], key[i + 1], key[i + 2]);
		var pos = key[i + 3];
		var x = pos & 15;
		var y = Math.floor((pos & 240) / 16);
		ctx.fillRect(x * sizeFactor, y * sizeFactor, rectSize, rectSize);
	}

	return {
		imageData: ctx.getImageData(0, 0, imageSize, imageSize),
		url: canvas.toDataURL()
	};
}

function generate(password, url, settings) {
	var salt = getToken(url, settings.ignoreTld, settings.ignoreVhost);
	salt += settings.iteration && settings.iteration > 0
		? settings.iteration
		: "";
	var key = scrypt(password, salt);
	return key.substring(0, settings.length)
}

function getSettings(url, sites) {
	return sites[getToken(url, false, false)]
		|| sites[getToken(url, true, false)]
		|| sites[getToken(url, false, true)]
		|| sites[getToken(url, true, true)]
		|| null;
}

function getToken(url, ignoreTld, ignoreVhost) {
	var host = new Uri(url).host();
	var parts = host.split(".");
	if (parts.length == 1)
		return parts[0];
	if (ignoreTld && ignoreVhost)
		return parts[parts.length-2];
	if (ignoreTld)
		return parts.slice(0, parts.length - 1).join(".");
	if (ignoreVhost)
		return parts.slice(parts.length - 2, parts.length).join(".");
	return host;
}

function scryptCore(password, salt, size) {
	size = size || 64;
	var s = scrypt_module_factory();
	return s.crypto_scrypt
		(s.encode_utf8(password)
		, s.encode_utf8(salt)
		, 16384, 8, 1, size);
}

function scrypt(password, salt) {
	var u8 = scryptCore(password, salt, 64);
	var base64 = btoa(String.fromCharCode.apply(null, u8));
	return base64;
}
