import stringifyJSON from 'fast-json-stable-stringify';

export const stringifyKey = (key: any): string => {
    if (key === undefined) {
        return 'undefined';
    }

    return stringifyJSON(key);
};

interface PromiseWithResolvers {
    promise: Promise<void>;
    resolve: (value?: (PromiseLike<void> | void)) => void;
    reject: (reason?: any) => void;
}

// 纯类型技巧，没啥用
const stubPromise = Promise.resolve();

export const promiseWithResolvers = (): PromiseWithResolvers => {
    const result: PromiseWithResolvers = {
        resolve: () => {},
        reject: () => {},
        promise: stubPromise,
    };
    result.promise = new Promise((resolve, reject) => Object.assign(result, {resolve, reject}));
    return result;
};
