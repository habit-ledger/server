try {
  require('dotenv').config();
} catch {}

module.exports = {
  "moduleFileExtensions": [ "js", "json", "ts" ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  "moduleNameMapper": {
    "@app(.*)": "<rootDir>/../src/$1.ts",
    "@e2e(.*)": "<rootDir>/$1",
  },
};
