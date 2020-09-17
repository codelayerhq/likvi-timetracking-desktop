/**
 * Provides a type safe date string.
 * From https://spin.atomicobject.com/2017/06/19/strongly-typed-date-string-typescript/
 */

enum DateStrBrand {}

export type DateTimeStrUTC = string & DateStrBrand;

function checkValidDateStr(str: string): str is DateTimeStrUTC {
  return (
    str.match(/^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) !==
    null
  );
}

export function toDateTimeStrUTC(date: Date | string): DateTimeStrUTC {
  if (typeof date === "string") {
    if (checkValidDateStr(date)) {
      return date;
    } else {
      throw new Error(`Invalid date time string: ${date}`);
    }
  } else {
    const isoDate = date.toISOString();
    const dateString = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
    if (checkValidDateStr(dateString)) {
      return dateString;
    }
  }
  throw new Error(
    `Shouldn't get here (invalid toDateTimeStr provided): ${date}`
  );
}
