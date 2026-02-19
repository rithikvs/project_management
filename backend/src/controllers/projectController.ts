import { Request, Response } from 'express';
import Project from '../models/Project';

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  const { project_name, description, created_by } = req.body;
  try {
    console.log('Attempting to save project to MongoDB...');
    const newProject = new Project({
      project_name,
      description,
      created_by
    });
    const savedProject = await newProject.save();
    console.log('SUCCESS: Project saved with ID:', savedProject._id);
    res.status(201).json({ message: 'Project created successfully', projectId: savedProject._id });
  } catch (error) {
    console.error('ERROR: Failed to save project:', error);
    res.status(500).json({ error: 'Failed to create project', details: error });
  }
};

// Get all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('created_by', 'name');

    // Format to match old SQL output if needed
    const formattedProjects = projects.map(p => ({
      project_id: p._id,
      project_name: p.project_name,
      description: p.description,
      created_by_name: (p.created_by as any)?.name,
      created_by: (p.created_by as any)?._id || p.created_by
    }));

    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects', details: error });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate('created_by', 'name');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const formattedProject = {
      project_id: project._id,
      project_name: project.project_name,
      description: project.description,
      created_by_name: (project.created_by as any)?.name,
      created_by: (project.created_by as any)?._id || project.created_by
    };

    res.json(formattedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project', details: error });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { project_name, description } = req.body;
  try {
    await Project.findByIdAndUpdate(id, { project_name, description });
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project', details: error });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: error });
  }
};
