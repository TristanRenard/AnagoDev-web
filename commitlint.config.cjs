module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "type-enum": [2, "always", [
      "feat",
      "fix",
      "test",
      "chore",
      "doc",
      "style",
      "refacto",
      "chore",
    ]],
    "subject-case": [2,
      "always",
      "lower-case"
    ],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
}