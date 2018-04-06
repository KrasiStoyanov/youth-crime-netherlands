'use strict';

import * as headerConstants from '../constants/headerConstants';

function initialize () {
	positionBackgroundWaves();
	calculateHeightOfHeader();

	$(window).resize(() => {
		positionBackgroundWaves();
		calculateHeightOfHeader();
	});
}

function positionBackgroundWaves () {
	let backgroundWaves = $('#header #background-waves');
	let documentTop = 0;
	let bottomOfBackgroundWaves = documentTop + backgroundWaves.outerHeight(true);
	let maxHeightOfBackgroundWavesCalculation = bottomOfBackgroundWaves - headerConstants.maxHeightOfBackgroundWaves;

	maxHeightOfBackgroundWavesCalculation = maxHeightOfBackgroundWavesCalculation > 0 ? -maxHeightOfBackgroundWavesCalculation : maxHeightOfBackgroundWavesCalculation * -1;
	backgroundWaves.css('top', maxHeightOfBackgroundWavesCalculation);
}

function calculateHeightOfHeader() {
	let header = $('#header');
	let backgroundWaves = header.find('#background-waves');
	let topOfBackgroundWaves = backgroundWaves.offset().top;
	let heightOfBackgroundWaves = backgroundWaves.outerHeight(true);
	let documentTop = 0;

	topOfBackgroundWaves = topOfBackgroundWaves > 0 ? -topOfBackgroundWaves : topOfBackgroundWaves * -1;
	let bottomOfBackgroundWaves = documentTop - topOfBackgroundWaves + heightOfBackgroundWaves;

	header.height(bottomOfBackgroundWaves);
}

export {
	initialize
};