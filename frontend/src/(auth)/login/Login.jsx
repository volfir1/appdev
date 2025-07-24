import React, { useState } from "react";
import {
  Box,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Center,
  Paper,
  Container,
  ActionIcon,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { notificationService } from "../../components/Notif/Notfiications";
import { MorphingSpinner } from "@/components/Loader/Loader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Sending POST request to the API with email and password
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        { email, password }
      );
      console.log("Login response:", response.data);

      // Save token, role, and userId in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.user._id);

      // Navigate to the home page after successful login
      if (response.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.data.role === "ngo_staff") {
        navigate("/ngo/dashboard");
      } else {
        navigate("/worker/beneficiaries");
      }

      notificationService.loginSuccess();
    } catch (err) {
      console.error("Login error:", err.response);
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);

      if (msg.includes("deleted") || msg.includes("deactivated")) {
        notificationService.deactivatedAcct(msg);
      } else {
        notificationService.error("Login Failed", msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FFF1F2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Background Elements */}
      <Box
        pos="absolute"
        top="10%"
        right="15%"
        w={300}
        h={300}
        style={{
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.08)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        pos="absolute"
        bottom="15%"
        left="10%"
        w={200}
        h={200}
        style={{
          borderRadius: "50%",
          background: "rgba(220, 38, 38, 0.06)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
      <Box
        pos="absolute"
        top="50%"
        left="5%"
        w={150}
        h={150}
        style={{
          borderRadius: "50%",
          background: "rgba(248, 113, 113, 0.04)",
          animation: "float 7s ease-in-out infinite",
        }}
      />

      <Container size="sm" h="100vh">
        <Center h="100vh">
          <Box pos="relative" w="100%" maw={450}>
            
            {/* Half Back Button on Card Edge */}
            <ActionIcon
              component={Link}
              to="/"
              variant="filled"
              size={48}
              radius="xl"
              bg="#FFFFFF"
              c="#EF4444"
              pos="absolute"
              top={16}
              left={-24}
              style={{
                zIndex: 20,
                border: "2px solid rgba(239, 68, 68, 0.1)",
                transition: "all 0.3s ease",
              }}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    borderColor: "#EF4444",
                  }
                }
              }}
            >
              <Text size="lg" fw={600}>←</Text>
            </ActionIcon>

            <Paper
              bg="#FFFFFF"
              radius="3xl"
              p={0}
              w="100%"
              style={{
                overflow: "hidden",
                border: "1px solid rgba(239, 68, 68, 0.1)",
              }}
            >
              {/* Header Section */}
              <Box
                bg="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                p="xl"
                ta="center"
                pos="relative"
              >
                {/* Decorative Elements */}
                <Box
                  pos="absolute"
                  top={-50}
                  right={-50}
                  w={100}
                  h={100}
                  style={{
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <Box
                  pos="absolute"
                  bottom={-30}
                  left={-30}
                  w={60}
                  h={60}
                  style={{
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                />

                <Stack align="center" gap="sm">
                  {/* App Icon */}
                  <Box
                    w={60}
                    h={60}
                    bg="rgba(255, 255, 255, 0.2)"
                    style={{
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Text size="xl" fw={700} c="#FFFFFF">A</Text>
                  </Box>
                  
                  <Text size="2rem" fw={700} c="#FFFFFF" lh={1.2}>
                    Welcome Back
                  </Text>
                  <Text size="md" c="#FECACA" opacity={0.9}>
                    Sign in to your ActOnPov account
                  </Text>
                </Stack>
              </Box>

              {/* Form Section */}
              <Box p="xl">
                <form onSubmit={handleSubmit}>
                  <Stack gap="lg">
                    
                    {/* Email Input */}
                    <Box>
                      <Text size="sm" fw={500} c="#374151" mb="xs">
                        Email Address
                      </Text>
                      <TextInput
                        size="lg"
                        placeholder="Enter your email"
                        variant="filled"
                        bg="#F9FAFB"
                        c="#374151"
                        radius="xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                        styles={{
                          input: {
                            border: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              borderColor: '#EF4444',
                              boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                            }
                          }
                        }}
                      />
                    </Box>

                    {/* Password Input */}
                    <Box>
                      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }} mb="xs">
                        <Text size="sm" fw={500} c="#374151">
                          Password
                        </Text>
                      
                      </Box>
                      <PasswordInput
                        size="lg"
                        placeholder="Enter your password"
                        variant="filled"
                        bg="#F9FAFB"
                        c="#374151"
                        radius="xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                        styles={{
                          input: {
                            border: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              borderColor: '#EF4444',
                              boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                            }
                          }
                        }}
                      />
                    </Box>

                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      radius="xl"
                      bg="#EF4444"
                      c="#FFFFFF"
                      loading={isSubmitting}
                      mt="md"
                      loaderProps={{
                        children: (
                          <MorphingSpinner color="#FFFFFF" size={35} />
                        ),
                      }}
                      styles={{
                        root: {
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#DC2626',
                          },
                          '&:active': {
                            backgroundColor: '#B91C1C',
                          }
                        }
                      }}
                    >
                      <Text fw={600} size="md">
                        Sign In
                      </Text>
                    </Button>

                    {/* Sign Up Link */}
                    <Text size="sm" c="#6B7280" ta="center" mt="md">
                      Don't have an account?{" "}
                      <Anchor
                        component={Link}
                        to="/signup"
                        c="#EF4444"
                        fw={600}
                        style={{ textDecoration: 'none' }}
                        styles={{
                          root: {
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }
                        }}
                      >
                        Sign up for free
                      </Anchor>
                    </Text>

                  </Stack>
                </form>
              </Box>
            </Paper>
          </Box>
        </Center>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
}