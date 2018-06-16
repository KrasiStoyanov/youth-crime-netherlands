'use strict';

import * as headerConstants from '../constants/headerConstants';

/**
 * @function
 * @name initialize
 * @description Initialize the header by calling the needed functions, also when the window size changes.
 */
function initialize () {
	positionBackgroundWaves();

	$(window).resize(() => {
		positionBackgroundWaves();
	});
}

/**
 * @function
 * @name positionBackgroundWaves
 * @description Position the wave background effect correctly based on the dimensions of the window.
 */
function positionBackgroundWaves () {
	let backgroundWaves = $('#header #background-waves');
	let bottomOfBackgroundWaves = backgroundWaves.outerHeight(true);
	let maxHeightOfBackgroundWavesCalculation = bottomOfBackgroundWaves - headerConstants.maxHeightOfBackgroundWaves;

	maxHeightOfBackgroundWavesCalculation = maxHeightOfBackgroundWavesCalculation > 0 ? -maxHeightOfBackgroundWavesCalculation : maxHeightOfBackgroundWavesCalculation * -1;
	backgroundWaves.css('top', maxHeightOfBackgroundWavesCalculation);
}

export {
	initialize
};