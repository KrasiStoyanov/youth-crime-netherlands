'use strict';

import { animateParticles } from './modules/particles';
import * as particleConstants from './constants/particleConstants';

$(document).ready(() => {
	let headerParticles = $('#particles-header .particles .particle').get();

	animateParticles(headerParticles);
});