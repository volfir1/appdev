import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Title,
  Group,
  Text,
  Tabs,
  LoadingOverlay,
  TextInput,
  Badge,
  Stack,
  Card,
} from "@mantine/core";
import UserTable from "./components/userTable";
import EditUserModal from "./components/editUserModals";
import ConfirmModal from "./components/confirmModal";
import { getAllUsers, updateUser, softDeleteUser, recoverUser } from "./userManagementService";
import { notificationService } from "../../../components/Notif/Notfiications";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editBarangay, setEditBarangay] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmReactivate, setConfirmReactivate] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [barangays, setBarangays] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      notificationService.error("Error", "Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const fetchBarangays = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_BASE}/barangays`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBarangays(response.data);
      } catch  {
        notificationService.error("Error", "Failed to fetch barangays");
      }
    };
    fetchBarangays();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditBarangay(user.barangay?._id || null);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    // Validate barangay assignment for worker
    if (editRole === 'worker' && !editBarangay) {
      notificationService.error("Validation Error", "Worker must be assigned to a barangay.");
      return;
    }
    // Always send barangay as null for admin/ngo_staff
    const payload = {
      email: editEmail,
      role: editRole,
      barangay: (editRole === 'admin' || editRole === 'ngo_staff') ? null : editBarangay,
    };
    try {
      await updateUser(selectedUser._id, payload);
      notificationService.success("User Updated", "User details updated successfully");
      setEditModal(false);
      fetchUsers();
    } catch{
      notificationService.error("Error", "Failed to update user");
    }
  };

  const handleDelete = (id) => {
    setTargetUserId(id);
    setConfirmDeactivate(true);
  };

  const handleRecover = (id) => {
    setTargetUserId(id);
    setConfirmReactivate(true);
  };

  const confirmDeactivateUser = async () => {
    try {
      await softDeleteUser(targetUserId);
      notificationService.warning("User Deleted", "User has been soft deleted");
      fetchUsers();
    } catch {
      notificationService.error("Error", "Failed to delete user");
    }
    setConfirmDeactivate(false);
    setTargetUserId(null);
  };

  const confirmReactivateUser = async () => {
    try {
      await recoverUser(targetUserId);
      notificationService.success("User Recovered", "User has been recovered");
      fetchUsers();
    } catch  {
      notificationService.error("Error", "Failed to recover user");
    }
    setConfirmReactivate(false);
    setTargetUserId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [search, setSearch] = useState("");
  const activeUsers = users.filter(u => !u.deleted);
  const deactivatedUsers = users.filter(u => u.deleted);

  // Filter users by search
  const filterUsers = (userList) => {
    if (!search.trim()) return userList;
    const s = search.toLowerCase();
    return userList.filter(u =>
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s) ||
      (u.barangay?.name?.toLowerCase().includes(s) || "")
    );
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Container size="xl" className="py-4 sm:py-8 px-2 sm:px-4" mt={30}>
        <Paper className="bg-white shadow-sm rounded-xl p-3 sm:p-6 border border-rose-100" pt={60}>
          {/* Header Section - Stack on mobile */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <Title order={2} className="text-gray-900 font-bold mb-2 text-xl sm:text-2xl">
                  User Management
                </Title>
                <Text className="text-gray-600 text-sm sm:text-base">
                  Manage user accounts, roles, and permissions
                </Text>
              </div>
              
              {/* Stats - Horizontal scroll on mobile */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 min-w-0">
                <div className="flex-shrink-0 text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    Total Users
                  </div>
                  <div className="font-semibold text-gray-900 text-lg sm:text-xl">
                    {users.length}
                  </div>
                </div>
                <div className="flex-shrink-0 text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    Active
                  </div>
                  <div className="font-semibold text-green-600 text-lg sm:text-xl">
                    {activeUsers.length}
                  </div>
                </div>
                <div className="flex-shrink-0 text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    Deleted
                  </div>
                  <div className="font-semibold text-yellow-600 text-lg sm:text-xl">
                    {deactivatedUsers.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onChange={setActiveTab} color="red" radius="md" className="mb-4 sm:mb-6">
            <Tabs.List className="mb-4">
              <Tabs.Tab value="active" className="text-sm sm:text-base">
                Active Users
              </Tabs.Tab>
              <Tabs.Tab value="deactivated" className="text-sm sm:text-base">
                Deactivated Users
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="active" pt="xs">
              <div className="relative">
                <TextInput
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  mb={16}
                  className="mb-4"
                  size="sm"
                />
                <LoadingOverlay 
                  visible={loading} 
                  className="rounded-xl" 
                  overlayProps={{ radius: "md", blur: 2 }} 
                />
                {/* Mobile-optimized table wrapper */}
                <div className="mobile-table-container">
                  <div className="mobile-table-scroll-hint">
                    <Text size="xs" className="text-gray-500 mb-2 block sm:hidden text-center">
                      ← Swipe to see more columns →
                    </Text>
                  </div>
                  <div className="table-scroll-wrapper">
                    <div className="table-inner-wrapper">
                      <UserTable
                        users={filterUsers(activeUsers)}
                        showRecover={false}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="deactivated" pt="xs">
              <div className="relative">
                <TextInput
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  mb={16}
                  className="mb-4"
                  size="sm"
                />
                <LoadingOverlay 
                  visible={loading} 
                  className="rounded-xl" 
                  overlayProps={{ radius: "md", blur: 2 }} 
                />
                {/* Mobile-optimized table wrapper */}
                <div className="mobile-table-container">
                  <div className="mobile-table-scroll-hint">
                    <Text size="xs" className="text-gray-500 mb-2 block sm:hidden text-center">
                      ← Swipe to see more columns →
                    </Text>
                  </div>
                  <div className="table-scroll-wrapper">
                    <div className="table-inner-wrapper">
                      <UserTable
                        users={filterUsers(deactivatedUsers)}
                        showRecover={true}
                        onEdit={handleEdit}
                        onRecover={handleRecover}
                        formatDate={formatDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Panel>
          </Tabs>

          <EditUserModal
            opened={editModal}
            onClose={() => setEditModal(false)}
            selectedUser={selectedUser}
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            editRole={editRole}
            setEditRole={setEditRole}
            editBarangay={editBarangay}
            setEditBarangay={setEditBarangay}
            barangays={barangays}
            onSubmit={handleEditSubmit}
          />

          <ConfirmModal
            opened={confirmDeactivate}
            onClose={() => setConfirmDeactivate(false)}
            title="Confirm Deactivation"
            message="Are you sure you want to deactivate this user? This will prevent them from logging in until reactivated."
            confirmLabel="Deactivate"
            confirmColor="red"
            onConfirm={confirmDeactivateUser}
          />

          <ConfirmModal
            opened={confirmReactivate}
            onClose={() => setConfirmReactivate(false)}
            title="Confirm Reactivation"
            message="Are you sure you want to reactivate this user? They will be able to log in again."
            confirmLabel="Reactivate"
            confirmColor="green"
            onConfirm={confirmReactivateUser}
          />
        </Paper>
      </Container>

      {/* Enhanced responsive table styles */}
      <style>{`
        .mobile-table-container {
          width: 100%;
          position: relative;
        }

        .table-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          position: relative;
        }

        .table-inner-wrapper {
          width: fit-content;
          min-width: 100%;
        }

        .table-scroll-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .table-scroll-wrapper::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 4px;
        }

        .table-scroll-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }

        .table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        .table-scroll-wrapper table {
          min-width: 800px;
          width: auto;
          border-collapse: collapse;
          margin: 0;
        }

        .table-scroll-wrapper td,
        .table-scroll-wrapper th {
          white-space: nowrap;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .table-scroll-wrapper {
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .table-scroll-wrapper table {
            min-width: 700px;
            font-size: 0.875rem;
          }

          .table-scroll-wrapper td,
          .table-scroll-wrapper th {
            padding: 8px 12px;
          }

          /* Make action buttons smaller on mobile */
          .table-scroll-wrapper button {
            padding: 4px 8px;
            font-size: 0.75rem;
          }

          /* Show scroll hint */
          .mobile-table-scroll-hint {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .table-scroll-wrapper table {
            min-width: 600px;
            font-size: 0.8125rem;
          }

          .table-scroll-wrapper td,
          .table-scroll-wrapper th {
            padding: 6px 8px;
          }

          /* Even smaller buttons on very small screens */
          .table-scroll-wrapper button {
            padding: 3px 6px;
            font-size: 0.6875rem;
            min-height: auto;
          }
        }

        @media (max-width: 480px) {
          .table-scroll-wrapper table {
            min-width: 550px;
            font-size: 0.75rem;
          }

          .table-scroll-wrapper td,
          .table-scroll-wrapper th {
            padding: 4px 6px;
          }
        }

        /* Improve touch targets on mobile */
        @media (hover: none) and (pointer: coarse) {
          .table-scroll-wrapper button {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Hide scroll hint on desktop */
        @media (min-width: 769px) {
          .mobile-table-scroll-hint {
            display: none;
          }
        }

        /* Ensure smooth scrolling */
        .table-scroll-wrapper {
          scroll-behavior: smooth;
        }

        /* Fix for scroll issues on mobile */
        @media (max-width: 768px) {
          .table-scroll-wrapper {
            overscroll-behavior-x: contain;
          }
        }
      `}</style>
    </div>
  );
}