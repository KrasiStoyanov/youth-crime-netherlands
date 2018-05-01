'use strict';

let genders = {};
function save (data) {
	data.map((gender, index) => {
		let key = gender.Title;
		let value = parseInt(gender.Key);

		key = key.split(' ');
		switch (key[0]) {
			case 'Totaal':
				key = 'total';
				break;
			case 'Mannen':
				key = 'man';
				break;
			case 'Vrouwen':
				key = 'woman';
				break;
		}

		genders[key] = value;
	});
}

function get () {
	return genders;
}

export {
	save,
	get
};