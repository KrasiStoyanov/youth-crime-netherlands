'use strict';

let periods = [];

/**
 * @function
 * @name save
 * @param { Object } data - The period constants.
 * @description Save the period constants.
 */
function save (data) {
	data.map((period, index) => {
		let key = period.Title;
		let value = period.Key;
		let newPeriod = {};

		newPeriod[key] = value;
		periods.push(newPeriod);
	});
}

/**
 * @function
 * @name get
 * @return { Object } The period constants.
 * @description Get the period constants.
 */
function get () {
	return periods;
}

export {
	save,
	get
};