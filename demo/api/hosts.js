import faker from 'faker';

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

const item = () => {
    return {
        id: faker.random.uuid(),
        name: faker.random.word(),
        createdAt: faker.date.past(),
        times: {
            running: faker.random.number({min: 0, max: 800}),
            crashed: faker.random.number({min: 0, max: 800}),
            paused: faker.random.number({min: 0, max: 800}),
        },
    };
};
const database = Array(10).fill(null).map(item);

export default {
    async list() {
        await timeout(1000);
        return database;
    },

    async find({id}) {
        await timeout(1000);
        return database.find(item => item.id === id);
    },
};
