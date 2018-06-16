'use strict';

import anime from 'animejs';
import 'bootstrap';
import Chart from 'chart.js';

import * as chart from './modules/chart';
import * as header from './modules/header';
import * as loading from './modules/loading';
import * as particles from './modules/particles';
import * as fireworks from './data/fireworks';

import * as fireworkConstants from './constants/fireworkConstants';
import * as ageConstants from './constants/ageConstants';
import * as genderConstants from './constants/genderConstants';
import * as ethnicityConstants from './constants/ethnicityConstants';
import * as periodConstants from './constants/periodConstants';

/**
 * @description Scroll to the top of the page, whenever it loads.
 */
window.onbeforeunload = () => {
	window.scrollTo(0, 0);
};

$(document).ready(() => {
	$('body').css('overflow', 'hidden');

	let loadingPromise = new Promise((resolve, reject) => {
		loading.initialize(resolve, reject);
	});

	$('#scroll-down').click(() => {
		let totalNumberOfViolationsTop = $('#total-number-of-violations').offset().top;
		console.log(totalNumberOfViolationsTop)
		$('html, body').animate({ scrollTop: totalNumberOfViolationsTop }, 300, 'swing');
	});

	let ageConstantsPromise = new Promise((resolve, reject) => {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Leeftijd',
			success: (data) => {
				data = data.value;

				ageConstants.save(data);
				resolve();
			}
		});
	});

	let genderConstantsPromise = new Promise((resolve, reject) => {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Geslacht',
			success: (data) => {
				data = data.value;

				genderConstants.save(data);
				resolve();
			}
		});
	});
	
	let ethnicityConstantsPromise = new Promise((resolve, reject) => {
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: 'https://opendata.cbs.nl/ODataApi/odata/71930ned/Herkomstgroeperingen',
				success: (data) => {
					data = data.value;

					ethnicityConstants.save(data);
				resolve();
				}
			});
	});

	let periodConstantsPromise = new Promise((resolve, reject) => {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://opendata.cbs.nl/ODataApi/odata/71930ned/Perioden',
			success: (data) => {
				data = data.value;

				periodConstants.save(data);
				loading.pause();

				resolve();
			}
		});
	});

	let dataPromise = new Promise((resolve, reject) => {
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

				resolve();
	        }
	    });
	});
	
	/**
	 * @description After every AJAX call is done - initialize loading screen and show infographic content.
	 */
	Promise.all([ageConstantsPromise, genderConstantsPromise, ethnicityConstantsPromise, periodConstantsPromise, dataPromise]).then((values) => {
		loading.play();

		/**
		 * @description After the loading is done - show infographic content.
		 */
		loadingPromise.then(() => {
			/**
			 * @description Initialize the data and the header animation.
			 */
			let totalAmountOfViolationsPastYears = fireworks.getPastYearsByTotalAmountOfViolations();
			let byAgePastYears = fireworks.getPastYearsByAge();
			let selectedAge = fireworks.getCurrentAge();
			let ages = ageConstants.get();

			let headerParticles = $('#particles-header .particles .particle').get();
			header.initialize();
			particles.animate(headerParticles);

			/**
			 * @description Initialize the animation for the total amount of violations rocket.
			 */
			let path = anime.path('#firework-path #path path');
			let fireworkParticles = $('#firework-particles .particles .particle').get();
			let totalNumberOfViolationsMotionPath = anime({
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

			totalNumberOfViolationsMotionPath.pause();

			/**
			 * @description Check if the element is visible in the viewport and based on the result show it.
			 */
			let totalNumberOfViolationsHeading = $('#total-number-of-violations-heading');
			let isTotalNumberOfViolationsHeadingVisible = checkIfVisible(totalNumberOfViolationsHeading, 'counting');
			if (totalNumberOfViolationsHeading.hasClass('counting') === false) {
				let isTotalNumberOfViolationsHeadingVisible = checkIfVisible(totalNumberOfViolationsHeading);
				if (isTotalNumberOfViolationsHeadingVisible) {
					animateAmountOfViolationsBasedOnPastYears(totalAmountOfViolationsPastYears);

					totalNumberOfViolationsMotionPath.play();
				}
			}

			$(window).scroll(() => {
				if (totalNumberOfViolationsHeading.hasClass('counting') === false) {
					let isTotalNumberOfViolationsHeadingVisible = checkIfVisible(totalNumberOfViolationsHeading);
					if (isTotalNumberOfViolationsHeadingVisible) {
						animateAmountOfViolationsBasedOnPastYears(totalAmountOfViolationsPastYears);

						totalNumberOfViolationsMotionPath.play();
					}
				}
			});

			chart.initializeChart(ages);
			chart.generateFilterOptions(ages);

			/**
			 * @description Check if the element is visible in the viewport and based on the result show it.
			 */
			let byAge = $('#by-age-chart');
			if (byAge.hasClass('rendering') === false) {
				let isByAgeVisible = checkIfVisible(byAge);
				if (isByAgeVisible) {
					chart.render();
				}
			}

			$(window).scroll(() => {
				if (byAge.hasClass('rendering') === false) {
					let isByAgeVisible = checkIfVisible(byAge);
					if (isByAgeVisible) {
						chart.render();
					}
				}
			});

			/**
			 * @description Change years for the total amount of violations.
			 */
		    $('#total-number-of-violations .change-years a').click((e) => {
		    	let selectedAmountOfPastYears = changeValueOfPastYearsButton(e);
		    	fireworks.savePastYearsByTotalAmountOfViolations(selectedAmountOfPastYears);

		    	let totalAmountOfViolationsPastYears = fireworks.getPastYearsByTotalAmountOfViolations();
		    	animateAmountOfViolationsBasedOnPastYears(totalAmountOfViolationsPastYears);
		    });
			
			/**
			 * @description Change years for the chart.
			 */
		    $('#by-age .change-years a').click((e) => {
		    	let selectedAmountOfPastYears = changeValueOfPastYearsButton(e);
		    	fireworks.savePastyearsByAge(selectedAmountOfPastYears);

		    	let byAgePastYears = fireworks.getPastYearsByAge();
		    	let selectedAge = fireworks.getCurrentAge();
		    	chart.updateChart(byAgePastYears, selectedAge);
		    });
		});
	});
});

