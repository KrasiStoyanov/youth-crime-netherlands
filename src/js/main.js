'use strict';

import * as particles from './modules/particles';
import * as backgroundWaves from './modules/backgroundWaves';
import * as particleConstants from './constants/particleConstants';

$(document).ready(() => {
	// Particles
	let headerParticles = $('#particles-header .particles .particle').get();

	particles.animate(headerParticles);
	
	// Backgrund waves
	let windowWidth = $(window).width();
	let windowHeight = $(window).height();
	let backgroundSolid = $('#background-solid');
	let backgroundWavesParentSelector = $('#background-waves');
	let backgroundWavesSelector = $(backgroundWavesParentSelector).find('.waves');

	backgroundWavesParentSelector.attr('viewBox', `0 0 ${windowWidth} ${windowHeight}`);

	backgroundWaves.responsive(backgroundWavesParentSelector);
	backgroundWaves.initialize(backgroundSolid, backgroundWavesSelector);

	$(window).resize(() => {
		let backgroundWavesParentSelector = $('#background-waves');
		backgroundWaves.responsive(backgroundWavesParentSelector)
	});
});