'use strict';

let genders = {};

/**
 * @function
 * @name save
 * @param { Object } data - The gender constants.
 * @description Save the gender constants.
 */
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

/**
 * @function
 * @name get
 * @return { Object } The gender constants.
 * @description Get the gender constants.
 */
function get () {
	return genders;
}

export {
	save,
	get
};