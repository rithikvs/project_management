import mongoose from 'mongoose';
import Task from './src/models/Task';
import Project from './src/models/Project';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected');

        const project = await Project.findOne();
        if (!project) {
            console.log('No project found');
            process.exit(0);
        }

        console.log('Using project:', project._id);

        const newTask = new Task({
            project_id: project._id,
            task_name: 'Test Task ' + new Date().getTime(),
            status: 'Pending',
            assigned_to: 'test@example.com'
        });

        const saved = await newTask.save();
        console.log('Saved successfully:', saved._id);
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

test();
