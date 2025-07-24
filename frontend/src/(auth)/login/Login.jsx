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
  Flex,
  Image,
} from "@mantine/core";
import { FcGoogle } from "react-icons/fc";
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
      localStorage.setItem("userId", response.data.user._id); // <-- ADD THIS LINE

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
    <Paper bg="linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)" h="100vh">
      <Center h="100vh">
        <Box pos="relative">
          {/* Circular Return Button */}
          <Button
            component={Link}
            to={"/"}
            pos="absolute"
            top={5}
            left={-20}
            w={50}
            h={50}
            radius="xl"
            bg="#FFFFFF"
            c="#EF4444"
            p={0}
          >
            <Text size="xl" fw={600} ml="10" c="#EF4444">
              ←
            </Text>
          </Button>

          <Paper bg="#EF4444" radius="3xl" shadow="xl" display="flex">
            {/* Left side: Form */}
            <Box p={48} flex={1}>
              <Stack gap={32} w={400}>
                {/* Header */}
                <Stack gap={8}>
                  <Text size="xl" fw={600} c="#FFFFFF">
                    Welcome back
                  </Text>
                  <Text size="sm" c="#FECACA">
                    Sign in to your ActOnPov account
                  </Text>
                </Stack>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <Stack gap={20}>
                    {/* Email Input */}
                    <TextInput
                      radius="full"
                      size="md"
                      placeholder="Email address"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error}
                    />

                    {/* Password Input */}
                    <PasswordInput
                      size="md"
                      placeholder="Password"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      radius="full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={error}
                    />

                    <Flex justify="space-between" align="center"></Flex>

                    {/* Buttons */}
                    <Stack gap={16}>
                      {/* Login Button */}
                      <Button
                        type="submit"
                        fullWidth
                        h={48}
                        radius="xl"
                        bg="#DC2626"
                        c="#FFFFFF"
                        loading={isSubmitting}
                        loaderProps={{
                          children: (
                            <MorphingSpinner color="#FFFFFF" size={35} />
                          ),
                        }}
                      >
                        Sign in
                      </Button>

                      {/* Google Login Button
                      <Button
                        variant="filled"
                        fullWidth
                        h={48}
                        leftSection={<FcGoogle size={18} />}
                        radius="xl"
                        bg="#FFFFFF"
                        c="#374151"
                      >
                        Continue with Google
                      </Button> */}
                    </Stack>

                    <Text size="sm" c="#FFFFFF" ta="center">
                      Don't have an account?{" "}
                      <Anchor
                        component={Link}
                        to="/signup"
                        c="#FFFFFF"
                        td="underline"
                        fw={500}
                      >
                        Sign up
                      </Anchor>
                    </Text>
                  </Stack>
                </form>
              </Stack>
            </Box>

            {/* Right side: Illustration */}
            <Box
              flex={1}
              bg="#F87171"
              display="flex"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Image
                src="/src/assets/vectors/login.svg"
                alt="Login illustration"
                fit="contain"
                h={400}
                w={400}
              />
            </Box>
          </Paper>
        </Box>
      </Center>
    </Paper>
  );
}
