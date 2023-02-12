export function formatDate(date: Date, form: 'short' | 'normal' = 'normal') {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();

	switch (form) {
		case 'normal':
			return monthNames[monthIndex] + ',' + day + ' ' + year;
		case 'short':
			return `${monthIndex}/${day}/${year}`;
	}
}
