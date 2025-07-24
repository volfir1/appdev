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
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/auth/register`, {
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
    <>
      <Paper 
        bg="linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)" 
        style={{ 
          minHeight: '100vh', 
          position: 'relative', 
          overflow: 'hidden',
          padding: '20px'
        }}
      >
        {/* Static background elements */}
        <Box
          pos="absolute"
          top="5%"
          left="5%"
          w={{ base: 80, sm: 100, md: 120 }}
          h={{ base: 80, sm: 100, md: 120 }}
          bg="rgba(239, 68, 68, 0.06)"
          radius="50%"
        />
        <Box
          pos="absolute"
          top="15%"
          right="8%"
          w={{ base: 60, sm: 80, md: 100 }}
          h={{ base: 60, sm: 80, md: 100 }}
          bg="rgba(248, 113, 113, 0.08)"
          radius="50%"
        />
        <Box
          pos="absolute"
          top="45%"
          left="2%"
          w={{ base: 50, sm: 70, md: 90 }}
          h={{ base: 50, sm: 70, md: 90 }}
          bg="rgba(239, 68, 68, 0.04)"
          radius="50%"
        />
        <Box
          pos="absolute"
          bottom="20%"
          right="15%"
          w={{ base: 70, sm: 90, md: 110 }}
          h={{ base: 70, sm: 90, md: 110 }}
          bg="rgba(220, 38, 38, 0.05)"
          radius="50%"
        />
        <Box
          pos="absolute"
          bottom="5%"
          left="20%"
          w={{ base: 40, sm: 60, md: 80 }}
          h={{ base: 40, sm: 60, md: 80 }}
          bg="rgba(239, 68, 68, 0.03)"
          radius="50%"
        />

        <Center style={{ minHeight: '100vh' }}>
          <Box 
            pos="relative"
            w="100%"
            maw={480}
          >
            {/* Enhanced Return Button */}
            <Button
              pos="absolute"
              component={Link}
              to={"/"}
              top={{ base: -15, sm: -10, md: 5 }}
              left={{ base: -10, sm: -15, md: -20 }}
              w={{ base: 50, sm: 55 }}
              h={{ base: 50, sm: 55 }}
              radius="xl"
              bg="#FFFFFF"
              c="#EF4444"
              p={0}
              style={{
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)',
                border: '2px solid rgba(239, 68, 68, 0.1)',
                transition: 'all 0.3s ease',
                zIndex: 10,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(239, 68, 68, 0.25)',
                  backgroundColor: '#FEFEFE'
                }
              }}
            >
              <Text size="lg" fw={700} ml="2" c="#EF4444">
                ←
              </Text>
            </Button>

            <Paper 
              bg="#EF4444" 
              radius={{ base: "xl", sm: "2xl", md: "3xl" }}
              shadow="xl" 
              p={{ base: 30, sm: 40, md: 50 }}
              style={{
                boxShadow: '0 25px 60px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Enhanced pattern overlay */}
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                  background: `
                    radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 70%),
                    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)
                  `,
                  pointerEvents: 'none'
                }}
              />
              
              <Stack gap={{ base: 25, sm: 30 }} w="100%" pos="relative">
                {/* Enhanced Header with better mobile spacing */}
                <Stack gap={12} ta="center">
                  <Text 
                    size="2rem"
                    fw={700} 
                    c="#FFFFFF"
                    style={{
                      letterSpacing: '-0.5px',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)'
                    }}
                  >
                    Create Account
                  </Text>
                  <Text 
                    size="md"
                    c="#FECACA"
                    fw={400}
                    px={{ base: 10, sm: 0 }}
                    style={{ 
                      lineHeight: 1.5,
                      textAlign: 'center',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                    }}
                  >
                    Join ActOnPov and start your journey towards meaningful action
                  </Text>
                </Stack>

                {/* Form with enhanced mobile styling */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap={{ base: 18, sm: 20 }}>
                    <TextInput
                      radius="xl"
                      size="lg"
                      placeholder="Full Name"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("name")}
                      error={errors.name?.message}
                      styles={{
                        input: {
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease',
                          fontSize: '16px',
                          fontWeight: 500,
                          height: '50px',
                          '&:focus': {
                            borderColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-1px)'
                          },
                          '&::placeholder': {
                            color: '#9CA3AF',
                            fontWeight: 400
                          }
                        },
                        error: {
                          color: '#FF0000',
                          fontSize: '14px',
                          fontWeight: 600
                        }
                      }}
                    />
                    
                    <TextInput
                      radius="xl"
                      size="lg"
                      placeholder="Email address"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("email")}
                      error={errors.email?.message}
                      styles={{
                        input: {
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease',
                          fontSize: '16px',
                          fontWeight: 500,
                          height: '50px',
                          '&:focus': {
                            borderColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-1px)'
                          },
                          '&::placeholder': {
                            color: '#9CA3AF',
                            fontWeight: 400
                          }
                        },
                        error: {
                          color: '#FF0000',
                          fontSize: '14px',
                          fontWeight: 600
                        }
                      }}
                    />

                    <PasswordInput
                      radius="xl"
                      size="lg"
                      placeholder="Password"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("password")}
                      error={errors.password?.message}
                      styles={{
                        input: {
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease',
                          fontSize: '16px',
                          fontWeight: 500,
                          height: '50px',
                          '&:focus': {
                            borderColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-1px)'
                          },
                          '&::placeholder': {
                            color: '#9CA3AF',
                            fontWeight: 400
                          }
                        },
                        error: {
                          color: '#FF0000',
                          fontSize: '14px',
                          fontWeight: 600
                        }
                      }}
                    />

                    <PasswordInput
                      radius="xl"
                      size="lg"
                      placeholder="Confirm Password"
                      variant="filled"
                      bg="#FFFFFF"
                      c="#374151"
                      {...register("confirmPassword")}
                      error={errors.confirmPassword?.message}
                      styles={{
                        input: {
                          border: '2px solid transparent',
                          transition: 'all 0.3s ease',
                          fontSize: '16px',
                          fontWeight: 500,
                          height: '50px',
                          '&:focus': {
                            borderColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-1px)'
                          },
                          '&::placeholder': {
                            color: '#9CA3AF',
                            fontWeight: 400
                          }
                        },
                        error: {
                          color: '#FF0000',
                          fontSize: '14px',
                          fontWeight: 600
                        }
                      }}
                    />

                    {/* Enhanced Button with better mobile sizing */}
                    <Stack gap={18} mt={{ base: 14, sm: 16 }}>
                      <Button
                        type="submit"
                        fullWidth
                        h={{ base: 52, sm: 56 }}
                        radius="xl"
                        bg="#F43F5E" // More vibrant rose color
                        c="#FFFFFF"
                        loading={isSubmitting}
                        fw={600}
                        size="lg"
                        styles={{
                          root: {
                            border: '2px solid #FECACA',
                            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                            position: 'relative',
                            overflow: 'hidden',
                            fontSize: '16px',
                            backgroundColor: '#F43F5E',
                            boxShadow: '0 4px 16px rgba(244,63,94,0.10)',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          },
                          rootHovered: {
                            backgroundColor: '#BE123C',
                            boxShadow: '0 8px 32px rgba(244,63,94,0.25)',
                            transform: 'translateY(-2px) scale(1.03)',
                          },
                          rootActive: {
                            backgroundColor: '#F43F5E',
                            transform: 'translateY(0px) scale(1)',
                          }
                        }}
                      >
                        Create Account
                      </Button>
                    </Stack>

                    <Text 
                      size="md"
                      c="#FFFFFF" 
                      ta="center" 
                      mt={8}
                      px={{ base: 10, sm: 0 }}
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    >
                      Already have an account?{" "}
                      <Anchor
                        component={Link}
                        to={"/login"}
                        c="#FFFFFF"
                        fw={600}
                        style={{
                          textDecoration: 'none',
                          borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
                          paddingBottom: '2px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderBottomColor: '#FFFFFF',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
                          }
                        }}
                      >
                        Sign in
                      </Anchor>
                    </Text>
                  </Stack>
                </form>
              </Stack>
            </Paper>
          </Box>
        </Center>
      </Paper>

      {/* CSS for responsive text only */}
      <style>{`
        /* No animations - removed for performance */
      `}</style>
    </>
  );
}