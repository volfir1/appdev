import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./(auth)/login/Login";
import SignupPage from "./(auth)/signup/Signup";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import BeneficiaryPanel from "./pages/shared/panel/beneficiaryPanel";
import Layout from "./components/Layout/Layout";
import Geospatial from "./pages/admin/geospatial/Geospatial";
import UserManagement from "./pages/admin/users/userManagement";
import UserProfile from "./pages/user/profile/userprofile";
import UserDashboard from "./pages/user/dashboard/userDashboard";
import NgoDashboard from "./pages/ngo/ngoDashboard";
import ReferralsPage from "./pages/shared/referrals/Referrals";
import Programs from "./pages/shared/programs/Programs";
const ProtectedRoute = ({ children, adminOnly, ngoOnly, workerOnly }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== "admin") {
    // If not admin, redirect to their dashboard
    if (role === "ngo_staff") return <Navigate to="/ngo/dashboard" />;
    if (role === "worker") return <Navigate to="/worker/dashboard" />;
    return <Navigate to="/" />;
  }
  if (ngoOnly && role !== "ngo_staff") {
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "worker") return <Navigate to="/worker/dashboard" />;
    return <Navigate to="/" />;
  }
  if (workerOnly && role !== "worker") {
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "ngo_staff") return <Navigate to="/ngo/dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* Standalone Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Worker Side Routes (with Layout, protected) */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute workerOnly>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile/:id" element={<UserProfile />} />
          <Route path="beneficiaries" element={<BeneficiaryPanel />} />
          <Route path="referrals" element={<ReferralsPage />} />
        </Route>

        {/* NGO Side (protected) */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute ngoOnly>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<NgoDashboard />} />
          <Route path="profile/:id" element={<UserProfile />} />
          <Route path="programs" element={<Programs />} />
          <Route path="geospatial" element={<Geospatial key={location.pathname} />} />
        </Route>
        {/* Protected Routes Admin Side */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="panel" element={<BeneficiaryPanel />} />
          <Route path="geo" element={<Geospatial key={location.pathname} />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="referrals" element={<ReferralsPage />} />
          <Route path="programs" element={<Programs />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
