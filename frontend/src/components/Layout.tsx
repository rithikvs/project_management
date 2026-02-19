import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Button,
    Divider,
    Avatar,
    IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const [userName, setUserName] = useState('Admin User');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.name) {
                    setUserName(decoded.name);
                }
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const menuItems = [
        { text: 'Projects', icon: <FolderIcon />, path: '/projects' },
        { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fe' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#1a1c23',
                        color: '#fff',
                        borderRight: 'none',
                    },
                }}
            >
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#4f46e5',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '20px'
                        }}
                    >
                        P
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                        ProManager
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2, mb: 2 }} />

                <List sx={{ px: 2 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => router.push(item.path)}
                                selected={router.pathname === item.path}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: '#4f46e5',
                                        color: '#fff',
                                        '&:hover': {
                                            bgcolor: '#4338ca',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: '#fff',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: router.pathname === item.path ? '#fff' : '#9ca3af', minWidth: 45 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: router.pathname === item.path ? 600 : 500,
                                        fontSize: '15px'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Avatar sx={{ bgcolor: '#4f46e5', width: 40, height: 40, fontWeight: 600 }}>{userName.charAt(0).toUpperCase()}</Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: '#fff' }}>
                                {userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                                Project Manager
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            borderRadius: '12px',
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#dc2626',
                                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', overflowY: 'auto' }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
