import {faker} from '@faker-js/faker';

export interface HostTiming {
    running: number;
    crashed: number;
    paused: number;
}

export interface Host {
    id: string;
    name: string;
    createdAt: Date;
    times: HostTiming;
}

const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const item = (): Host => {
    return {
        id: faker.datatype.uuid(),
        name: faker.random.word(),
        createdAt: faker.date.past(),
        times: {
            running: faker.datatype.number({min: 0, max: 800}),
            crashed: faker.datatype.number({min: 0, max: 800}),
            paused: faker.datatype.number({min: 0, max: 800}),
        },
    };
};
const database = Array(10).fill(null).map(item);

export default {
    async list() {
        // eslint-disable-next-line no-console
        console.log('[API]: /host');

        await timeout(1000);
        return database;
    },

    async find(id: string) {
        // eslint-disable-next-line no-console
        console.log(`[API]: /host/${id}`);

        await timeout(1000);
        return database.find(item => item.id === id)!;
    },
};
