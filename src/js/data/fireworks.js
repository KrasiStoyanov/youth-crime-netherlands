'use strict';

import * as fireworkConstants from '../constants/fireworkConstants';
import * as ageConstants from '../constants/ageConstants';
import * as genderConstants from '../constants/genderConstants';
import * as ethnicityConstants from '../constants/ethnicityConstants';
import * as periodConstants from '../constants/periodConstants';

let fireworks = [];
let totalNumberOfViolations = 0;

function saveData (data) {
	fireworks = data;
}

function forThePastNYears (years) {
	let ages = ageConstants.get();
	let genders = genderConstants.get();
	let ethnicities = ethnicityConstants.get();
	let periods = periodConstants.get();

	let numberOfViolations = 0;
	let periodsArray = [];

	for (let counter = 1; counter <= years; counter += 1) {
		let index = periods.length - counter;
		let period = Object.values(periods[index])[0];

		periodsArray.push(period);
	}

	fireworks.map((firework, index) => {
		if (parseInt(firework[fireworkConstants.keys.age]) === ages.total) {
            if (parseInt(firework[fireworkConstants.keys.sex]) === genders.total) {
                if (parseInt(firework[fireworkConstants.keys.ethnicity]) === ethnicities.total) {
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