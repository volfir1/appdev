import { Card, Title, Text, Button, Group, Avatar, Badge, Stack, Container, Grid, Paper } from "@mantine/core";
import { Shield, Mail, LogOut, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from backend using user ID from localStorage
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      console.log("Debug - userId:", userId);
      console.log("Debug - token exists:", !!token);
      
      if (!userId) {
        setError("No user ID found in localStorage");
        setUser(null);
        setLoading(false);
        return;
      }

      // More robust API base URL handling
      const API_BASE = import.meta.env.VITE_API_URL || 
                      import.meta.env.VITE_API_BASE_URL || 
                      window.location.origin;
      
      console.log("Debug - API_BASE:", API_BASE);
      
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // Add authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}/users/${userId}`, {
          method: 'GET',
          headers,
          credentials: "include"
        });
        
        console.log("Debug - Response status:", res.status);
        console.log("Debug - Response ok:", res.ok);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Debug - Error response:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText || 'Not authenticated'}`);
        }
        
        const data = await res.json();
        console.log("Debug - User data received:", data);
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Debug - Fetch error:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // More robust API base URL handling
      const API_BASE = import.meta.env.VITE_API_URL || 
                      import.meta.env.VITE_API_BASE_URL || 
                      window.location.origin;
      
      await fetch(`${API_BASE}/auth/logout`, { 
        method: "POST", 
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear storage and redirect regardless of API call success
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <Text size="lg" className="text-slate-600">Loading profile...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card shadow="sm" radius="lg" className="bg-white border border-red-200 max-w-md w-full" >
          <Stack align="center" className="text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <Title order={3} className="text-red-600 mb-2">Connection Error</Title>
            <Text size="sm" className="text-slate-600 mb-4">
              {error}
            </Text>
            <Group>
              <Button 
                variant="light" 
                color="blue" 
                onClick={() => window.location.reload()}
                size="sm"
              >
                Retry
              </Button>
              <Button 
                variant="light" 
                color="red" 
                onClick={handleLogout}
                size="sm"
              >
                Logout
              </Button>
            </Group>
          </Stack>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card shadow="sm" radius="lg" className="bg-white border border-slate-200 max-w-md w-full">
          <Stack align="center" className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
              <Shield size={24} className="text-yellow-500" />
            </div>
            <Title order={3} className="text-slate-800 mb-2">Authentication Required</Title>
            <Text size="sm" className="text-slate-600 mb-4">
              Please log in to access your dashboard.
            </Text>
            <Button 
              variant="filled"
              color="blue"
              onClick={() => navigate("/login")}
              size="md"
              fullWidth
            >
              Go to Login
            </Button>
          </Stack>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Container size="xl" className="py-8 sm:py-12 px-4" pt={100}>
        <Grid gutter="xl">
          {/* Main Profile Card */}
          <Grid.Col span={12}>
            <Paper shadow="sm" radius="lg" className="bg-white border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-24 sm:h-32"></div>
              <div className="px-4 sm:px-8 pb-6 sm:pb-8 -mt-12 sm:-mt-16 relative">
                <div className="flex flex-col items-center text-center">
                  {/* Mobile-first responsive layout */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full max-w-2xl gap-4 sm:gap-0">
                    {/* Avatar */}
                    <div className="flex flex-col items-center sm:items-start">
                      <Avatar 
                        size={80}
                        className="sm:w-[120px] sm:h-[120px] bg-red-600 border-4 border-white shadow-lg mb-4 sm:mb-0"
                        radius="50%"
                      >
                        <Text size="lg" className="sm:text-xl text-white font-semibold">
                          {user.name ? user.name.split('_').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </Text>
                      </Avatar>
                    </div>

                    {/* Role and Badge Section */}
                    <div className="flex flex-col items-center sm:items-end gap-2 sm:gap-3">
                      <Badge 
                        size="md"
                        className="sm:text-lg"
                        variant="light" 
                        color="blue"
                        radius="md"
                        leftSection={<Shield size={14} />}
                      >
                        {user.role ? user.role.toUpperCase() : 'USER'}
                      </Badge>
                      <Text size="xs" className="sm:text-sm text-slate-500 font-medium">
                        Role: {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'User'}
                      </Text>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="w-full text-center mt-4 sm:mt-6">
                    <Title order={1} className="text-slate-800 mb-3 text-xl sm:text-3xl font-light">
                      {user.name || 'Unknown User'}
                    </Title>
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-4 sm:mb-8">
                      <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-slate-500 flex-shrink-0" />
                      <Text size="sm" className="sm:text-lg font-normal break-all">
                        {user.email || 'No email provided'}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          {/* Action Cards */}
          <Grid.Col span={12}>
            <div className="flex justify-center">
              <Card shadow="sm" radius="lg" className="bg-white border border-slate-200 hover:shadow-md transition-shadow w-full max-w-md">
                <Stack align="center" className="text-center py-4 sm:py-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <LogOut size={20} className="sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <Title order={3} className="text-slate-800 mb-2 text-lg sm:text-xl">Sign Out</Title>
                  <Text size="xs" className="sm:text-sm text-slate-500 mb-4 px-2">
                    Securely log out of your account
                  </Text>
                  <Button 
                    variant="light"
                    color="red"
                    size="md"
                    radius="md"
                    fullWidth
                    onClick={handleLogout}
                    className="hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </Stack>
              </Card>
            </div>
          </Grid.Col>

          {/* Welcome Message */}
          <Grid.Col span={12}>
            <Paper shadow="sm" radius="lg" className="bg-white border border-slate-200 p-4 sm:p-8 text-center">
              <Title order={2} className="text-slate-800 mb-4 font-light text-lg sm:text-2xl">
                Welcome to Your Dashboard
              </Title>
              <Text size="sm" className="sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                This is your personal dashboard where you can manage your account, update your preferences, and access all the tools you need. Everything is designed to help you stay organized and productive.
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}