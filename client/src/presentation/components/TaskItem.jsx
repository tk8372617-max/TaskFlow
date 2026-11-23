import { CalendarDays, Check, Circle, Pencil, Trash2 } from 'lucide-react';
export default function TaskItem({ task, onEdit, onToggle, onDelete }) {
  const due = task.dueDate ? new Date(`${task.dueDate.slice(0,10)}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date';
  return <article className={`task-item ${task.status === 'Completed' ? 'is-complete' : ''}`}>
    <button className={`check-button ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => onToggle(task)} aria-label={`Mark ${task.title} ${task.status === 'Completed' ? 'pending' : 'completed'}`}>{task.status === 'Completed' ? <Check size={15}/> : <Circle size={19}/>}</button>
    <div className="task-main"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority} priority</span><span className="due"><CalendarDays size={13}/>{due}</span></div></div>
    <span className={`status-pill ${task.status.toLowerCase()}`}>{task.status}</span>
    <div className="task-actions"><button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={16}/></button><button className="icon-button danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16}/></button></div>
  </article>;
}
