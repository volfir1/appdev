
import { Card, Title, Text, Button, Group, Avatar, Badge, Stack, Container, Grid, Paper } from "@mantine/core";
import { Shield, Mail, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from backend using user ID from localStorage
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }
      const API_BASE = import.meta.env.VITE_API_URL || "";
      try {
        const res = await fetch(`${API_BASE}/api/users/${userId}`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    // Remove tokens/session and redirect
    localStorage.clear();
    sessionStorage.clear();
    const API_BASE = import.meta.env.VITE_API_URL || "";
    fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Text size="lg">Loading profile...</Text>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Text size="lg" color="red">Not logged in. Please log in again.</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Container size="xl" className="py-12">
        <Grid gutter="xl">
          {/* Main Profile Card */}
          <Grid.Col span={12}>
            <Paper shadow="sm" radius="lg" className="bg-white border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-32"></div>
              <div className="px-8 pb-8 -mt-16 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-between w-full max-w-2xl">
                    {/* Avatar */}
                    <Avatar 
                      size={120} 
                      radius="50%"
                      className="bg-red-600 border-4 border-white shadow-lg"
                    >
                      <Text size="xl" className="text-white font-semibold">
                        {user.name ? user.name.split('_').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </Text>
                    </Avatar>

                    {/* Role and Badge Section */}
                    <div className="flex flex-col items-end gap-3">
                      <Badge 
                        size="lg"
                        variant="light" 
                        color="blue"
                        radius="md"
                        className="px-4 py-2"
                        leftSection={<Shield size={14} />}
                      >
                        {user.role ? user.role.toUpperCase() : ''}
                      </Badge>
                      <Text size="sm" className="text-slate-500 font-medium">
                        Role: {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
                      </Text>
                    </div>
                  </div>

                  {/* User Info */}
                  <Title order={1} className="text-slate-800 mb-3 text-3xl font-light mt-6">
                    {user.name || ''}
                  </Title>
                  <div className="flex items-center gap-2 text-slate-600 mb-8">
                    <Mail size={18} className="text-slate-500" />
                    <Text size="lg" className="font-normal">{user.email || ''}</Text>
                  </div>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          {/* Action Cards */}
          <Grid.Col span={12}>
            <div className="flex justify-center">
              <Card shadow="sm" radius="lg" className="bg-white border border-slate-200 hover:shadow-md transition-shadow w-full max-w-md">
                <Stack align="center" className="text-center py-6">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <LogOut size={24} className="text-red-500" />
                  </div>
                  <Title order={3} className="text-slate-800 mb-2">Sign Out</Title>
                  <Text size="sm" className="text-slate-500 mb-4 px-2">
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
            <Paper shadow="sm" radius="lg" className="bg-white border border-slate-200 p-8 text-center">
              <Title order={2} className="text-slate-800 mb-4 font-light">
                Welcome to Your Dashboard
              </Title>
              <Text size="lg" className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                This is your personal dashboard where you can manage your account, update your preferences, and access all the tools you need. Everything is designed to help you stay organized and productive.
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
