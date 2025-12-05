import { faker } from "@faker-js/faker";
import { loadUserData, saveUserData } from "../storage/file.storage.js";
import { generateOverview } from "../utils/overview.util.js";

export const dataService = {
    getData(email) {
        const data = loadUserData(email);
        if (!data.overview) data.overview = generateOverview(data);
        return data;
    },

    saveData(email, newData) {
        const current = loadUserData(email);
        saveUserData(email, { ...current, ...newData });
    },

    generateDemo(email) {
        const data = loadUserData(email);

        data.tasks = Array.from({ length: 100 }, () => ({
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            completed: faker.datatype.boolean(),
            dueDate: faker.date.soon(),
            createdAt: new Date(),
        }));

        data.notes = Array.from({ length: 100 }, () => ({
            id: faker.string.uuid(),
            title: faker.lorem.words(3),
            content: faker.lorem.paragraph(),
            createdAt: new Date(),
        }));

        data.habits = Array.from({ length: 100 }, () => ({
            id: faker.string.uuid(),
            name: faker.word.noun(),
            streak: faker.number.int({ min: 0, max: 50 }),
            createdAt: new Date(),
        }));

        data.goals = Array.from({ length: 100 }, () => ({
            id: faker.string.uuid(),
            title: faker.company.catchPhrase(),
            progress: faker.number.int({ min: 0, max: 100 }),
            createdAt: new Date(),
        }));

        data.areas = Array.from({ length: 10 }, () => ({
            id: faker.string.uuid(),
            name: faker.word.adjective(),
        }));

        data.overview = generateOverview(data);

        saveUserData(email, data);
        return data;
    },
};
