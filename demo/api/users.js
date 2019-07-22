import faker from 'faker';

const PAGE_SIZE = 20;
const TOTAL_COUNT = 230;

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

const user = () => {
    return {
        id: faker.random.uuid(),
        name: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        lastSignedIn: faker.date.recent(12),
    };
};

const database = Array(TOTAL_COUNT).fill(null).map(user);

export default {
    async list({pageIndex}) {
        const start = (pageIndex - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        await timeout(1500);

        return {
            pageIndex,
            pageSize: PAGE_SIZE,
            total: TOTAL_COUNT,
            results: database.slice(start, end),
        };
    },
};
