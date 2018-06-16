'use strict';

import anime from 'animejs';
import * as loadingConstants from '../constants/loadingConstants';

let loadingAnimation;
let lineDrawingReverseAnimation;
let burningLinesAnimation;
let fireRocketAnimation;

/**
 * @function
 * @name initialize
 * @param { Function } resolve - If everything is done, resolve the promise.
 * @param { Function } reject - If something goes wrong, reject the promise.
 * @description Initialize the loading screen and provide the promise functions to the needed children.
 */
function initialize (resolve, reject) {
	initializeLoadingAnimation(resolve, reject);
	initializeLineDrawingAnimation();
	initializeBurningLinesAnimation();
}

/**
 * @function
 * @name initializeLoadingAnimation
 * @param { Function } resolve - If everything is done, resolve the promise.
 * @param { Function } reject - If something goes wrong, reject the promise.
 * @description Initialize the loading animation and when done resolve the promise.
 */
function initializeLoadingAnimation (resolve, reject) {
	let burningIllustration = $('#loading #burning-illustration').get();
	let loadingPath = anime.path('#loading #loading-illustration #loading-path');
	let burningLines = $(burningIllustration).find('.burning-line').get();

	loadingAnimation = anime({
		targets: burningIllustration,
		translateX: loadingPath('x'),
		translateY: loadingPath('y'),
		easing: 'linear',
		direction: 'reverse',
		duration: loadingConstants.animation.duration,
		complete: () => {
			burningLinesAnimation.pause();
			burningLinesAnimation = null;

			let newBurningLinesAnimation = anime({
				targets: burningLines,
				strokeDashoffset: [anime.setDashoffset, 0],
				easing: 'easeOutQuart',
				duration: 300,
				direction: 'reverse',
				loop: false
			});

			fireRocket(resolve, reject);
		},
	});
}

/**
 * @function
 * @name initializeLineDrawingAnimation
 * @description Initialize the drawing animation.
 */
function initializeLineDrawingAnimation () {
	lineDrawingReverseAnimation = anime({
		targets: '#loading #loading-path',
		strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration: loadingConstants.animation.duration,
        direction: 'reverse',
	});
}

/**
 * @function
 * @name initializeBurningLinesAnimation
 * @description Initialize the burning line animation.
 */
function initializeBurningLinesAnimation () {
	let burningLines = $('#loading #burning-illustration .burning-line').get();

	burningLinesAnimation = anime({
		targets: burningLines,
		strokeDashoffset: [anime.setDashoffset, 0],
		easing: 'easeInOutCirc',
		direction: 'alternate',
		loop: true,
		duration: (el, i, l) => {
			let randomDuration = Math.floor((Math.random() * 300) + 200);

			return randomDuration;
		}
	});
}

/**
 * @function
 * @name fireRocket
 * @param { Function } resolve - If everything is done, resolve the promise.
 * @param { Function } reject - If something goes wrong, reject the promise.
 * @description Initialize the rocket animation and resolve the promise when done.
 */
function fireRocket (resolve, reject) {
	let loadingIllustration = $('#loading #loading-illustration').get();
	let rocket = $(loadingIllustration).find('#rocket').get();

	let loadingIllustrationPositionTop = $(loadingIllustration).offset().top;
	let loadingIllustrationPositionLeft = $(loadingIllustration).offset().left;

	$('#loading')
		.removeClass('d-flex')
		.removeClass('flex-row')
		.removeClass('align-items-center')
		.removeClass('justify-content-center');
	$(loadingIllustration)
		.parent()
		.removeClass('position-relative');
	fireRocketAnimation = anime({
		targets: rocket,
		translateX: [loadingIllustrationPositionLeft, loadingIllustrationPositionLeft + 400],
		translateY: [loadingIllustrationPositionTop, -50],
		scale: [1, 0],
		opacity: [1, 0],
		easing: 'easeInOutQuart',
		duration: 1200,
		complete: () => {
			revealContent();

			resolve();
		}
	});
}

/**
 * @function
 * @name revealContent
 * @description Reveal the infographic content.
 */
function revealContent () {
	$('body').css('overflow', 'initial');
	$('.hidden').removeClass('hidden');
}

/**
 * @function
 * @name pause
 * @description Pause the animation.
 */
function pause () {
	loadingAnimation.pause();
	lineDrawingReverseAnimation.pause();
}

/**
 * @function
 * @name play
 * @description Play the animation.
 */
function play () {
	loadingAnimation.play();
	lineDrawingReverseAnimation.play();
}

export {
	initialize,
	pause,
	play
};