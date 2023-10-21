const UNIT_NAMES = [
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

const UNIT_MULTIPLE = 1024; // use binary bytes

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function formatBytesWithLabel(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const unitChanges = Math.floor(Math.log(bytes) / Math.log(UNIT_MULTIPLE));

  return (
    parseFloat((bytes / Math.pow(UNIT_MULTIPLE, unitChanges)).toFixed(2)) +
    ' ' +
    UNIT_NAMES[unitChanges]
  );
}

export function formatBytes(bytes: number, unit: string): number {
  if (bytes === 0) {
    return 0;
  }
  const unitChanges = UNIT_NAMES.indexOf(unit);

  return parseFloat((bytes / Math.pow(UNIT_MULTIPLE, unitChanges)).toFixed(5));
}

export function getLargestUnit(data: bigint[]): string {
  let index = 0;
  data.map((value) => {
    const unitChanges = Math.floor(
      Math.log(Number(value)) / Math.log(UNIT_MULTIPLE),
    );
    if (unitChanges > index) index = unitChanges;
  });

  return UNIT_NAMES[index];
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

export function get_winning_text(vote: number, options: string[]): string {
  switch (vote) {
    case 0:
      return options[0].length > 0 ? options[0] : "Yes";
    case 1:
      return "No";
    case 2:
      return "Abstain";
    case 3:
      return options[1].length > 0 ? options[1] : "Yes 2";
    default:
      return "";
  }
}