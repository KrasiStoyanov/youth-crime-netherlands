'use strict';

const RANDOM_DELAY = 'random';
const RANDOM_DELAY_MIN = 100;
const RANDOM_DELAY_MAX = 300;

const random = {
	keyword: RANDOM_DELAY,
	min: RANDOM_DELAY_MIN,
	max: RANDOM_DELAY_MAX
};

const DEFAULT_DURATION = 1500;
const DEFAULT_LOOP = false;
const DEFAULT_DELAY = RANDOM_DELAY;

const defaultValues = {
	duration: DEFAULT_DURATION,
	loop: DEFAULT_LOOP,
	delay: DEFAULT_DELAY
};

export {
	random,
	defaultValues
};