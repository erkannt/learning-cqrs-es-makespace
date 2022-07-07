import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { QuizIdCodec } from '../types/quiz-id';

const paramsCodec = t.type({
  requiredQuizzes: tt.withFallback(t.readonlyArray(QuizIdCodec), []),
  title: tt.withFallback(t.string, ''),
  capacity: tt.withFallback(tt.NumberFromString, 5),
  date: tt.withFallback(tt.DateFromISOString, new Date()),
});

type Params = t.TypeOf<typeof paramsCodec>;

const renderPage = (form: string) => `
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
			${form}
		</body>
	</html>
`;

export const schedulePractical = (params: unknown): E.Either<unknown, string> =>
  pipe(
    params,
    paramsCodec.decode,
    E.bimap(formatValidationErrors, renderForm),
    E.map(renderPage),
  );

const renderForm = (params: Params) => `
	<form action="" method="post">
		<fieldset>
			<label for="title">Title of Practical</label>
			<input type="text" name="title" value="${params.title}">

			<label for="date">Date and Time:</label>
			<input type="datetime-local" name="date" value=${params.date.toISOString()}>

			<label for="capacity">Capacity</label>
			<input type="number" name="capacity" value="${params.capacity}">

			<label for="requiredQuizzes[]">Required Quizzes</label>
			<input type="text" name="requiredQuizzes[]">
			<input type="text" name="requiredQuizzes[]">

			<input type="submit" value="Schedule the practical">
		</fieldset>
	</form>
`;
