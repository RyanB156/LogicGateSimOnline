export module Array {
  export function countBy<T>(array: T[], f: (x: T) => boolean) {
    let count = 0;
    array.forEach(e => {
      if (f(e))
        count++;
    });
    return count;
  }
}
