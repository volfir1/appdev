import { notifications } from "@mantine/notifications";

export const notificationService = {
  success: (title, message) => {
    notifications.show({
      title,
      message,
      color: "green",
      position: "top-right",
      autoClose: 4000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  error: (title, message) => {
    notifications.show({
      title,
      message,
      color: "red",
      position: "top-right",
      autoClose: 5000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  warning: (title, message) => {
    notifications.show({
      title,
      message,
      color: "yellow",
      position: "top-right",
      autoClose: 4500,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  info: (title, message) => {
    notifications.show({
      title,
      message,
      color: "blue",
      position: "top-right",
      autoClose: 4000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  // Quick methods with default titles
  loginSuccess: (message = "Welcome back to ActOnPov!") => {
    notifications.show({
      title: "Login Successful",
      message,
      color: "green",
      position: "top-right",
      autoClose: 3500,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  loginError: (message = "Please check your credentials and try again.") => {
    notifications.show({
      title: "Login Failed",
      message,
      color: "red",
      position: "top-right",
      autoClose: 5000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  signupSuccess: (message = "Welcome to ActOnPov! Please check your email for verification.") => {
    notifications.show({
      title: "Account Created Successfully",
      message,
      color: "green",
      position: "top-right",
      autoClose: 4000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },

  signupError: (message = "Please check your information and try again.") => {
    notifications.show({
      title: "Signup Failed",
      message,
      color: "red",
      position: "top-right",
      autoClose: 5000,
      withCloseButton: true,
      withBorder: true,
      style: {
        transition: 'all 0.3s ease-in-out',
        animation: 'slideInRight 0.3s ease-out'
      }
    });
  },
};