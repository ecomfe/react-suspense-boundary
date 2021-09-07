import {Async} from './interface';

export default class SuspenseError extends Error {
    readonly action: Async<unknown, unknown>;
    readonly params: unknown;
    readonly cause: Error;

    constructor(action: Async<unknown, unknown>, key: unknown, cause: Error) {
        super(cause.message);
        this.action = action;
        this.params = key;
        this.cause = cause;
    }
}
