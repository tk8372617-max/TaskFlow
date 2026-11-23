import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TaskForm from '../presentation/components/TaskForm';

describe('TaskForm', () => {
  it('shows validation when title is empty', async () => {
    render(<TaskForm onSave={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a task title.');
  });
  it('submits a task with its title', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Build dashboard' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Build dashboard', priority: 'Medium' })));
  });
});
