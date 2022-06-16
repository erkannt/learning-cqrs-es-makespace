type ViewModel = {
  listOfPracticals: string;
  practicalCount: number;
};
export const renderPage = (viewModel: ViewModel): string => `
	<h1>Makespace Practicals</h1>

	<h2>${viewModel.practicalCount} Available Practicals</h2>
	<form action="/schedule-arbitrary-practical" method="post">
		<input type="submit" value="Schedule arbitrary practical">
	</form>
	${viewModel.listOfPracticals}

	<a href="schedule-practical">Schedule a new practical</a>

`;
