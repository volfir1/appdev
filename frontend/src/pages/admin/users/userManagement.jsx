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
      <Container size="xl" className="py-8" mt={30}>
        <Paper className="bg-white shadow-sm rounded-xl p-6 border border-rose-100">
          <Group justify="space-between" className="mb-8">
            <div>
              <Title order={2} className="text-gray-900 font-bold mb-2">
                User Management
              </Title>
              <Text className="text-gray-600">
                Manage user accounts, roles, and permissions
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
              </div>
              <div className="text-sm text-gray-500">
                Active: <span className="font-semibold text-green-600">
                  {activeUsers.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Deleted: <span className="font-semibold text-yellow-600">
                  {deactivatedUsers.length}
                </span>
              </div>
            </div>
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab} color="red" radius="md" className="mb-6">
            <Tabs.List>
              <Tabs.Tab value="active">Active Users</Tabs.Tab>
              <Tabs.Tab value="deactivated">Deactivated Users</Tabs.Tab>
            </Tabs.List>

          <Tabs.Panel value="active" pt="xs">
            <div className="relative">
              <TextInput
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                mb={16}
              />
              <LoadingOverlay visible={loading} className="rounded-xl" overlayProps={{ radius: "md", blur: 2 }} />
              <UserTable
                users={filterUsers(activeUsers)}
                showRecover={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="deactivated" pt="xs">
            <div className="relative">
              <TextInput
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                mb={16}
              />
              <LoadingOverlay visible={loading} className="rounded-xl" overlayProps={{ radius: "md", blur: 2 }} />
              <UserTable
                users={filterUsers(deactivatedUsers)}
                showRecover={true}
                onEdit={handleEdit}
                onRecover={handleRecover}
                formatDate={formatDate}
              />
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
    </div>
  );
}