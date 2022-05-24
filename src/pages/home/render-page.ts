export const renderPage = (availabePracticals: string) => `
	<h1>Makespace Practicals</h1>

	<h2>Available Practicals</h2>
	${availabePracticals}

	<a href="schedule-practical">Schedule a new practical</a>

	<form action="/schedule-arbitrary-practical" method="post">
		<input type="submit" value="Schedule arbitrary practical">
	</form>
`;
