import { describe, it, expect } from 'vitest';
import { getTaskStats, validateTaskForm } from '../application/taskHelpers';

describe('task helpers', () => {
  it('counts total, pending and completed tasks', () => {
    expect(getTaskStats([{status:'Pending'},{status:'Completed'},{status:'Pending'}])).toEqual({total:3,pending:2,completed:1});
  });
  it('requires a non-empty title', () => expect(validateTaskForm({title:'  '})).toBe('Please enter a task title.'));
});
