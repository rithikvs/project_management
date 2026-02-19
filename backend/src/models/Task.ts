import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    task_name: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    assigned_to: { type: String, default: '' },
}, { timestamps: true, collection: 'task' });

// Use existing model if available, otherwise create new one
export default mongoose.models.Task || mongoose.model('Task', taskSchema);
