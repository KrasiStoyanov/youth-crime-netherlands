'use strict';

import anime from 'animejs';
import * as header from './modules/header';
import * as particles from './modules/particles';
import * as particleConstants from './constants/particleConstants';

$(document).ready(() => {	
	header.initialize();
	
	// Particles
	let headerParticles = $('#particles-header .particles .particle').get();
	particles.animate(headerParticles);

	let path = anime.path('#firework-path #path path');
	let fireworkParticles = $('#firework-particles .particles .particle').get();

	let motionPath = anime({
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
});