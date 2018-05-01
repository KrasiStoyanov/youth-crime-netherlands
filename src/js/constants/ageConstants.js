'use strict';

let ages = {};
function save (data) {
	data.map((age, index) => {
		let key = age.Title;
		let value = parseInt(age.Key);

		key = key.split(' ');
		switch (key[0]) {
			case 'Totaal':
				key = 'total';
				break;
			case 'Overig':
				key = 'other';
				break;
			default:
				key = key[0];
				break;
		}

		ages[key] = value;
	});
}

function get () {
	return ages;
}

export {
	save,
	get
};