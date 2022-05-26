type ViewModel = {
  listOfPracticals: string;
  practicalCount: number;
  eventCount: number;
};
export const renderPage = (viewModel: ViewModel) => `
	<h1>Makespace Practicals</h1>

	<p>${viewModel.eventCount} events in database</p>

	<h2>${viewModel.practicalCount} Available Practicals</h2>
	<form action="/schedule-arbitrary-practical" method="post">
		<input type="submit" value="Schedule arbitrary practical">
	</form>
	${viewModel.listOfPracticals}

	<a href="schedule-practical">Schedule a new practical</a>

`;
