import { describe, it, expect, vi } from 'vitest';
import { createTaskService } from '../src/application/taskService.js';

function makeModel() {
  const stored = new Map();
  let nextId = 1;
  const model = {
    stored,
    create: vi.fn(async data => { const task = { _id: String(nextId++), ...data }; stored.set(task._id, task); return task; }),
    find: vi.fn(() => ({ sort: vi.fn(async () => [...stored.values()]) })),
    findByIdAndUpdate: vi.fn(async (id, data) => { if (!stored.has(id)) return null; const task = { ...stored.get(id), ...data }; stored.set(id, task); return task; }),
    findById: vi.fn(async id => { const task = stored.get(id); if (!task) return null; return { ...task, save: async function () { stored.set(id, this); return this; } }; }),
    findByIdAndDelete: vi.fn(async id => { const task = stored.get(id); stored.delete(id); return task || null; })
  };
  return model;
}

describe('task CRUD application service', () => {
  it('creates a task', async () => {
    const model = makeModel(); const service = createTaskService(model);
    const created = await service.create({ title: 'Plan sprint', priority: 'High' });
    expect(created.title).toBe('Plan sprint'); expect(model.create).toHaveBeenCalledOnce();
  });
  it('updates task details', async () => {
    const model = makeModel(); const service = createTaskService(model);
    const created = await service.create({ title: 'Draft plan' });
    const updated = await service.update(created._id, { title: 'Final plan', priority: 'Low' });
    expect(updated.title).toBe('Final plan'); expect(updated.priority).toBe('Low');
  });
  it('toggles task status', async () => {
    const model = makeModel(); const service = createTaskService(model);
    const created = await service.create({ title: 'Review PR' });
    const updated = await service.toggle(created._id);
    expect(updated.status).toBe('Completed');
  });
  it('deletes a task', async () => {
    const model = makeModel(); const service = createTaskService(model);
    const created = await service.create({ title: 'Remove draft' });
    await service.remove(created._id);
    expect(model.stored.has(created._id)).toBe(false);
  });
  it('blocks empty task titles', async () => {
    const service = createTaskService(makeModel());
    await expect(service.create({ title: ' ' })).rejects.toMatchObject({ status: 400 });
  });
});
