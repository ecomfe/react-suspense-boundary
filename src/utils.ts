import stringifyJSON from 'fast-json-stable-stringify';

interface Any {
    [key: string]: any;
}

export const omit = (input: Any, omitKey: string): Any => {
    const output = {} as Any;
    for (const key in input) {
        if (input.hasOwnProperty(key) && key !== omitKey) {
            output[key] = input[key];
        }
    }
    return output;
};

export const stringifyKey = (key: any): string => {
    if (key === undefined) {
        return 'undefined';
    }

    return stringifyJSON(key);
};
