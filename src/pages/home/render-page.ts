type ViewModel = {
  listOfPracticals: string;
  count: number;
};
export const renderPage = (viewModel: ViewModel) => `
	<h1>Makespace Practicals</h1>

	<h2>${viewModel.count} Available Practicals</h2>
	<form action="/schedule-arbitrary-practical" method="post">
		<input type="submit" value="Schedule arbitrary practical">
	</form>
	${viewModel.listOfPracticals}

	<a href="schedule-practical">Schedule a new practical</a>

`;
