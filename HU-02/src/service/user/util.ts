export function GetFormatDate(date: Date): string {
  let str = '';

  str =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0') +
    '000000';

  return str;
}
export function GetFormatMonth(date: Date): string {
  let str = '';

  str =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0');

  return str;
}
