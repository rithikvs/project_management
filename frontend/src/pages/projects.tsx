import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Layout from '@/components/Layout';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';

interface Project {
  project_id: number;
  project_name: string;
  description: string;
  created_by: number;
  status?: string;
  created_by_name?: string;
}

const API_BASE = 'http://localhost:5000/api/projects';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      let data = res.data;
      if (Array.isArray(data) && Array.isArray(data[0])) {
        data = data.map((row: any[]) => ({
          project_id: row[0],
          project_name: row[1],
          description: row[2],
          created_by_name: row[3],
          created_by: row[4],
        }));
      }
      setProjects(data);
    } catch (err) {
      showToast('error', 'Failed to fetch projects');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    if (!name.trim()) return showToast('error', 'Project name is required');
    const token = localStorage.getItem('token');
    let created_by = undefined;
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        created_by = decoded.id;
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
    try {
      await axios.post(API_BASE, { project_name: name, description, created_by });
      setName('');
      setDescription('');
      setOpenCreateDialog(false);
      fetchProjects();
      showToast('success', 'Project created successfully');
    } catch (err) {
      showToast('error', 'Failed to create project');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await axios.put(`${API_BASE}/${id}`, { project_name: name, description });
      setEditingId(null);
      setName('');
      setDescription('');
      setOpenCreateDialog(false);
      fetchProjects();
      showToast('success', 'Project updated successfully');
    } catch (err) {
      showToast('error', 'Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchProjects();
      showToast('success', 'Project deleted');
    } catch (err) {
      showToast('error', 'Failed to delete project');
    }
    setShowDeleteId(null);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.project_id);
    setName(project.project_name);
    setDescription(project.description);
    setOpenCreateDialog(true);
  };

  const filteredProjects = projects.filter(p =>
    (p.project_name && p.project_name.toLowerCase().includes(search.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1c23', mb: 1 }}>
            Projects
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage and track all your ongoing projects in one place.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null);
            setName('');
            setDescription('');
            setOpenCreateDialog(true);
          }}
          sx={{
            bgcolor: '#4f46e5',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
            '&:hover': {
              bgcolor: '#4338ca',
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)',
            }
          }}
        >
          New Project
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search projects by name or description..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: '#fff',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#4f46e5' }} />
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Paper
          sx={{
            p: 10,
            textAlign: 'center',
            borderRadius: '24px',
            boxShadow: 'none',
            border: '2px dashed #e2e8f0',
            bgcolor: 'transparent'
          }}
        >
          <FolderIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
            {search ? 'No projects match your search.' : 'No projects found.'}
          </Typography>
          <Button
            onClick={() => setOpenCreateDialog(true)}
            sx={{ mt: 2, color: '#4f46e5', fontWeight: 600 }}
          >
            Create your first project
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} lg={4} key={project.project_id}>
              <Card
                onClick={() => router.push(`/tasks?project_id=${project.project_id}`)}
                sx={{
                  borderRadius: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    borderColor: '#e2e8f0'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        bgcolor: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4f46e5'
                      }}
                    >
                      <FolderIcon />
                    </Box>
                    <Chip
                      label={project.status || 'Active'}
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        bgcolor: project.status === 'Completed' ? '#dcfce7' : '#e0e7ff',
                        color: project.status === 'Completed' ? '#166534' : '#4338ca',
                        border: 'none'
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    {project.project_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineBreak: 'anywhere' }}>
                    {project.description || 'No description provided.'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      By {project.created_by_name || 'Admin'}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit Project">
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); startEdit(project); }}
                      size="small"
                      sx={{
                        color: '#64748b',
                        '&:hover': { color: '#4f46e5', bgcolor: '#e0e7ff' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Project">
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); setShowDeleteId(project.project_id); }}
                      size="small"
                      sx={{
                        color: '#64748b',
                        '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        PaperProps={{
          sx: { borderRadius: '24px', p: 1, maxWidth: 500, width: '100%' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '24px' }}>
          {editingId ? 'Update Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Overhaul"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
            sx={{
              bgcolor: '#4f46e5',
              borderRadius: '12px',
              px: 4,
              fontWeight: 600,
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {editingId ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={showDeleteId !== null}
        onClose={() => setShowDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b' }}>
            Are you sure you want to delete this project? This action cannot be undone and all associated tasks might be affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowDeleteId(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => showDeleteId && handleDelete(showDeleteId)}
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      {toast && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2000,
            bgcolor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {toast.message}
        </Box>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}
