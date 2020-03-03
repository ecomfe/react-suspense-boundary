module.exports = {
    extends: './node_modules/reskript/config/eslint.js',
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                varsIgnorePattern: 'React',
            },
        ],
    },
};
