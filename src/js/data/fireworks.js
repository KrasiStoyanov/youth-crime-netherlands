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

/**
 * @function
 * @name saveData
 * @description Save the whole data JSON.
 */
function saveData (data) {
	fireworks = data;
}

/**
 * @function
 * @name saveCurrentAge
 * @description Save the selected age group.
 */
function saveCurrentAge (age) {
	selectedAge = age;
}

/**
 * @function
 * @name getCurrentAge
 * @return { Number } selectedAge - The current selected age.
 * @description Get the current selected age.
 */
function getCurrentAge () {
	return selectedAge;
}

/**
 * @function
 * @name savePastYearsByTotalAmountOfViolations
 * @description Save the selected amount of past years by total amount of violations.
 */
function savePastYearsByTotalAmountOfViolations (years) {
	totalAmountOfViolationsPastYears = years;
}

/**
 * @function
 * @name getPastYearsByTotalAmountOfViolations
 * @return { Number } totalAmountOfViolationsPastYears - The current amount of past years by total amount of violations.
 * @description Get the current amount of past years by total amount of violations.
 */
function getPastYearsByTotalAmountOfViolations () {
	return totalAmountOfViolationsPastYears;
}

/**
 * @function
 * @name savePastyearsByAge
 * @description Save the selected amount of past years by age group.
 */
function savePastyearsByAge (years) {
	byAgePastYears = years;
}

/**
 * @function
 * @name getPastYearsByAge
 * @return { Number } byAgePastYears - The current past years by age.
 * @description Get the current past years by age group.
 */
function getPastYearsByAge () {
	return byAgePastYears;
}

/**
 * @function
 * @name forThePastNYears
 * @param { Number } years - The amount of past years.
 * @param { Number } age - The new age group.
 * @return { Number } numberOfViolations - The total number of violations.
 * @return { Array } periodKeys - The period keys/years.
 * @return { Array } violationsByYears - The violations by years.
 * @description Get new data based on user input.
 */
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