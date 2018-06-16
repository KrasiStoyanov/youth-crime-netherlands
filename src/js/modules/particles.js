'use strict';

import anime from 'animejs';
import * as particleConstants from '../constants/particleConstants';

/**
 * @function
 * @name animate
 * @param { Object } selector - The selector for which to trigger the animation.
 * @param { Number } duration - The duration of the animation.
 * @param { Boolean } loop - If the animation should loop.
 * @param { Number } delay - The delay of the animation.
 * @description Create the animation for the given selector.
 */
function animate (selector, duration, loop, delay) {
	duration = duration ? duration : particleConstants.defaultValues.duration;
	loop = loop ? loop : particleConstants.defaultValues.loop;
	delay = delay ? delay : particleConstants.defaultValues.delay;

	let animation = anime({
        targets: selector,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutQuart',
        duration: duration,
        direction: 'alternate',
        loop: loop,
        delay: (el, i, l) => {
        	if (delay === particleConstants.random.keyword) {
        		delay = Math.floor(Math.random() * (particleConstants.random.max - particleConstants.random.min) + particleConstants.random.min);
        	}

        	return i * delay;
        },
        begin: () => {
            $(selector).css('opacity', 1);
        },
        complete: () => {
        	let particles = $(selector).filter('.to-fill');

        	particles.addClass('filled');
        }
    });
}

export {
	animate
};