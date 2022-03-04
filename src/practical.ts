import {Command} from './commands';
import {Event} from './events';

export type Practical = (
  history: ReadonlyArray<Event>
) => (command: Command) => ReadonlyArray<Event>;

export const practical: Practical = () => () => [];
