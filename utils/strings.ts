export function nth(number: number | string) {
  number = Number(number);
  const englishOrdinalRules = new Intl.PluralRules("en", { type: "ordinal" });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  const category = englishOrdinalRules.select(number);
  // @ts-expect-error category contains more items than suffixes but we do not need to care about it
  const suffix = suffixes[category];
  return number + suffix;
}
