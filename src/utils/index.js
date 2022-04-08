export const isRenderable = (...deps) => !deps.some(dep => !dep);

export const createSchedule = (entries) => {
  const schedule = [];
  
  for (let i = 0; i !== entries.length; i += 2) {
    schedule.push(entries.slice(i, i + 2));
  };

  return schedule;
};