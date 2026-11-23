import { normalizeTask, validateTask } from '../domain/task.js';

export function createTaskService(TaskModel) {
  return {
    async list({ search = '', status = 'All' } = {}) {
      const filter = {};
      if (status !== 'All') filter.status = status;
      if (search.trim()) filter.title = { $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      return TaskModel.find(filter).sort({ createdAt: -1 });
    },
    async create(input) {
      const result = validateTask(input);
      if (!result.valid) { const error = new Error('Please correct the highlighted fields.'); error.status = 400; error.details = result.errors; throw error; }
      return TaskModel.create(normalizeTask(input));
    },
    async update(id, input) {
      const result = validateTask(input);
      if (!result.valid) { const error = new Error('Please correct the highlighted fields.'); error.status = 400; error.details = result.errors; throw error; }
      const updated = await TaskModel.findByIdAndUpdate(id, normalizeTask(input), { new: true, runValidators: true });
      if (!updated) { const error = new Error('Task not found.'); error.status = 404; throw error; }
      return updated;
    },
    async toggle(id) {
      const task = await TaskModel.findById(id);
      if (!task) { const error = new Error('Task not found.'); error.status = 404; throw error; }
      task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
      return task.save();
    },
    async remove(id) {
      const deleted = await TaskModel.findByIdAndDelete(id);
      if (!deleted) { const error = new Error('Task not found.'); error.status = 404; throw error; }
      return deleted;
    }
  };
}
