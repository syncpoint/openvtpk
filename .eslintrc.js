module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true
    },
    extends: ['eslint:recommended'], // extending recommended config and config derived from eslint-config-prettier
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ['jest'], // activating esling-plugin-prettier (--fix stuff)
    rules: {
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules,
        "no-console": "off"
    }
}