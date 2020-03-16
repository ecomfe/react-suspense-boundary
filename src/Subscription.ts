export default class Subscription {
    private readonly listeners = new Set<(action: any, key: any) => void>();

    subscribe(listener: (action: any, key: any) => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    notify(action: any, key: any) {
        for (const listener of this.listeners) {
            listener(action, key);
        }
    }

    destroy() {
        this.listeners.clear();
    }
}
