import React from "react";
import {
  Box,
  Text,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Anchor,
  Flex,
  Stack,
  Center,
  Paper,
} from "@mantine/core";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "./signupSchema";
import { notificationService } from "../../utils/notifications";

export default function SignUpPage() {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(SignupSchema)
  });

  const onSubmit = async (data) => {
    try {
      // Send name, email, password to backend (remove confirmPassword)
      const { name, email, password } = data;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Signup successful:", result);
        notificationService.signupSuccess();
        reset(); // Clear the form
        setTimeout(() => {
          navigate('/login');
        }, 500); // Small delay for notification
      } else {
        notificationService.signupError(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      notificationService.signupError('Network error occurred');
    }
  };

  return (
    <Paper bg="linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)">
      <Center h="100vh">
        <Box pos="relative">
          {/* Circular Return Button */}
          <Button
            pos="absolute"
            component={Link}
            to={"/"}
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
              <Stack gap={28} w={400}>
                {/* Header */}
                <Stack gap={8}>
                  <Text size="xl" fw={600} c="#FFFFFF">
                    Create Account
                  </Text>
                  <Text size="sm" c="#FECACA">
                    Join ActOnPov and start your journey
                  </Text>
                </Stack>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap={18}>
                    <TextInput
                      radius="full"
                      size="md"
                      placeholder="Full Name"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("name")}
                      error={errors.name?.message}
                    />
                    <TextInput
                      radius="full"
                      size="md"
                      placeholder="Email address"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("email")}
                      error={errors.email?.message}
                    />

                    <PasswordInput
                      radius="full"
                      size="md"
                      placeholder="Password"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("password")}
                      error={errors.password?.message}
                    />

                    <PasswordInput
                      radius="full"
                      size="md"
                      placeholder="Confirm Password"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("confirmPassword")}
                      error={errors.confirmPassword?.message}
                    />

                    {/* Buttons */}
                    <Stack gap={16} mt={8}>
                      <Button
                        type="submit"
                        fullWidth
                        h={48}
                        radius="xl"
                        bg="#DC2626"
                        c="#FFFFFF"
                        loading={isSubmitting}
                      >
                        Create Account
                      </Button>

                      {/* <Button
                        variant="filled"
                        fullWidth
                        h={48}
                        leftSection={<FcGoogle size={18} />}
                        radius="xl"
                        bg="#FFFFFF"
                        c="#374151"
                        styles={{
                          root: {
                            "&:hover": {
                              backgroundColor: "#F9FAFB",
                            },
                          },
                        }}
                      >
                        Sign up with Google
                      </Button> */}
                    </Stack>

                    <Text size="sm" c="#FFFFFF" ta="center">
                      Already have an account?{" "}
                      <Anchor
                        component={Link}
                        to={"/login"}
                        c="#FFFFFF"
                        td="underline"
                        fw={500}
                      >
                        Sign in
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
              {/* Simple geometric illustration using CSS */}
              <Box pos="relative" w={350} h={350}>
                {/* Main circle */}
                <Box
                  w={280}
                  h={280}
                  bg="rgba(255, 255, 255, 0.15)"
                  radius="50%"
                  pos="absolute"
                  top={35}
                  left={35}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Inner circle */}
                  <Box
                    w={180}
                    h={180}
                    bg="rgba(255, 255, 255, 0.25)"
                    radius="50%"
                    
                  >
                    {/* Center icon */}
                    <Box
                      w={80}
                      h={80}
                      bg="#FFFFFF"
                      radius="50%"
                     
                    >
                      <Text size="2rem" c="#EF4444">
                        👤
                      </Text>
                    </Box>
                  </Box>
                </Box>

                {/* Floating elements */}
                <Box
                  w={40}
                  h={40}
                  bg="rgba(255, 255, 255, 0.3)"
                  radius="50%"
                  pos="absolute"
                  top={20}
                  right={40}
                />

                <Box
                  w={25}
                  h={25}
                  bg="rgba(255, 255, 255, 0.4)"
                  radius="50%"
                  pos="absolute"
                  bottom={60}
                  left={20}
                />

                <Box
                  w={35}
                  h={35}
                  bg="rgba(255, 255, 255, 0.2)"
                  radius="50%"
                  pos="absolute"
                  bottom={20}
                  right={60}
                />

                {/* Welcome text overlay */}
                <Stack
                  pos="absolute"
                  bottom={-20}
                  w="100%"
                  align="center"
                  gap={4}
                >
                  <Text size="lg" fw={600} c="#FFFFFF" ta="center">
                    Welcome to ActOnPov
                  </Text>
                  <Text size="sm" c="rgba(255, 255, 255, 0.8)" ta="center">
                    Your journey starts here
                  </Text>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Center>
    </Paper>
  );
}