/**
 * @function
 * @name checkIfVisible
 * @param { Object } element - The element to chech.
 * @return { Boolean } If the element is visible in the viewport.
 * @description Check if the provided element is visible in the viewport.
 */
function checkIfVisible (element) {
	let scrollTop = $(window).scrollTop();
	let heightOfScreen = $(window).outerHeight();
	let screenBottomScroll = scrollTop + heightOfScreen;

	let totalNumberOfViolationsTop = $(element).offset().top;
	scrollTop = $(window).scrollTop();
	screenBottomScroll = scrollTop + heightOfScreen;
	if (screenBottomScroll >= totalNumberOfViolationsTop + 100) {
		return true;
	}

	return false;
}

/**
 * @function
 * @name changeValueOfPastYearsButton
 * @param { Object } e - The clicked item.
 * @return { Object } The selected amount of past years.
 * @description Change the value of the amount of years that have passed.
 */
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

/**
 * @function
 * @name animateAmountOfViolationsBasedOnPastYears
 * @param { Number } years - The amount of past years.
 * @description Animate the amount of violations for the past years.
 */
function animateAmountOfViolationsBasedOnPastYears (years) {
	let heading = $('#total-number-of-violations-heading');
	let headingText = parseInt(heading.text());
	let forThePastNYears = fireworks.forThePastNYears(years);
	let totalAmountOfViolations = forThePastNYears.numberOfViolations;
	let initialAmount = {
		value: headingText
	};

	heading.addClass('counting');

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