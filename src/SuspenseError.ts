import {Fetch} from './context';

export default class SuspenseError extends Error {
    readonly action: Fetch<any, any>;
    readonly key: any;
    readonly actualError: Error;

    constructor(action: Fetch<any, any>, key: any, actualError: Error) {
        super(actualError.message);
        this.action = action;
        this.key = key;
        this.actualError = actualError;
    }
}
