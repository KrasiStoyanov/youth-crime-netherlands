'use strict';

import * as fireworks from '../data/fireworks';

let chart = {};
let ctx = {};
let options = {};
let updatedData = {};
let chartTarget = '';

/**
 * @function
 * @name initializeChart
 * @description Initialize the chart (using ChartJS).
 */
function initializeChart () {
	let years = fireworks.getPastYearsByAge();
	let age = fireworks.getCurrentAge();

	updatedData = updateData(years, age);
	let data = updatedData.data;
	let labels = updatedData.labels;
	let roundMaxNumberToHigher = updatedData.roundMaxNumberToHigher;

	chartTarget = $('#by-age-chart');
	ctx = chartTarget[0].getContext('2d');
	options = {
		legend: {
			display: false
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					display: false
				},
				ticks: {
					fontColor: '#000'
					
				}
			}],
			yAxes: [{
				display: false,
				ticks: {
					min: 0,
					max: roundMaxNumberToHigher,
					stepSize: 1000,
				}
			}]
		},
		tooltips: {
			xAlign: 'center',
			yAlign: 'bottom',
			yPadding: 8,
			xPadding: 24,
			caretSize: 0,
			bodyFontSize: 14,
			bodySpacing: 0,
			displayColors: false,
			backgroundColor: '#353535',
			cornerRadius: 4,
			position: 'custom',
			callbacks: {
 				title: () => {}
	      	}
		}
	};

	Chart.Tooltip.positioners.custom = (elements, position) => {
		let point = elements[0]._view;
		let x = point.x;
		let y = point.y - point.radius - 10;

		return {
	        x: x,
	        y: y
		}
	};

	Chart.defaults.global.defaultFontFamily = 'Karla';
	Chart.defaults.global.defaultFontSize = 14;
	Chart.defaults.global.defaultFontColor = '#fff';
	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
		    datasets: [{
		        data: data,
		        backgroundColor: 'transparent',
		        pointRadius: 7,
		        pointBackgroundColor: '#c3d4db',
		        pointBorderWidth: 0,
		        pointBorderColor: '#c3d4db',
		        pointHoverRadius: 10,
		        pointHoverBackgroundColor: '#e52941',
		        pointHoverBorderColor: '#e52941',
		        borderColor: '#c3d4db',
		        borderWidth: 4
		    }]
		},
		options: options
	});

	chart.stop();
}

/**
 * @function
 * @name updateData
 * @param { Number } years - The amount of past years.
 * @param { Number } age - The new age group.
 * @return { Object } The new data that has to be displayed.
 * @return { Array } The new labels that need to be displayed.
 * @return { Number } The max number until which the chart should visualize the data.
 * @description Change the data for the chart based on user input.
 */
function updateData(years, age) {
	let forThePastNYears = fireworks.forThePastNYears(years, age);
	let data = forThePastNYears.violationsByYears;
	let labels = forThePastNYears.periodKeys;

	let maxNumberFromData = Math.max(...data);
	let roundMaxNumberToHigher = Math.ceil(maxNumberFromData / 1000) * 1000;
	if (maxNumberFromData < 1000) {
		roundMaxNumberToHigher = maxNumberFromData + 150;
	} else {
		if (roundMaxNumberToHigher - maxNumberFromData > 500) {
			roundMaxNumberToHigher -= 500;
		} else if (roundMaxNumberToHigher - maxNumberFromData < 200) {
			roundMaxNumberToHigher += 200;
		}
	}

	data.unshift('');
	data.push('');

	labels.unshift('');
	labels.push('');
	labels = labels.reverse();

	return {
		data,
		labels,
		roundMaxNumberToHigher
	};
}

/**
 * @function
 * @name updateChart
 * @param { Number } years - The amount of past years.
 * @param { Number } age - The new age.
 * @description Update the chart visually after receiving new data from the `updateData` function.
 */
function updateChart (years, age) {
	updatedData = updateData(years, age);

	let data = updatedData.data;
	let labels = updatedData.labels;
	let roundMaxNumberToHigher = updatedData.roundMaxNumberToHigher;

	chart.data.datasets[0].data = data;
	chart.data.labels = labels;
	chart.options.scales.yAxes[0].ticks.max = roundMaxNumberToHigher;

	chart.update();
}

/**
 * @function
 * @name generateFilterOptions
 * @param { Number } age - The new age.
 * @description Generate the filter options - the different ages below the chart.
 */
function generateFilterOptions (ages) {
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
				.append('&nbsp;years old');
			wrapper.append(optionWrapper);

		    optionWrapper.click((e) => changeAge(e));
		}
	}
}

/**
 * @function
 * @name changeAge
 * @param { Object } e - The clicked item.
 * @description Based on user input, change the content of the chart filtered by the selected age group.
 */
function changeAge (e) {
	let option = $(e.currentTarget);
	let age = parseInt(option.find('.years-old').text());
	
	$('#change-age .option').removeClass('active');
	option.addClass('active');

	let byAgePastYears = fireworks.getPastYearsByAge();

	fireworks.saveCurrentAge(age);
	updateChart(byAgePastYears, age);
}

/**
 * @function
 * @name render
 * @description Render the chart.
 */
function render () {
	chart.render();

	chartTarget.addClass('rendering');
}

export {
	initializeChart,
	updateChart,
	generateFilterOptions,
	render
};