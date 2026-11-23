import { Router } from 'express';
import Task from '../infrastructure/Task.js';
import { createTaskService } from '../application/taskService.js';

export function makeTaskRouter(TaskModel = Task) {
  const router = Router();
  const service = createTaskService(TaskModel);
  router.get('/', async (req, res, next) => {
    try { res.json({ success: true, data: await service.list({ search: req.query.search || '', status: req.query.status || 'All' }) }); } catch (e) { next(e); }
  });
  router.post('/', async (req, res, next) => {
    try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (e) { next(e); }
  });
  router.put('/:id', async (req, res, next) => {
    try { res.json({ success: true, data: await service.update(req.params.id, req.body) }); } catch (e) { next(e); }
  });
  router.patch('/:id/toggle', async (req, res, next) => {
    try { res.json({ success: true, data: await service.toggle(req.params.id) }); } catch (e) { next(e); }
  });
  router.delete('/:id', async (req, res, next) => {
    try { await service.remove(req.params.id); res.json({ success: true, message: 'Task deleted.' }); } catch (e) { next(e); }
  });
  return router;
}
