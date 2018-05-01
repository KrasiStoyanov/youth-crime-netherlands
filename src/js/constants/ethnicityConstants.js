'use strict';

let ethnicities = {};
function save (data) {
	data.map((ethnicity, index) => {
		let key = ethnicity.Title;
		let value = parseInt(ethnicity.Key);

		switch (key.split(' ')[0]) {
			case 'Totaal':
				key = 'total';
				break;
			case 'Overig':
				key = 'other';
				break;
		}

		ethnicities[key] = value;
	});
}

function get () {
	return ethnicities;
}

export {
	save,
	get
};