// src/utils/generateDemoData.js (hoặc generateDemoData.js)
// ĐÃ ĐƯỢC NÂNG CẤP 100% – BẤM 1 LẦN = CÓ 60 NGÀY REVIEW ĐẸP LUNG LINH

import { faker } from '@faker-js/faker';

export const generateDemoData = () => {
    const today = new Date();

    // Tạo 60 ngày Daily Review gần nhất (càng về trước càng ít năng lượng một chút cho tự nhiên)
    const dailyReviews = Array.from({ length: 60 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Tạo dữ liệu tự nhiên hơn
        const rating = faker.number.int({ min: 2, max: 5 });
        const moodOptions = ["Tuyệt vời", "Bình thường", "Không tốt"];
        const moodIndex = rating >= 5 ? 0 : rating <= 2 ? 2 : 1;
        const mood = moodOptions[moodIndex];

        return {
            date: dateStr,
            rating,
            mood,
            wins: faker.lorem.sentence({ min: 3, max: 8 }).replace(/\.$/, ''),
            grateful: faker.lorem.sentence({ min: 4, max: 10 }).replace(/\.$/, ''),
            improve: faker.lorem.sentence({ min: 3, max: 7 }).replace(/\.$/, ''),
            energy: faker.number.int({ min: 45, max: 98 })
        };
    });

    return {
        // Tasks – đẹp như Notion
        tasks: Array.from({ length: 25 }, () => ({
            id: faker.string.uuid(),
            title: faker.hacker.phrase().replace(/^./, s => s.toUpperCase()),
            completed: faker.datatype.boolean({ probability: 0.4 }),
            dueDate: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
            priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
            tags: faker.helpers.arrayElements(['work', 'personal', 'health', 'learning'], { min: 0, max: 2 })
        })),

        // Notes – giống Obsidian
        notes: Array.from({ length: 15 }, () => ({
            id: faker.string.uuid(),
            title: faker.lorem.words({ min: 3, max: 8 }),
            content: faker.lorem.paragraphs({ min: 2, max: 6 }),
            createdAt: faker.date.recent({ days: 90 }).toISOString(),
            tags: faker.helpers.arrayElements(['idea', 'journal', 'meeting', 'book', 'project'], { min: 1, max: 3 })
        })),

        // Goals – giống Momentum
        goals: Array.from({ length: 8 }, () => ({
            id: faker.string.uuid(),
            title: faker.company.catchPhrase(),
            progress: faker.number.int({ min: 10, max: 95 }),
            targetDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
            category: faker.helpers.arrayElement(['Health', 'Career', 'Learning', 'Finance', 'Relationships'])
        })),

        // Habits – đẹp như Streaks
        habits: Array.from({ length: 10 }, () => ({
            id: faker.string.uuid(),
            name: faker.helpers.arrayElement([
                'Uống 2 lít nước', 'Tập gym', 'Đọc sách 30 phút', 'Thiền 10 phút',
                'Viết nhật ký', 'Ngủ trước 11h', 'Học tiếng Anh', 'Code 1h',
                'Đi bộ 10k bước', 'Không ăn đồ ngọt'
            ]),
            streak: faker.number.int({ min: 3, max: 180 }),
            completedToday: faker.datatype.boolean({ probability: 0.75 }),
            color: faker.helpers.arrayElement(['indigo', 'pink', 'green', 'yellow', 'purple', 'blue'])
        })),

        // QUAN TRỌNG NHẤT: DAILY REVIEWS – BÂY GIỜ CÓ RỒI!
        dailyReviews
    };
};