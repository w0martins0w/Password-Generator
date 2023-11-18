"use strict";

const passwordString = (function() {

	let _charSet = "qwertyabcdef0123456789";

	let _specifierCallback = new Map([
		
		["%", function() {
			return String.fromCharCode(37);
		}],
		
		["r", function() {
			return _charSet[Math.floor(
				Math.random() * _charSet.length
			)];
		}],
		
		["u", function() {
			return String.fromCharCode(
				Math.floor(Math.random() * 26)
			+ 65);
		}],
		
		["u", function() {
			return String.fromCharCode(
				Math.floor(Math.random() * 26)
			+ 65);
		}],
		
		["l", function() {
			return String.fromCharCode(
				Math.floor(Math.random() * 26)
			+ 97);
		}],
		
		["d", function() {
			return String.fromCharCode(
				Math.floor(Math.random() * 10)
			+ 48);
		}],
		
		["h", function() {
			const hexDigit = "0123456789abcdefABCDEF";
			return hexDigit[Math.floor(
				Math.random() * hexDigit.length
			)];
		}]
		
	]);

	return Object.preventExtensions(Object.create(Object.prototype, {
		
		defaultCharSet: {
			value: _charSet,
			enumerable: true,
			writable: false
		},

		charSet: {
			
			get() { return _charSet; },

			set(charSet) {
				
				if (!(
					typeof charSet == "string" &&
					charSet.length != 0
				)) {
					throw new TypeError("expected non empty string");
				}

				_charSet = charSet;

			},

			enumerable: true

		},

		generate: {
			value(length) {

				if (!(
					typeof length == "number" &&
					Number.isFinite(length) &&
					Number.isInteger(length) &&
					length >= 0
				)) {
					throw new TypeError("expected unsigned integer");
				}

				let password = "";
				for (let i = 0; i < length; i++) {
					password += _specifierCallback.get("r")();
				}

				return password;

			},

			enumerable: true,
			writable: false

		},

		genarateTemplate: {
			value(template) {

				if (typeof template != "string") {
					throw new TypeError("expected string");
				}

				let specifier = false;
				let password = "";

				for (const char of template) {
					if (specifier == true) {
						if (_specifierCallback.has(char)) {
							password += _specifierCallback.get(char)();
						}
						specifier = false;
					} else {
						if (char == "%") {
							specifier = true;
						} else {
							password += char;
						}
					}
				}

				return password;

			},

			enumerable: true,
			writable: false

		}

	}));

})();
