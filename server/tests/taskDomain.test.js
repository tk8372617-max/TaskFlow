import { describe, it, expect } from 'vitest';
import { normalizeTask, validateTask } from '../src/domain/task.js';

describe('task domain', () => {
  it('rejects an empty title', () => expect(validateTask({ title: '  ' }).valid).toBe(false));
  it('accepts a valid title', () => expect(validateTask({ title: 'Prepare report' }).valid).toBe(true));
  it('trims title and applies defaults', () => {
    expect(normalizeTask({ title: '  Demo  ' })).toMatchObject({ title: 'Demo', priority: 'Medium', status: 'Pending', description: '' });
  });
  it('rejects an unsupported priority', () => expect(validateTask({ title: 'Task', priority: 'Urgent' }).valid).toBe(false));
});
