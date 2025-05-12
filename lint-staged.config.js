// https://github.com/okonet/lint-staged#configuration
export default {
  "src/**/*.vue": ["eslint --fix", "stylelint --fix"],
  "**/*.{js,ts}": "eslint --fix",
};
