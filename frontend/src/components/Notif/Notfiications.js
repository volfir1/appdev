import { notifications } from "@mantine/notifications";

export const notificationService = {
  success: (title, message) => {
    notifications.show({
      title,
      message,
      color: "green",
      position: "top-right",
    });
  },

  error: (title, message) => {
    notifications.show({
      title,
      message,
      color: "red",
      position: "top-right",
    });
  },

  warning: (title, message) => {
    notifications.show({
      title,
      message,
      color: "yellow",
      position: "top-right",
    });
  },

  info: (title, message) => {
    notifications.show({
      title,
      message,
      color: "blue",
      position: "top-right",
    });
  },

  // Quick methods with default titles
  loginSuccess: (message = "Welcome back to ActOnPov!") => {
    notifications.show({
      title: "Login Successful",
      message,
      color: "green",
      position: "top-right",
    });
  },

  loginError: (message = "Please check your credentials and try again.") => {
    notifications.show({
      title: "Login Failed",
      message,
      color: "red",
      position: "top-right",
    });
  },

  signupSuccess: (message = "Welcome to ActOnPov! Please check your email for verification.") => {
    notifications.show({
      title: "Account Created Successfully",
      message,
      color: "green",
      position: "top-right",
    });
  },

  signupError: (message = "Please check your information and try again.") => {
    notifications.show({
      title: "Signup Failed",
      message,
      color: "red",
      position: "top-right",
    });
  },

  deactivatedAcct:(message = "Your account has been deactivated. Please contact support.") => {
    notifications.show({
      title: "Account Deactivated",
      message,
      color: "yellow",
      position: "top-right",
    });
  }
};