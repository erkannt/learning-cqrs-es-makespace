export const renderDatetime = (date: Date) =>
  `<time datetime="${date.toISOString()}">${date.toLocaleString()}</time>`;
