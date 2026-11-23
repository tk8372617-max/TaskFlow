import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCheck,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { taskApi } from "../../infrastructure/taskApi";
import { getTaskStats } from "../../application/taskHelpers";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    try {
      setLoading(true);
      setError("");
      setTasks(await taskApi.list(search, filter));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, filter]);
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  async function save(form) {
    try {
      if (editing) {
        await taskApi.update(editing._id, form);
        setNotice("Task updated successfully.");
        setEditing(null);
      } else {
        await taskApi.create(form);
        setNotice("Task added successfully.");
      }
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function toggle(task) {
    try {
      await taskApi.toggle(task._id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function remove(task) {
    if (!window.confirm(`Are you sure you want to delete “${task.title}”?`))
      return;
    try {
      await taskApi.remove(task._id);
      if (editing?._id === task._id) setEditing(null);
      setNotice("Task deleted.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <CheckCheck size={21} />
          </div>
          <span>
            taskflow<span className="brand-dot">.</span>
          </span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <button
          type="button"
          className={`side-link ${activeView === "overview" ? "active" : ""}`}
          onClick={() => {
            setActiveView("overview");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button
          type="button"
          className={`side-link ${activeView === "tasks" ? "active" : ""}`}
          onClick={() => {
            setActiveView("tasks");
            document
              .getElementById("tasks-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <ListTodo size={18} /> My tasks
        </button>
        <div className="sidebar-bottom">
         
          <div className="profile">
            <div className="avatar">TF</div>
            <div>
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            {activeView === "overview" ? "Overview" : "My tasks"}
          </div>
          <div className="topbar-right">
           
          </div>
        </header>
        {activeView === "overview" && (
          <section className="welcome">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> YOUR PRODUCTIVITY SPACE
              </div>
              <h1>
                Good work starts
                <br />
                <span>with a plan.</span>
              </h1>
              <p>
                Organize your priorities and keep your projects moving forward.
              </p>
            </div>
            <div className="welcome-art">
              <div className="art-circle">
                <Target size={54} />
              </div>
              <div className="art-chip">
                <Activity size={15} /> Stay focused
              </div>
            </div>
          </section>
        )}
        {activeView === "overview" && (
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <ClipboardList size={19} />
              </div>
              <span>Total tasks</span>
              <strong>{stats.total}</strong>
              <small>In your workspace</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <ListTodo size={19} />
              </div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
              <small>Ready to work on</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCheck size={19} />
              </div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
              <small>Great progress!</small>
            </div>
          </section>
        )}
        <div className="content-grid" id="tasks-section">
          <section className="tasks-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">YOUR WORKLOAD</span>
                <h2>
                  Tasks <span className="count-badge">{stats.total}</span>
                </h2>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search tasks"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-tabs">
              {["All", "Pending", "Completed"].map((tab) => (
                <button
                  key={tab}
                  className={filter === tab ? "selected" : ""}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {error && (
              <div className="alert-error" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="notice" role="status">
                {notice}
              </div>
            )}
            <div className="task-list">
              {loading ? (
                <div className="empty-state">Loading your tasks...</div>
              ) : tasks.length ? (
                tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={setEditing}
                    onToggle={toggle}
                    onDelete={remove}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <ClipboardList size={25} />
                  </div>
                  <strong>No tasks found</strong>
                  <p>
                    {search
                      ? "Try a different search term."
                      : "Add your first task to get started."}
                  </p>
                </div>
              )}
            </div>
          </section>
          <aside className="form-panel">
            <TaskForm
              editing={editing}
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          </aside>
        </div>
        <footer className="footer">
          Made for focused work <span>•</span> TaskFlow Manager
        </footer>
      </main>
    </div>
  );
}
