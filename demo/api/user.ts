import {faker} from '@faker-js/faker';

export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    lastSignedIn: Date;
}

export interface UserListRequest {
    pageIndex: number;
}

const PAGE_SIZE = 10;
const TOTAL_COUNT = 230;

const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const user = (): User => {
    return {
        id: faker.string.uuid(),
        name: faker.person.lastName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        lastSignedIn: faker.date.recent({days: 12, refDate: Date.now()}),
    };
};

export default {
    async list({pageIndex}: UserListRequest) {
        // eslint-disable-next-line no-console
        console.log(`[API]: /user?page=${pageIndex}`);

        const start = (pageIndex - 1) * PAGE_SIZE;
        const count = Math.min(PAGE_SIZE, TOTAL_COUNT - start);

        await timeout(1500);

        return {
            pageIndex,
            pageSize: PAGE_SIZE,
            total: TOTAL_COUNT,
            results: Array(count).fill(null).map(user),
        };
    },

    async mustCrash() {
        // eslint-disable-next-line no-console
        console.log('[API]: /user/CRASH');

        await timeout(1000);

        throw new Error('invoked a function that will 100% crash');
    },
};
