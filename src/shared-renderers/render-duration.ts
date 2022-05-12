import {Duration, serialize} from 'tinyduration';

export const renderDuration = (duration: Duration) =>
  `<time datetime="${serialize(duration)}">${duration.hours ?? '00'}:${
    duration.minutes ?? '00'
  }</time>`;
