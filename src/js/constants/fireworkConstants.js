'use strict';

const initialPassedYears = 10;
const keys = {
	age: 'Leeftijd',
	sex: 'Geslacht',
	ethnicity: 'Herkomstgroeperingen',
	period: 'Perioden',
	fireworks: 'VuurwerkovertredingenHalt_10'
};

let periods = [];
function savePeriods (data) {
	data.map((period, index) => {
		let key = period.Title;
		let value = period.Key;
		let newPeriod = {};

		newPeriod[key] = value;
		periods.push(newPeriod);
	});
}

function getPeriods () {
	return periods;
}

export {
	initialPassedYears,
	keys,
	savePeriods,
	getPeriods
};