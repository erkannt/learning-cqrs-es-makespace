export const renderDatetime = (date: Date): string =>
  `<time datetime="${date.toISOString()}">${date.toLocaleString()}</time>`;
