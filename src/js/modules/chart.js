'use strict';

import * as fireworks from '../data/fireworks';

let chart = {};
let ctx = {};
let options = {};
let updatedData = {};

function initializeChart () {
	let years = fireworks.getPastYearsByAge();
	let age = fireworks.getCurrentAge();

	updatedData = updateData(years, age);
	let data = updatedData.data;
	let labels = updatedData.labels;
	let roundToThousand = updatedData.roundToThousand;

	ctx = $('#by-age-chart')[0].getContext('2d');
	options = {
		legend: {
			display: false
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					display: false
				}
			}],
			yAxes: [{
				display: false,
				ticks: {
					min: 0,
					max: roundToThousand,
					stepSize: 1000
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

	console.log(chart)
}

function updateData(years, age) {
	let forThePastNYears = fireworks.forThePastNYears(years, age);
	let data = forThePastNYears.violationsByYears;
	let labels = forThePastNYears.periodKeys;

	let maxNumberFromData = Math.max(...data);
	let roundToThousand = Math.ceil(maxNumberFromData / 1000) * 1000;
	if (roundToThousand - maxNumberFromData < 500) {
		roundToThousand += 500;
	}

	data.unshift('');
	data.push('');

	labels.unshift('');
	labels.push('');
	labels = labels.reverse();

	return {
		data,
		labels,
		roundToThousand
	};
}

function updateChart (years, age) {
	updatedData = updateData(years, age);
	let data = updatedData.data;
	let labels = updatedData.labels;
	let roundToThousand = updatedData.roundToThousand;

	chart.data.datasets[0].data = data;
	chart.data.labels = labels;
	chart.options.scales.yAxes[0].ticks.max = roundToThousand;

	chart.update();
}

export {
	initializeChart,
	updateData,
	updateChart
};