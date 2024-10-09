export function nth(number) {
    const englishOrdinalRules = new Intl.PluralRules("en", {type: "ordinal"});
    const suffixes = {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th"
    };

    const category = englishOrdinalRules.select(number);
    const suffix = suffixes[category];
    return (number + suffix);
}