let data = [];
const getData = fetch('data.json').then((response) => response.json()).then((json) => {
	return json;
});

async function roadMap() {
	data = await getData;

	//generated first day of the first month and last day of last month
	let yFirstDay = new Date(data[0].WHEN).getFullYear();
	let mFirstDay = new Date(data[0].WHEN).getMonth();
	let yLastDay = new Date(data[Object.keys(data).length - 1].WHEN).getFullYear();
	let mLastDay = new Date(data[Object.keys(data).length - 1].WHEN).getMonth();

	let mindate = new Date(yFirstDay, mFirstDay, 1);
	let maxdate = new Date(yLastDay, mLastDay + 1, 0);
	let width = 1200;

	let svg = d3.select('#viz_area');

	let x = d3.scaleTime().domain([ mindate, maxdate ]).nice().range([ 90, width ]);
	//points for the path
	let lineData = [];

	svg.call(d3.axisBottom(x));

	//add path, the circles and lable and sort them by applicant or supervisor
	for (let i = 0; i < Object.keys(data).length; i++) {
		if (data[i].WHO === 'applicant') {
			svg
				.append('circle')
				.attr('id', 'circle')
				.attr('cx', x(new Date(data[i].WHEN)))
				.attr('cy', 100)
				.attr('r', 10)
				.style('fill', 'green')
				.style('z-index', '10');

			svg
				.append('text')
				.attr('x', x(new Date(data[i].WHEN)))
				.attr('y', 120)
				.attr('dy', '.35em')
				.text(data[i].WHAT)
				.style('fill', 'black');

			lineData.push({ x: x(new Date(data[i].WHEN)), y: 100 });
		} else {
			svg
				.append('circle')
				.attr('cx', x(new Date(data[i].WHEN)))
				.attr('cy', 250)
				.attr('r', 10)
				.style('fill', 'blue')
				.style('z-index', '10');
			svg
				.append('text')
				.attr('x', x(new Date(data[i].WHEN)))
				.attr('y', 270)
				.attr('dy', '.35em')
				.text(data[i].WHAT)
				.style('fill', 'black');

			lineData.push({ x: x(new Date(data[i].WHEN)), y: 250 });
		}
	}
	//generate path
	let lineFunction = d3
		.line()
		.x(function(d) {
			return d.x;
		})
		.y(function(d) {
			return d.y;
		})
		.curve(d3.curveLinear);
	svg.append('path').attr('d', lineFunction(lineData)).attr('stroke', 'blue').attr('stroke-dasharray', '3,5');

	let nrMonthsStartToFinish = new Date(data[5].WHEN).getMonth() + 1 - (new Date(data[0].WHEN).getMonth() + 1) + 1;
	let addedWidth = 0;
	let addedMargin = 0;
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
	let monthCounter = 0;
	//create the divided sections in the table and sort by month, also month lables
	for (let i = 0; i < nrMonthsStartToFinish; i++) {
		addedWidth += width / nrMonthsStartToFinish;

		if (i > 0) {
			addedMargin += width / nrMonthsStartToFinish;
			d3
				.select('.description')
				.append('div')
				.attr('class', 'monthGroup')
				.text(monthNames[monthCounter] + ' ' + "'23")
				.style('width', addedWidth - addedMargin + 'px')
				.style('margin-left', addedMargin + 115 + 'px');
			monthCounter += 1;
		} else {
			d3
				.select('.description')
				.append('div')
				.attr('class', 'monthGroup')
				.text(monthNames[mFirstDay] + ' ' + "'23")
				.style('width', addedWidth + 'px')
				.style('margin-left', '115px');
			monthCounter += 1;
		}
	}
}

roadMap();
