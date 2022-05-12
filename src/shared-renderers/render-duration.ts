import {Duration} from '../types/duration';

const asIsoString = (d: Duration) => `P${d.hours}H${d.minutes}M`;

const forHumans = (d: Duration) => `${d.hours}:${d.minutes}`;

export const renderDuration = (duration: Duration) =>
  `<time datetime="${asIsoString(duration)}">${forHumans(duration)}</time>`;
