import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { validateTaskForm } from '../../application/taskHelpers';

const empty = { title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' };
export default function TaskForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  useEffect(() => {
    setForm(editing ? { title: editing.title, description: editing.description || '', priority: editing.priority, status: editing.status, dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : '' } : empty);
    setError('');
  }, [editing]);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); const validation = validateTaskForm(form); if (validation) { setError(validation); return; }
    setError(''); await onSave(form); if (!editing) setForm(empty);
  }
  return <form className="task-form" onSubmit={submit}>
    <div className="form-heading"><div><span className="eyebrow">{editing ? 'UPDATE TASK' : 'NEW TASK'}</span><h2>{editing ? 'Edit task' : 'Create a task'}</h2></div>{editing && <button type="button" className="icon-button" onClick={onCancel} aria-label="Cancel edit"><X size={18}/></button>}</div>
    <label>Task title <span className="required">*</span><input name="title" value={form.title} onChange={change} placeholder="e.g. Design homepage banner" maxLength="120" aria-label="Task title"/></label>
    {error && <p className="field-error" role="alert">{error}</p>}
    <label>Description <textarea name="description" value={form.description} onChange={change} placeholder="Add a few details..." rows="3"/></label>
    <div className="form-grid"><label>Priority<select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Status<select name="status" value={form.status} onChange={change}><option>Pending</option><option>Completed</option></select></label></div>
    <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={change}/></label>
    <button className="primary-button submit-button" type="submit">{editing ? <Save size={17}/> : <Plus size={18}/>} {editing ? 'Save changes' : 'Add task'}</button>
  </form>;
}
