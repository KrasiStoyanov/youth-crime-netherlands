'use strict';

import anime from 'animejs';
import * as backgroundWaveConstants from '../constants/backgroundWaveConstants';

function initialize (solidSelector, wavesSelector) {
	let dynamicPoints = backgroundWaveConstants.DEFAULT_POINTS.split(' ');
	let mainPointIndex = backgroundWaveConstants.MAIN_POINT_INDEX;
	let windowWidth = $(window).width();
	let windowHeight = $(window).height();
	let mainPoint = dynamicPoints[mainPointIndex];
	let updatedMainPointValue = backgroundWaveConstants.RATION_FOR_MAIN_POINT * windowHeight;

	squishWavesToRectangle(wavesSelector);
	$(solidSelector)
		.attr('width', '100%')
		.attr('height', '100%');

	mainPoint = mainPoint.replace(/v.*c/, `v${updatedMainPointValue}c`);

	dynamicPoints[mainPointIndex] = mainPoint;
	dynamicPoints = dynamicPoints.join(' ');
	
	// $(wavesSelector).attr('d', dynamicPoints);
	$(window).resize(() => {
		squishWavesToRectangle(wavesSelector);
	});

	// setTimeout(() => {
		animate(solidSelector, wavesSelector);
	// }, 1000);
}

function squishWavesToRectangle (selector) {
	let windowWidth = $(window).width();
	let windowHeight = $(window).height();
	let originalWidthOfWave = 1280;
	let scale = windowWidth / originalWidthOfWave;
	let pathTemplate = `M0 ${windowHeight - 2} L0 ${windowHeight} L${originalWidthOfWave} ${windowHeight} L${originalWidthOfWave} ${windowHeight - 2} z`;

	$(selector)
		.attr('transform', `scale(${scale})`)
		.attr('d', pathTemplate);
}

function responsive (svg) {
	let windowWidth = $(window).width();
	let windowHeight = $(window).height();

	$(svg).attr('viewBox', `0 0 ${windowWidth} ${windowHeight}`);
}

function animate (solidSelector, wavesSelector) {
	debugger;
	let solidAnimation = anime({
        targets: solidSelector,
        strokeDashoffset: [anime.setDashoffset, 0],
        height: {
        	value: 10,
        	duration: 100,
        	easing: 'easeInQuad',
        },
        direction: 'alternate',
        loop: false
    });

	let wavesAnimation = anime({
        targets: wavesSelector,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInQuad',
        duration: 1500,
        translateY: 1000,
        loop: false,
		points: 'M0,0c54.6,0,125.1,9.6,201.3,46.1c130.8,62.6,278.2,171,389.7,171c176.5,0,286-87.5,356.5-108s206-18,262.5-41.5s70-49,70-49V0H0z'
    });
}

export {
	initialize,
	responsive,
	animate
};