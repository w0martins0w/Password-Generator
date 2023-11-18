"use strict";

const option = (function(node = document) {

	if (!(
		typeof node == "object" &&
		node instanceof Node
	)) {
		throw new TypeError("expected HTML node");
	}

	let _selected = 0;
	const _option = node.querySelectorAll("*.option");

	if (_option.length == 0) {
		throw new DOMException("at least one .option element is required");
	}

	_option[0].setAttribute("selected", "");

	for (let i = 0; i < _option.length; i++) {
		_option[i].addEventListener("click", function(event) {

			event.currentTarget.setAttribute("selected", "");
			_selected = _option.values().toArray().indexOf(event.currentTarget);

			for (let i = 0; i < _option.length; i++) {
				if (i != _selected) {
					_option[i].removeAttribute("selected");
				}
			}

		})
	}

	return Object.preventExtensions(Object.create(Object.prototype, {

		selected: {

			get() { return _option[_selected]; },
			
			enumerable: true

		}

	}));

})(document.body.querySelector(".extension"));


fetch(chrome.runtime.getURL("resources/template-tooltip.txt")).then(
	async function(response) {
		
		const tooltip = document.body.querySelector(
			'.extension > div.option[type="template"] > span > div.tool-tip'
		);

		if (!response.ok) {
			tooltip.innerHTML =
				`⚠ Failed to load Tool-Tip [Status Code: ${response.status}] ⚠`;
		}

		let text = await response.text();

		text = text.replaceAll("\r", "").replaceAll("\n", "</br>");
		tooltip.innerHTML = text;

	}
);

chrome.storage.local.get("charSet", function(items) {

	const charSet = document.body.querySelector(
		".extension > div.char-set > textarea"
	);

	if (items.hasOwnProperty("charSet") && items.charSet != ""){
		passwordString.charSet = items.charSet;
	} else {
		chrome.storage.local.set({ "charSet": passwordString.charSet });
	}

	charSet.value = passwordString.charSet;
	charSet.addEventListener("change", function(event) {

		if (event.currentTarget.value == "") {
			event.currentTarget.value = passwordString.charSet;
		} else {
			passwordString.charSet = event.currentTarget.value;
			chrome.storage.local.set({ "charSet": passwordString.charSet });
		}

	});

});

document.body.querySelector(
		'.extension > div.option[type="length"] > textarea'
).addEventListener("change", function(event) {

	let stringNumber = event.currentTarget.value.trim();
	if (/^\+?[0-9]+(?:\.[0-9]+)?$/.test(stringNumber)) {
		event.currentTarget.value =
			Number.parseInt(event.currentTarget.value).toString();
	} else {
		event.currentTarget.value = "0";
	}

});

document.body.querySelector(
	'.extension > div.generate > button'
).addEventListener("click", function(event) {

	const selectedOptionInput = option.selected.querySelector("textarea");
	const output = document.body.querySelector(
		'.extension > div.generate > textarea'
	);

	if (option.selected.getAttribute("type") == "template") {
		output.value =
			passwordString.genarateTemplate(selectedOptionInput.value);
	} else {
		output.value =
			passwordString.generate(
				Number.parseInt(selectedOptionInput.value)
			);
	}

});
