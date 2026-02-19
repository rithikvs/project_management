import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
  Tooltip,
  CircularProgress,
  Avatar,
  type SelectChangeEvent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface Task {
  task_id: number;
  project_id: number;
  task_name: string;
  status: string;
  assigned_to: number;
  assigned_to_name?: string;
}

interface Project {
  project_id: number;
  project_name: string;
}

const statusOptions = ['Pending', 'In Progress', 'Completed'];

const statusColors: Record<string, any> = {
  'Pending': { color: '#64748b', bg: '#f1f5f9', icon: <AccessTimeIcon fontSize="small" /> },
  'In Progress': { color: '#4f46e5', bg: '#e0e7ff', icon: <PendingActionsIcon fontSize="small" /> },
  'Completed': { color: '#10b981', bg: '#dcfce7', icon: <CheckCircleIcon fontSize="small" /> },
};

const TasksPage: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({
    project_id: '',
    task_name: '',
    status: 'Pending',
    assigned_to: ''
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      let data = res.data;
      if (Array.isArray(data) && Array.isArray(data[0])) {
        data = data.map((row: any[]) => ({
          project_id: row[0],
          project_name: row[1],
        }));
      }
      const normalized: Project[] = Array.isArray(data)
        ? data
          .map((p: any) => ({
            project_id: Number(p?.project_id),
            project_name: String(p?.project_name ?? ''),
          }))
          .filter((p: Project) => Number.isFinite(p.project_id) && p.project_name.length > 0)
        : [];
      setProjects(normalized);
    } catch {
      // non-blocking
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tasks', {
        params: selectedProjectId ? { project_id: selectedProjectId } : undefined,
      });
      let data = res.data;
      if (Array.isArray(data) && Array.isArray(data[0])) {
        data = data.map((row: any[]) => ({
          task_id: row[0],
          project_id: row[1],
          task_name: row[2],
          status: row[3],
          assigned_to: row[4],
          assigned_to_name: row[5],
        }));
      }

      const normalized: Task[] = Array.isArray(data)
        ? data
          .map((t: any) => ({
            task_id: Number(t?.task_id),
            project_id: Number(t?.project_id),
            task_name: String(t?.task_name ?? ''),
            status: String(t?.status ?? ''),
            assigned_to: Number(t?.assigned_to),
            assigned_to_name: t?.assigned_to_name ? String(t.assigned_to_name) : undefined,
          }))
          .filter(
            (t: Task) =>
              Number.isFinite(t.task_id) &&
              Number.isFinite(t.project_id) &&
              t.task_name.length > 0
          )
        : [];

      setTasks(normalized);
    } catch (e: any) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.project_id) {
      setSelectedProjectId(String(router.query.project_id));
    }
  }, [router.isReady, router.query.project_id]);

  useEffect(() => {
    void fetchTasks();
  }, [selectedProjectId]);

  const handleOpen = (task?: Task) => {
    if (task) {
      setEditTask(task);
      setForm({
        project_id: String(task.project_id),
        task_name: task.task_name,
        status: task.status,
        assigned_to: String(task.assigned_to)
      });
    } else {
      setEditTask(null);
      setForm({ project_id: '', task_name: '', status: 'Pending', assigned_to: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        project_id: form.project_id === '' ? null : Number(form.project_id),
        task_name: form.task_name,
        status: form.status,
        assigned_to: form.assigned_to === '' ? null : Number(form.assigned_to),
      };
      if (editTask) {
        await api.put(`/api/tasks/${editTask.task_id}`, payload);
        showToast('success', 'Task updated');
      } else {
        await api.post('/api/tasks', payload);
        showToast('success', 'Task created');
      }
      await fetchTasks();
      handleClose();
    } catch (e: any) {
      showToast('error', 'Failed to save task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      await fetchTasks();
      showToast('success', 'Task deleted');
    } catch (e) {
      showToast('error', 'Failed to delete task');
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1c23', mb: 1 }}>
              {selectedProjectId
                ? `Tasks: ${projects.find(p => String(p.project_id) === selectedProjectId)?.project_name || 'Project'}`
                : 'All Tasks'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              {selectedProjectId
                ? 'Showing filtered tasks for the selected project.'
                : 'Organize and track individual activities across all projects.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
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
              }
            }}
          >
            Add Task
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
            Filter by Project:
          </Typography>
          <Select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            displayEmpty
            size="small"
            sx={{
              minWidth: 200,
              borderRadius: '12px',
              bgcolor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
            }}
          >
            <MenuItem value="">Show All Projects</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.project_id} value={String(p.project_id)}>
                {p.project_name}
              </MenuItem>
            ))}
          </Select>
          {selectedProjectId && (
            <Button
              size="small"
              onClick={() => setSelectedProjectId('')}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
            >
              Clear Filter
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2.5 }}>Task Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Assigned To</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={24} sx={{ color: '#4f46e5' }} />
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ color: '#94a3b8' }}>No tasks found.</Typography>
                </TableCell>
              </TableRow>
            ) : tasks.map((task) => (
              <TableRow
                key={task.task_id}
                sx={{ '&:hover': { bgcolor: '#f9fafb' }, transition: 'background-color 0.2s' }}
              >
                <TableCell sx={{ py: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor: task.status === 'Completed' ? '#dcfce7' : '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: task.status === 'Completed' ? '#10b981' : '#4f46e5'
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {task.task_name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={projects.find(p => p.project_id === task.project_id)?.project_name || `#${task.project_id}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: '6px', color: '#64748b', borderColor: '#e2e8f0', fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={statusColors[task.status]?.icon || <AccessTimeIcon fontSize="small" />}
                    label={task.status}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      fontWeight: 700,
                      bgcolor: statusColors[task.status]?.bg || '#f1f5f9',
                      color: statusColors[task.status]?.color || '#64748b',
                      px: 0.5
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '10px', bgcolor: '#4f46e5' }}>
                      {(task.assigned_to_name || String(task.assigned_to)).charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {task.assigned_to_name || `User ${task.assigned_to}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpen(task)} size="small" sx={{ mr: 1, color: '#64748b', '&:hover': { color: '#4f46e5' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => setConfirmDeleteId(task.task_id)} size="small" sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { borderRadius: '24px', p: 1, width: '100%', maxWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '24px' }}>
          {editTask ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Task Name"
              name="task_name"
              fullWidth
              value={form.task_name}
              onChange={handleInputChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <Select
              name="project_id"
              value={form.project_id}
              onChange={handleSelectChange}
              fullWidth
              displayEmpty
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="" disabled>Select project</MenuItem>
              {projects.map((p) => (
                <MenuItem key={p.project_id} value={String(p.project_id)}>
                  {p.project_name}
                </MenuItem>
              ))}
            </Select>
            <Select
              name="status"
              value={form.status}
              onChange={handleSelectChange}
              fullWidth
              sx={{ borderRadius: '12px' }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
            <TextField
              label="Assigned To (User ID)"
              name="assigned_to"
              type="number"
              fullWidth
              value={form.assigned_to}
              onChange={handleInputChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: '#4f46e5',
              borderRadius: '12px',
              px: 4,
              fontWeight: 600,
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {editTask ? 'Update' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Task?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b' }}>
            Are you sure you want to delete this task?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDeleteId(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (confirmDeleteId) await handleDelete(confirmDeleteId);
              setConfirmDeleteId(null);
            }}
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.type} variant="filled" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            {toast.message}
          </Alert>
        ) : <span />}
      </Snackbar>
    </Layout>
  );
};

export default TasksPage;
