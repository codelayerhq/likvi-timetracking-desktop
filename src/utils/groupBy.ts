/*!
 * Group items from an array together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export function groupBy<T>(
  arr: Array<T>,
  criteria: string | ((item: T) => string)
): { [key: string]: Array<T> } {
  return arr.reduce(function (obj: { [key: string]: Array<T> }, item: T) {
    // Check if the criteria is a function to run on the item or a property of it
    const key =
      typeof criteria === "function"
        ? criteria(item)
        : item[criteria as keyof T];

    // If the key doesn't exist yet, create it
    if (!Object.prototype.hasOwnProperty.call(obj, key as string)) {
      obj[key as string] = [];
    }

    // Push the value to the object
    obj[key as string].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
}
