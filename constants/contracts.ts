export const SECONDS_IN_EPOCH = 2_419_200 as const;
export const DAYS_IN_EPOCH = 28 as const; // SECONDS_IN_EPOCH / SECONDS_IN_DAY (86_400)
export const EPOCHS_IN_YEAR = 13 as const;
export const MAX_EPOCHS_IN_FUTURE = 130 as const; // 10 * EPOCHS_IN_YEAR
export const MIN_STAKE_DURATION_IN_EPOCH = EPOCHS_IN_YEAR;
export const PWN_TOKEN_DECIMALS = 18 as const;
