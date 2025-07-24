import { Modal, Stack, Text, TextInput, Select, Group, Button } from "@mantine/core";
import { User, Shield, Edit } from "lucide-react";

export default function EditUserModal({
  opened,
  onClose,
  selectedUser,
  editEmail,
  setEditEmail,
  editRole,
  setEditRole,
  editBarangay,
  setEditBarangay,
  barangays,
  onSubmit
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Edit size={16} className="text-blue-600" />
          </div>
          <Text className="text-lg font-semibold text-gray-900">Edit User</Text>
        </div>
      }
      radius="lg"
      size="md"
    >
      <Stack gap="lg" className="mt-4">
        <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
          <Text size="sm" className="text-gray-600 mb-1">Current User ID</Text>
          <Text className="font-mono text-sm text-gray-800">
            {selectedUser?._id}
          </Text>
        </div>
        <TextInput
          label="Email Address"
          placeholder="Enter email address"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          radius="md"
          className="rounded-lg"
          leftSection={<User size={16} className="text-gray-400" />}
        />
        <Select
          label="User Role"
          placeholder="Select role"
          data={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
            { value: "ngo_staff", label: "NGO Staff" },
            { value: "worker", label: "Worker" },
          ]}
          value={editRole}
          onChange={setEditRole}
          radius="md"
          leftSection={<Shield size={16} className="text-gray-400" />}
        />
        <Select
          label="Barangay"
          placeholder="Select barangay"
          data={barangays.map(b => ({ value: b._id, label: b.name }))}
          value={editBarangay}
          onChange={setEditBarangay}
          radius="md"
          leftSection={<Shield size={16} className="text-gray-400" />}
          disabled={editRole === 'admin' || editRole === 'ngo_staff'}
        />
        <Group justify="flex-end" className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="subtle"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-6"
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}