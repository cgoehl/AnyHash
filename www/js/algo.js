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

function scrypt(password, salt) {
	console.log("scrypt", password, salt);
	var s = scrypt_module_factory();
	var u8 = s.crypto_scrypt
		(s.encode_utf8(password)
		, s.encode_utf8(salt)
		, 16384, 8, 1, 64);
	var base64 = btoa(String.fromCharCode.apply(null, u8));
	return base64;
}
