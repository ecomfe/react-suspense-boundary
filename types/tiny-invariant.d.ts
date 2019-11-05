declare module 'tiny-invariant' {
    function invariant(value: any, message: string): void;
    function invariant(value: false, message: string): never;
    export default invariant;
}
