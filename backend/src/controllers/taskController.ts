import { Request, Response } from 'express';
import Task from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { project_id } = req.query;
    const filter = project_id ? { project_id } : {};

    const tasks = await Task.find(filter);

    const formattedTasks = tasks.map(t => ({
      task_id: t._id,
      project_id: t.project_id,
      task_name: t.task_name,
      status: t.status,
      assigned_to: t.assigned_to,
      assigned_to_name: t.assigned_to || 'Unassigned'
    }));

    res.json(formattedTasks);
  } catch (err: any) {
    console.error('getTasks failed:', err);
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const formattedTask = {
      task_id: task._id,
      project_id: task.project_id,
      task_name: task.task_name,
      status: task.status,
      assigned_to: task.assigned_to
    };

    res.json(formattedTask);
  } catch (err) {
    console.error('getTaskById failed:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    let { project_id, task_name, status, assigned_to } = req.body;
    console.log('--- CREATE TASK START ---');

    // Trim string inputs to avoid hex validation failures
    project_id = typeof project_id === 'string' ? project_id.trim() : project_id;
    assigned_to = typeof assigned_to === 'string' ? assigned_to.trim() : assigned_to;

    console.log('PROJECT_ID (trimmed):', `"${project_id}"`);
    console.log('TASK_NAME:', `"${task_name}"`);
    console.log('ASSIGNED_TO:', `"${assigned_to}"`);

    const taskData: any = {
      task_name,
      status: status || 'Pending',
      assigned_to: assigned_to || ''
    };

    // Validate project_id format
    if (project_id && /^[0-9a-fA-F]{24}$/.test(project_id)) {
      taskData.project_id = project_id;
    } else {
      console.log('ERROR: Invalid Project ID format');
      return res.status(400).json({ error: `Invalid Project ID: "${project_id}"` });
    }

    console.log('Final Data being sent to Mongoose:', JSON.stringify(taskData, null, 2));

    const newTask = new Task(taskData);
    const savedTask = await newTask.save();

    console.log('--- CREATE TASK SUCCESS --- ID:', savedTask._id);
    res.status(201).json({ ...req.body, task_id: savedTask._id });
  } catch (err: any) {
    console.error('--- CREATE TASK FAILED ---');
    console.error('Full Error:', err);
    res.status(500).json({
      error: 'Failed to create task',
      details: err.message,
      name: err.name,
      code: err.code
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { project_id, task_name, status, assigned_to } = req.body;
    console.log('--- UPDATING TASK ---', id);

    project_id = typeof project_id === 'string' ? project_id.trim() : project_id;
    assigned_to = typeof assigned_to === 'string' ? assigned_to.trim() : assigned_to;

    const updateData: any = {
      task_name,
      status: status || 'Pending',
      assigned_to: assigned_to || ''
    };

    if (project_id && /^[0-9a-fA-F]{24}$/.test(project_id)) {
      updateData.project_id = project_id;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ ...req.body, task_id: id });
  } catch (err: any) {
    console.error('updateTask failed:', err);
    res.status(500).json({
      error: 'Failed to update task',
      details: err.message,
      name: err.name
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Task.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('deleteTask failed:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
