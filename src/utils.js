export const omit = (input, omitKey) => {
    const output = {};
    for (const key in input) {
        if (input.hasOwnProperty(key) && key !== omitKey) {
            output[key] = input[key];
        }
    }
    return output;
};
