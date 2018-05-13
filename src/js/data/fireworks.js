'use strict';

import * as fireworkConstants from '../constants/fireworkConstants';
import * as ageConstants from '../constants/ageConstants';
import * as genderConstants from '../constants/genderConstants';
import * as ethnicityConstants from '../constants/ethnicityConstants';
import * as periodConstants from '../constants/periodConstants';

let fireworks = [];
let selectedAge = 0;
let totalAmountOfViolationsPastYears = 0;
let byAgePastYears = 0;
let totalNumberOfViolations = 0;

function saveData (data) {
	fireworks = data;
}

function saveCurrentAge (age) {
	selectedAge = age;
}

function getCurrentAge () {
	return selectedAge;
}

function savePastYearsByTotalAmountOfViolations (years) {
	totalAmountOfViolationsPastYears = years;
}

function getPastYearsByTotalAmountOfViolations () {
	return totalAmountOfViolationsPastYears;
}

function savePastyearsByAge (years) {
	byAgePastYears = years;
}

function getPastYearsByAge () {
	return byAgePastYears;
}

function forThePastNYears (years, age) {
	let ages = ageConstants.get();
	let genders = genderConstants.get();
	let ethnicities = ethnicityConstants.get();
	let periods = periodConstants.get();

	let numberOfViolations = 0;
	let periodsArray = [];
	let violationsByYears = [];
	let periodKeys = [];

	for (let counter = 1; counter <= years; counter += 1) {
		let index = periods.length - counter;
		let period = Object.values(periods[index])[0];
		let key = Object.keys(periods[index])[0];

		periodsArray.push(period);
		periodKeys.push(key);
	}

	let counter = 0;
	for (let index = 0; index <= fireworks.length; index += 1) {
		if (counter >= years) {
			break;
		}

		let firework = fireworks[index];
		let ageValue = parseInt(firework[fireworkConstants.keys.age]);
		let genderValue = parseInt(firework[fireworkConstants.keys.sex]);
		let ethnicityValue = parseInt(firework[fireworkConstants.keys.ethnicity]);
		let ages = ageConstants.get();

		if (age !== undefined) {
			if (ageValue === ages[age]) {
				if (genderValue === genders.total) {
	                if (ethnicityValue === ethnicities.total) {
	                	let fireworkPeriod = firework[fireworkConstants.keys.period];
	                	let isInPeriodRange = periodsArray.indexOf(fireworkPeriod);
	                	if (isInPeriodRange > -1) {
		                    var currentNumberOfViolations = firework[fireworkConstants.keys.fireworks];
		                    violationsByYears.push(currentNumberOfViolations);

		                    numberOfViolations += currentNumberOfViolations;

					        counter += 1;
	                	}
	                }
	            }
			}
		} else if (ageValue === ages.total) {
            if (genderValue === genders.total) {
                if (ethnicityValue === ethnicities.total) {
                	let fireworkPeriod = firework[fireworkConstants.keys.period];
                	let isInPeriodRange = periodsArray.indexOf(fireworkPeriod);
                	if (isInPeriodRange > -1) {
	                    var currentNumberOfViolations = firework[fireworkConstants.keys.fireworks];
	                    violationsByYears.push(currentNumberOfViolations);

	                    numberOfViolations += currentNumberOfViolations;

				        counter += 1;
                	}
                }
            }
        }
	}

	return {
		numberOfViolations,
		periodKeys,
		violationsByYears
	};
}

export {
	saveData,
	saveCurrentAge,
	getCurrentAge,
	savePastYearsByTotalAmountOfViolations,
	getPastYearsByTotalAmountOfViolations,
	savePastyearsByAge,
	getPastYearsByAge,
	forThePastNYears
};