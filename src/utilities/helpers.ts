export function formatBytes(bytes: number) {
  if (bytes == 0) {
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
