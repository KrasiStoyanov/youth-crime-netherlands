'use strict';

import anime from 'animejs';
import * as particleConstants from '../constants/particleConstants';

function animateParticles (selector, duration, loop, delay) {
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
        complete: () => {
        	let particles = $(selector).filter('.to-fill');

        	particles.addClass('filled');
        }
    });
}

export {
	animateParticles
};