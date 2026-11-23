const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'Completed'];

export function validateTask(input = {}) {
  const errors = {};
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (!title) errors.title = 'Task title is required.';
  if (title.length > 120) errors.title = 'Title must be 120 characters or fewer.';
  if (input.priority && !priorities.includes(input.priority)) errors.priority = 'Priority must be Low, Medium, or High.';
  if (input.status && !statuses.includes(input.status)) errors.status = 'Status must be Pending or Completed.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeTask(input = {}) {
  return {
    title: input.title.trim(),
    description: typeof input.description === 'string' ? input.description.trim() : '',
    priority: priorities.includes(input.priority) ? input.priority : 'Medium',
    status: statuses.includes(input.status) ? input.status : 'Pending',
    dueDate: input.dueDate || null
  };
}
