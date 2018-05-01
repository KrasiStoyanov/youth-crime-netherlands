'use strict';

let periods = [];
function save (data) {
	data.map((period, index) => {
		let key = period.Title;
		let value = period.Key;
		let newPeriod = {};

		newPeriod[key] = value;
		periods.push(newPeriod);
	});
}

function get () {
	return periods;
}

export {
	save,
	get
};