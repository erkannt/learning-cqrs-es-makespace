import {pipe} from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import {renderDatetime, renderDuration} from '../../shared-renderers';
import {Duration} from '../../types/duration';

type PracticalViewModel = {
  title: string;
  freeSlots: number;
  date: Date;
  duration: Duration;
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
				<p>When: ${renderDatetime(practical.date)}</p>
				<p>Duration: ${renderDuration(practical.duration)}</p>
			`
    ),
    RA.map(content => `<li>${content}</li>`),
    listItems => listItems.join('\n'),
    listContent => `<ul>${listContent}</ul>`
  );
