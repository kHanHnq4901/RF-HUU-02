export function GetFormatDate(date: Date): string {
  let str = '';

  str =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0') +
    '000000';

  return str;
}

export function GetFormatTime(date: Date) {
  let str = '';

  str =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0') +
    date.getHours().toString().padStart(2, '0') +
    date.getMinutes().toString().padStart(2, 0) +
    date.getSeconds().toString().padStart(2, '0');

  return str;
}
export function GetFormatMonth(date: Date): string {
  let str = '';

  str =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0');

  return str;
}
