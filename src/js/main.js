'use strict';

import anime from 'animejs';
import 'bootstrap';
import Chart from 'chart.js';

import * as header from './modules/header';
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
        	console.log(data);
        }
    }).done(() => {
    	animateAmountOfViolationsBasedOnPastYears(fireworkConstants.initialPassedYears);
    });

    $('#change-years a').click((e) => {
    	e.preventDefault();

    	let element = $(e.currentTarget);
    	let selectedAmountOfPassedYears = element.attr('data-value');
    	$('#total-number-of-violations .amount-of-years').text(selectedAmountOfPassedYears);

    	let parent = element.parent();
    	parent.find('a').removeClass('active');
		
		element.addClass('active');
    	animateAmountOfViolationsBasedOnPastYears(selectedAmountOfPassedYears);
    })

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

	let ctx = document.getElementById("myChart").getContext('2d');
	let myLineChart = new Chart(ctx, {
		type: 'line',
		data: {labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		    datasets: [{
		        label: '# of Votes',
		        data: [12, 19, 3, 5, 2, 3],
		        backgroundColor: [
		            'rgba(255, 99, 132, 0.2)',
		            'rgba(54, 162, 235, 0.2)',
		            'rgba(255, 206, 86, 0.2)',
		            'rgba(75, 192, 192, 0.2)',
		            'rgba(153, 102, 255, 0.2)',
		            'rgba(255, 159, 64, 0.2)'
		        ],
		        borderColor: [
		            'rgba(255,99,132,1)',
		            'rgba(54, 162, 235, 1)',
		            'rgba(255, 206, 86, 1)',
		            'rgba(75, 192, 192, 1)',
		            'rgba(153, 102, 255, 1)',
		            'rgba(255, 159, 64, 1)'
		        ],
		        borderWidth: 1
		    }]
		}
	});
});

function animateAmountOfViolationsBasedOnPastYears (years) {
	let heading = $('#total-number-of-violations-heading');
	let headingText = parseInt(heading.text());
	let totalAmountOfViolations = fireworks.forThePastNYears(years);
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