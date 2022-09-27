/**
 * https://codegolf.stackexchange.com/questions/114495/topple-the-sandpile
 */
export const makeFastTopple = (width) => {
  const g = (a) =>
    (b = a.map((n, i) => {
      const F = (d) => ~m | i % width && a[i + d] >> 2;
      return (n % 4) + F((m = width)) + F(-width) + F((m = -1)) + F(!++i);
    })) +
      0 ==
    a + 0
      ? a
      : g(b);
  return g;
};
