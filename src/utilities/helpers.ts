export function formatBytesWithLabel(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const unitMultiple = 1024; // use binary bytes
  const unitNames = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];
  const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
  return (
    parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(2)) +
    ' ' +
    unitNames[unitChanges]
  );
}

export function formatBytes(bytes: number): number {
  if (bytes === 0) {
    return 0;
  }
  const unitMultiple = 1024; // use binary bytes

  const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
  return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(2));
}

export function timeLength(length: number) {
  let days = 0;
  let hours = 0;
  let minutes = length;
  const timeStringArray: string[] = [];

  if (minutes >= 60) {
    hours = minutes / 60;
    minutes = minutes % 60;
  }

  if (hours >= 24) {
    days = hours / 24;
    hours = hours % 24;
  }

  days > 0 && timeStringArray.push(`${Math.floor(days)} days`);
  hours > 0 && timeStringArray.push(`${Math.floor(hours)} hours`);
  minutes > 0 && timeStringArray.push(`${minutes} minutes`);

  return timeStringArray.join(', ');
}
