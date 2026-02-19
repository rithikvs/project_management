import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    project_name: { type: String, required: true },
    description: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'project' });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
