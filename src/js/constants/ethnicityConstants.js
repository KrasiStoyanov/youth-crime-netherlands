'use strict';

let ethnicities = {};

/**
 * @function
 * @name save
 * @param { Object } data - The ethnicity constants.
 * @description Save the ethnicity constants.
 */
function save (data) {
	data.map((ethnicity, index) => {
		let key = ethnicity.Title;
		let value = parseInt(ethnicity.Key);

		switch (key.split(' ')[0]) {
			case 'Totaal':
				key = 'total';
				break;
			case 'Overig':
				key = 'other';
				break;
		}

		ethnicities[key] = value;
	});
}

/**
 * @function
 * @name get
 * @return { Object } The ethnicity constants.
 * @description Get the ethnicity constants.
 */
function get () {
	return ethnicities;
}

export {
	save,
	get
};