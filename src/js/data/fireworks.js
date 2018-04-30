'use strict';

import * as fireworkConstants from '../constants/fireworkConstants';

let fireworks = [];
let totalNumberOfViolations = 0;

function saveData (data) {
	fireworks = data;
}

function forThePastNYears (years) {
	let periods = fireworkConstants.getPeriods();
	let numberOfViolations = 0;
	let periodsArray = [];

	for (let counter = 1; counter <= years; counter += 1) {
		let index = periods.length - counter;
		let period = Object.values(periods[index])[0];

		periodsArray.push(period);
	}

	fireworks.map((firework, index) => {
		if (parseInt(firework[fireworkConstants.keys.age]) === 99) {
            if (parseInt(firework[fireworkConstants.keys.sex]) === 1100) {
                if (parseInt(firework[fireworkConstants.keys.ethnicity]) === 1000) {
                	let fireworkPeriod = firework[fireworkConstants.keys.period];
                	let isInPeriodRange = periodsArray.indexOf(fireworkPeriod);
                	if (isInPeriodRange > -1) {
	                    var currentNumberOfViolations = firework[fireworkConstants.keys.fireworks];

	                    numberOfViolations += currentNumberOfViolations;
                	}
                }
            }
        }
	});

	return numberOfViolations;
}

export {
	saveData,
	forThePastNYears
};