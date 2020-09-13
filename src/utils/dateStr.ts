/**
 * Provides a type safe date string.
 * From https://spin.atomicobject.com/2017/06/19/strongly-typed-date-string-typescript/
 */

import { format } from "date-fns";

enum DateStrBrand {}

export type DateStr = string & DateStrBrand;

function checkValidDateStr(str: string): str is DateStr {
  return str.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}

export function toDateStr(date: Date | string): DateStr {
  if (typeof date === "string") {
    if (checkValidDateStr(date)) {
      return date;
    } else {
      throw new Error(`Invalid date string: ${date}`);
    }
  } else {
    const dateString = format(date, "yyyy-MM-dd");
    if (checkValidDateStr(dateString)) {
      return dateString;
    }
  }
  throw new Error(`Shouldn't get here (invalid toDateStr provided): ${date}`);
}
