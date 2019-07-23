import faker from 'faker';

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
    list() {
        return Promise.resolve(database);
    },

    find({id}) {
        const value = database.find(item => item.id === id);
        return Promise.resolve(value);
    },
};
