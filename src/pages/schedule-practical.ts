export const schedulePractical = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Schedule Practical</title>
    <link rel="stylesheet" href="/static/vanilla.css">
  </head>
  <body>
		<h1>Schedule a practical</h1>

		<form action="" method="post">
			<fieldset>
				<label for="date">Date and Time:</label>
				<input type="datetime-local" name="date">

				<label for="capacity">Capacity</label>
				<input type="number" name="capacity">

				<label for="requiredQuizzes[]">Required Quizzes</label>
				<input type="text" name="requiredQuizzes[]">
				<input type="text" name="requiredQuizzes[]">

				<input type="submit" value="Schedule the practical">
			</fieldset>
		</form>
  </body>
</html>
`;
