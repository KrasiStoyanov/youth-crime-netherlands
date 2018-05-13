'use strict';

import anime from 'animejs';
import 'bootstrap';
import Chart from 'chart.js';

import * as header from './modules/header';
import * as chart from './modules/chart';
import * as particles from './modules/particles';
import * as fireworks from './data/fireworks';

import * as particleConstants from './constants/particleConstants';
import * as fireworkConstants from './constants/fireworkConstants';
import * as ageConstants from './constants/ageConstants';
import * as genderConstants from './constants/genderConstants';
import * as ethnicityConstants from './constants/ethnicityConstants';
import * as periodConstants from './constants/periodConstants';

$(document).ready(() => {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Leeftijd',
		success: (data) => {
			data = data.value;

			ageConstants.save(data);
		}
	});

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Geslacht',
		success: (data) => {
			data = data.value;

			genderConstants.save(data);
		}
	});

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Herkomstgroeperingen',
		success: (data) => {
			data = data.value;

			ethnicityConstants.save(data);
		}
	});

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'http://opendata.cbs.nl/ODataApi/odata/71930ned/Perioden',
		success: (data) => {
			data = data.value;

			periodConstants.save(data);
		}
	});

	$.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/TypedDataSet',
        success: (data) => {
        	data = data.value;

        	fireworks.saveData(data);
        	fireworks.savePastYearsByTotalAmountOfViolations(fireworkConstants.initialPastYears);
        	fireworks.savePastyearsByAge(fireworkConstants.initialPastYears);
        	fireworks.saveCurrentAge(fireworkConstants.initialSelectedAge);
        	console.log(data);
        }
    }).done(() => {
    	let totalAmountOfViolationsPastYears = fireworks.getPastYearsByTotalAmountOfViolations();
    	let byAgePastYears = fireworks.getPastYearsByAge();
    	let selectedAge = fireworks.getCurrentAge();
    	let ages = ageConstants.get();

    	animateAmountOfViolationsBasedOnPastYears(totalAmountOfViolationsPastYears);
    	chart.initializeChart(ages);
    	generateChartFilterOptions(ages);
    });

    $('#total-number-of-violations .change-years a').click((e) => {
    	let selectedAmountOfPastYears = changeValueOfPastYearsButton(e);
    	fireworks.savePastYearsByTotalAmountOfViolations(selectedAmountOfPastYears);

    	let totalAmountOfViolationsPastYears = fireworks.getPastYearsByTotalAmountOfViolations();
    	animateAmountOfViolationsBasedOnPastYears(totalAmountOfViolationsPastYears);
    });

    $('#by-age .change-years a').click((e) => {
    	let selectedAmountOfPastYears = changeValueOfPastYearsButton(e);
    	fireworks.savePastyearsByAge(selectedAmountOfPastYears);

    	let byAgePastYears = fireworks.getPastYearsByAge();
    	let selectedAge = fireworks.getCurrentAge();
    	chart.updateChart(byAgePastYears, selectedAge);
    });

	header.initialize();
	
	// Particles
	let headerParticles = $('#particles-header .particles .particle').get();
	particles.animate(headerParticles);

	let path = anime.path('#firework-path #path path');
	let fireworkParticles = $('#firework-particles .particles .particle').get();

	let motionPath = anime({
		targets: '#firework-path #firework',
		translateX: path('x'),
		translateY: path('y'),
		scale: [0, 1],
		opacity: [0, 1],
		rotate: path('angle'),
		easing: 'easeInOutQuart',
		duration: 3000,
		loop: false,
		complete: () => {
			particles.animate(fireworkParticles);
		}
	});
});

function changeValueOfPastYearsButton (e) {
	e.preventDefault();

	let element = $(e.currentTarget);
	let selectedAmountOfPastYears = element.attr('data-value');
	$(element).parent().parent().parent().find('.amount-of-years').text(selectedAmountOfPastYears);

	let parent = element.parent();
	parent.find('a').removeClass('active');
	
	element.addClass('active');

	return selectedAmountOfPastYears;
}

function animateAmountOfViolationsBasedOnPastYears (years) {
	let heading = $('#total-number-of-violations-heading');
	let headingText = parseInt(heading.text());
	let forThePastNYears = fireworks.forThePastNYears(years);
	let totalAmountOfViolations = forThePastNYears.numberOfViolations;
	let initialAmount = {
		value: headingText
	};

	let animationOptions = {
		targets: initialAmount,
		value: totalAmountOfViolations,
		round: 1,
		easing: 'easeInOutCirc',
		duration: 3000,
		update: (anime) => {
			heading.text(initialAmount.value);
		}
	};

	let animation = anime(animationOptions);
}

function generateChartFilterOptions (ages) {
	let wrapper = $('#change-age .wrapper');
	for (let age in ages) {
		if (age !== 'other' && age !== 'total') {
			age = parseInt(age);

			let optionWrapper = $('<div></div>');
			let optionText = $(`<span class="years-old">${age}<span>`);
    		let selectedAge = fireworks.getCurrentAge();

			optionWrapper
				.addClass('col-lg-2')
				.addClass('col-6')
				.addClass('option')
				.addClass('d-flex')
				.addClass('align-items-center')
				.addClass('justify-content-center')
				.addClass('h-100');

			if (age === selectedAge) {
				optionWrapper.addClass('active');
			}

			optionWrapper
				.append(optionText)
				.append(' years old');
			wrapper.append(optionWrapper);

		    optionWrapper.click((e) => changeAge(e));
		}
	}
}

function changeAge (e) {
	let option = $(e.currentTarget);
	let age = parseInt(option.find('.years-old').text());
	
	$('#change-age .option').removeClass('active');
	option.addClass('active');

	let byAgePastYears = fireworks.getPastYearsByAge();

	fireworks.saveCurrentAge(age);
	chart.updateChart(byAgePastYears, age);
}