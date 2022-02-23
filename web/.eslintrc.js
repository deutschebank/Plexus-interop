module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "airbnb-typescript/base",
        "prettier"
    ],
    "plugins": ["jsdoc"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./packages/tsconfig.settings.json",
        "sourceType": "module"
    },
    "rules": {
        // TODO revisit post-prettier
        "jsdoc/check-indentation": "off", 
        "jsdoc/newline-after-description": "off",
        "import/newline-after-import": "off",
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/member-ordering": "warn",
        // TODO differences of opinion
        "no-console": "error",
        "import/prefer-default-export" : "off",
        "class-methods-use-this": "off",
        "no-plusplus": "off",
        "@typescript-eslint/no-use-before-define": "warn",
        "prefer-template": "warn",
        "no-param-reassign": "warn",
        "no-await-in-loop": "warn",
        "@typescript-eslint/explicit-member-accessibility": "warn",
        "arrow-body-style": "warn",
        "prefer-destructuring": "warn"
    }
};
