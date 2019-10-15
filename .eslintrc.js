module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true
    },
    extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ['prettier', 'jest'], // activating esling-plugin-prettier (--fix stuff)
    rules: {
        'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
            'error',
            {
                semi: false,
                singleQuote: true,
                tabWidth: 4
            },
        ],
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules
    },
}