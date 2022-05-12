import {pipe} from 'fp-ts/lib/function';

const renderAvailablePracticals = `
	<ul>
		<li>
			<h3>Ultimaker 3D printer</h3>
			<p>Free slots: 3</p>
			<p>Date: 2022-10-30</p>
			<p>Time: 16:00 - 17:00</p>
			<p>Trainer: Alice Smith</p>
		</li>
		<li>
			<h3>Bandsaw</h3>
			<p>Free slots: 2</p>
			<p>Date: 2022-12-30</p>
			<p>Time: 13:00 - 15:00</p>
			<p>Trainer: Bob Jones</p>
		</li>
	</ul>
`;

const renderPage = (availabePracticals: string) => `
	<h1>Makespace Practicals</h1>

	<h2>Available Practicals</h2>
	${availabePracticals}

	<a href="schedule-practical">Schedule a new practical</a>
`;

export const home = pipe(renderAvailablePracticals, renderPage);
