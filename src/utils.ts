import stringifyJSON from 'fast-json-stable-stringify';

export const stringifyKey = (key: any): string => {
    if (key === undefined) {
        return 'undefined';
    }

    return stringifyJSON(key);
};
