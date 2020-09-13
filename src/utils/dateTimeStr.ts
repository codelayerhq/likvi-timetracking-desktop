/**
 * Provides a type safe date string.
 * From https://spin.atomicobject.com/2017/06/19/strongly-typed-date-string-typescript/
 */

import { format } from "date-fns";

enum DateStrBrand {}

export type DateTimeStr = string & DateStrBrand;

function checkValidDateStr(str: string): str is DateTimeStr {
  return (
    str.match(/^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) !==
    null
  );
}

export function toDateTimeStr(date: Date | string): DateTimeStr {
  if (typeof date === "string") {
    if (checkValidDateStr(date)) {
      return date;
    } else {
      throw new Error(`Invalid date time string: ${date}`);
    }
  } else {
    const dateString = format(date, "yyyy-MM-dd HH:mm:ss");
    if (checkValidDateStr(dateString)) {
      return dateString;
    }
  }
  throw new Error(
    `Shouldn't get here (invalid toDateTimeStr provided): ${date}`
  );
}
