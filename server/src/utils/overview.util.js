export const generateOverview = (data) => ({
    tasks: data.tasks?.length || 0,
    notes: data.notes?.length || 0,
    habits: data.habits?.length || 0,
    goals: data.goals?.length || 0,
    areas: data.areas?.length || 0,
});
