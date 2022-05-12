import {pipe} from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';

type PracticalViewModel = {
  title: string;
};

export const renderAvailablePracticals = (
  practicals: ReadonlyArray<PracticalViewModel>
) =>
  pipe(
    practicals,
    RA.map(({title}) => `<h3>${title}</h3>`),
    RA.map(
      title => `
				${title}
				<p>Free slots: 3</p>
				<p>When: <time datetime="2011-11-18T14:54">2011-11-18 14:54</time></p>
				<p>Duration: <time datetime="P2H0M">2h</time></p>
				<p>Trainer: Alice Smith</p>
			`
    ),
    RA.map(content => `<li>${content}</li>`),
    listItems => listItems.join('\n'),
    listContent => `<ul>${listContent}<ul>`
  );
