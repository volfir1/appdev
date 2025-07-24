import React, { useState, useMemo } from "react";
import { Table, Badge, Group, ActionIcon, Text, Tabs, Card, Avatar, Box } from "@mantine/core";
import { Edit, Trash2, RotateCcw, Shield, User, Calendar, Users, UserCheck, Crown } from "lucide-react";

export default function UserTable({ users, showRecover, onEdit, onDelete, onRecover, formatDate }) {
  const [activeTab, setActiveTab] = useState("all");

  // Categorize users by role
  const categorizedUsers = useMemo(() => {
    const categories = {
      all: users,
      admin: users.filter(user => user.role === 'admin'),
      ngo_staff: users.filter(user => user.role === 'ngo_staff'),
      worker: users.filter(user => user.role === 'worker'),
    };
    return categories;
  }, [users]);

  // Get role configuration
  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        icon: Crown,
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        badgeClass: 'bg-red-500'
      },
      ngo_staff: {
        icon: UserCheck,
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        badgeClass: 'bg-blue-500'
      },
      worker: {
        icon: User,
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        badgeClass: 'bg-green-500'
      }
    };
    return configs[role] || configs.worker;
  };

  // Get tab configuration
  const getTabConfig = (tabKey) => {
    const configs = {
      all: {
        label: 'All Users',
        icon: Users,
        color: 'gray'
      },
      admin: {
        label: 'Administrators',
        icon: Crown,
        color: 'red'
      },
      ngo_staff: {
        label: 'NGO Staff',
        icon: UserCheck,
        color: 'blue'
      },
      worker: {
        label: 'Workers',
        icon: User,
        color: 'green'
      }
    };
    return configs[tabKey];
  };

  const renderUserTable = (userList) => {
    if (userList.length === 0) {
      return (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-400" />
            </div>
            <Text size="lg" className="text-slate-600 font-medium mb-2">
              No users found
            </Text>
            <Text size="sm" className="text-slate-500">
              {activeTab === 'all' ? 'No users available' : `No ${getTabConfig(activeTab).label.toLowerCase()} found`}
            </Text>
          </div>
        </Card>
      );
    }

    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden ">
        <Table highlightOnHover verticalSpacing="lg" horizontalSpacing="xl" className="min-w-full">
          <Table.Thead>
            <Table.Tr className="border-b border-slate-200">
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider py-4">User</Table.Th>
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Role</Table.Th>
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Barangay</Table.Th>
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Status</Table.Th>
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Created</Table.Th>
              <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {userList.map((user) => {
              const roleConfig = getRoleConfig(user.role);
              const IconComponent = roleConfig.icon;
              
              return (
                <Table.Tr
                  key={user._id}
                  className={
                    user.deleted 
                      ? "bg-red-50/50 border-l-4 border-red-400 hover:bg-red-50" 
                      : "hover:bg-slate-50/50 transition-colors duration-150"
                  }
                >
                  <Table.Td className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        size={44}
                        radius="xl"
                        className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
                      >
                        <IconComponent size={20} />
                      </Avatar>
                      <div>
                        <Text className="font-semibold text-slate-900 text-base mb-1">
                          {user.email}
                        </Text>
                        <Text size="sm" className="text-slate-500">
                          ID: {user._id.slice(-8)}
                        </Text>
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={roleConfig.color}
                      size="md"
                      radius="xl"
                      leftSection={<IconComponent size={14} />}
                      className="font-medium"
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {user.barangay ? (
                      <Badge variant="outline" color="indigo" radius="xl" size="sm">
                        {user.barangay.name}
                      </Badge>
                    ) : (
                      <Text size="sm" className="text-slate-500">N/A</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={user.deleted ? "orange" : "teal"}
                      size="sm"
                      radius="xl"
                      className="font-medium"
                    >
                      {user.deleted ? "Deleted" : "Active"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      <Text size="sm">{formatDate(user.createdAt)}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="lg"
                        className="text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                        onClick={() => onEdit(user)}
                        disabled={user.deleted}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      {showRecover ? (
                        <ActionIcon
                          variant="subtle"
                          size="lg"
                          radius="lg"
                          className="text-green-600 hover:bg-green-50 transition-colors duration-150"
                          onClick={() => onRecover(user._id)}
                        >
                          <RotateCcw size={16} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon
                          variant="subtle"
                          size="lg"
                          radius="lg"
                          className="text-red-600 hover:bg-red-50 transition-colors duration-150"
                          onClick={() => onDelete(user._id)}
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    );
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={setActiveTab} className="mb-6">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm rounded-2xl p-2">
          <Tabs.List className="bg-transparent gap-2">
            {Object.keys(categorizedUsers).map((tabKey) => {
              const config = getTabConfig(tabKey);
              const IconComponent = config.icon;
              const count = categorizedUsers[tabKey].length;
              
              return (
                <Tabs.Tab
                  key={tabKey}
                  value={tabKey}
                  leftSection={<IconComponent size={18} />}
                  className={`
                    px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === tabKey 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{config.label}</span>
                    <Badge
                      size="xs"
                      variant="filled"
                      radius="xl"
                      className={
                        activeTab === tabKey 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-200 text-slate-700'
                      }
                    >
                      {count}
                    </Badge>
                  </div>
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Card>

        {Object.keys(categorizedUsers).map((tabKey) => (
          <Tabs.Panel key={tabKey} value={tabKey} className="mt-6">
            {renderUserTable(categorizedUsers[tabKey])}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}