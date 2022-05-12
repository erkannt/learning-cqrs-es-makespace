import {pipe} from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';

type PracticalViewModel = {
  title: string;
  freeSlots: number;
  date: Date;
  duration: string;
  trainerName: string;
};

export const renderAvailablePracticals = (
  practicals: ReadonlyArray<PracticalViewModel>
) =>
  pipe(
    practicals,
    RA.map(
      practical => `
				<h3>${practical.title}</h3>
				<p>Free slots: ${practical.freeSlots}</p>
				<p>When: <time datetime="${
          practical.date.toISOString
        }"> ${practical.date.toLocaleString()} </time></p>
				<p>Duration: <time datetime="${practical.duration}">2h</time></p>
				<p>Trainer: ${practical.trainerName}</p>
			`
    ),
    RA.map(content => `<li>${content}</li>`),
    listItems => listItems.join('\n'),
    listContent => `<ul>${listContent}</ul>`
  );
