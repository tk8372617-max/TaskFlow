export function getTaskStats(tasks) {
  return { total: tasks.length, pending: tasks.filter(t => t.status === 'Pending').length, completed: tasks.filter(t => t.status === 'Completed').length };
}
export function validateTaskForm(form) {
  return form.title.trim() ? '' : 'Please enter a task title.';
}
