import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  TextInput, 
  Textarea, 
  Table, 
  Title, 
  Badge, 
  Container,
  Paper,
  Group,
  Stack,
  ActionIcon,
  Text,
  Loader,
  Card,
  Grid,
  Divider,
  Tooltip,
  Avatar,
  Box,
  ScrollArea
} from '@mantine/core';
import { Edit, Trash2, Plus, Calendar, FileText, Users, Activity } from 'lucide-react';
import { getPrograms, createProgram, updateProgram, deleteProgram } from './programService';


const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});

  const role = localStorage.getItem('role');

  const fetchPrograms = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrograms();
      setPrograms(data);

      
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
    setLoading(false);
  }, [role]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must have at least 2 characters';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must have at least 10 characters';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editing) {
        await updateProgram(editing._id, formData);
      } else {
        await createProgram(formData);
      }
      await fetchPrograms();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving program:', error);
    }
    setSubmitting(false);
  };

  const handleEdit = (program) => {
    setEditing(program);
    setFormData({
      name: program.name || '',
      description: program.description || '',
      startDate: program.startDate || '',
      endDate: program.endDate || '',
    });
    setOpened(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteProgram(id);
        await fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpened(false);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setErrors({});
    setEditing(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch  {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return <Badge color="indigo" variant="light" size="sm" radius="xl">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge color="teal" variant="light" size="sm" radius="xl">Active</Badge>;
    } else {
      return <Badge color="gray" variant="light" size="sm" radius="xl">Ended</Badge>;
    }
  };

  const getProgressDays = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const elapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    
    if (now < start) return { elapsed: 0, total, percentage: 0 };
    if (now > end) return { elapsed: total, total, percentage: 100 };
    
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return { elapsed: Math.max(0, elapsed), total, percentage };
  };

  // Stats calculation
  const stats = {
    total: programs.length,
    active: programs.filter(p => {
      const now = new Date();
      return now >= new Date(p.startDate) && now <= new Date(p.endDate);
    }).length,
    upcoming: programs.filter(p => new Date() < new Date(p.startDate)).length,
    ended: programs.filter(p => new Date() > new Date(p.endDate)).length
  };

  // Filtering and search logic
  const filteredPrograms = programs.filter((program) => {
    // Search by name or description
    const matchesSearch =
      program.name?.toLowerCase().includes(search.toLowerCase()) ||
      program.description?.toLowerCase().includes(search.toLowerCase());
    // Status filter
    let matchesStatus = true;
    if (filterStatus !== 'all') {
      const now = new Date();
      const start = new Date(program.startDate);
      const end = new Date(program.endDate);
      if (filterStatus === 'active') matchesStatus = now >= start && now <= end;
      else if (filterStatus === 'upcoming') matchesStatus = now < start;
      else if (filterStatus === 'ended') matchesStatus = now > end;
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" pt={100}>
      <Container size="xl" className="py-4 sm:py-8 px-2 sm:px-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <Group justify="space-between" className="mb-4 sm:mb-6" wrap="wrap">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <Title order={1} className="text-slate-800 font-bold mb-2 text-2xl sm:text-3xl">
                Programs Management
              </Title>
              <Text size="lg" className="text-slate-600 text-sm sm:text-base">
                Manage assistance programs and track their progress
              </Text>
              {role === 'ngo_staff' && (
                <Text size="sm" c="blue.7" mt={8} className="text-xs sm:text-sm">
                  You only see programs created by your account.
                </Text>
              )}
              {role === 'admin' && (
                <Text size="sm" c="teal.7" mt={8} className="text-xs sm:text-sm">
                  You can view and manage all programs in the system.
                </Text>
              )}
            </div>
            <Button
              leftSection={<Plus size={18} />}
              onClick={() => setOpened(true)}
              size="md"
              radius="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              New Program
            </Button>
          </Group>

          {/* Stats Cards */}
          <Grid className="mb-6 sm:mb-8">
            <Grid.Col span={{ base: 6, sm: 6, md: 3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <Group justify="space-between" wrap="nowrap">
                  <div className="min-w-0">
                    <Text size="sm" className="text-slate-600 font-medium text-xs sm:text-sm">Total Programs</Text>
                    <Text size="xl" className="text-slate-800 font-bold text-lg sm:text-xl">{stats.total}</Text>
                  </div>
                  <Avatar size={32} radius="lg" className="bg-blue-100 hidden sm:flex sm:w-10 sm:h-10">
                    <FileText size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                  </Avatar>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 6, md: 3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <Group justify="space-between" wrap="nowrap">
                  <div className="min-w-0">
                    <Text size="sm" className="text-slate-600 font-medium text-xs sm:text-sm">Active</Text>
                    <Text size="xl" className="text-teal-600 font-bold text-lg sm:text-xl">{stats.active}</Text>
                  </div>
                  <Avatar size={32} radius="lg" className="bg-teal-100 hidden sm:flex sm:w-10 sm:h-10">
                    <Activity size={16} className="text-teal-600 sm:w-5 sm:h-5" />
                  </Avatar>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 6, md: 3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <Group justify="space-between" wrap="nowrap">
                  <div className="min-w-0">
                    <Text size="sm" className="text-slate-600 font-medium text-xs sm:text-sm">Upcoming</Text>
                    <Text size="xl" className="text-indigo-600 font-bold text-lg sm:text-xl">{stats.upcoming}</Text>
                  </div>
                  <Avatar size={32} radius="lg" className="bg-indigo-100 hidden sm:flex sm:w-10 sm:h-10">
                    <Calendar size={16} className="text-indigo-600 sm:w-5 sm:h-5" />
                  </Avatar>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 6, md: 3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <Group justify="space-between" wrap="nowrap">
                  <div className="min-w-0">
                    <Text size="sm" className="text-slate-600 font-medium text-xs sm:text-sm">Completed</Text>
                    <Text size="xl" className="text-slate-600 font-bold text-lg sm:text-xl">{stats.ended}</Text>
                  </div>
                  <Avatar size={32} radius="lg" className="bg-slate-100 hidden sm:flex sm:w-10 sm:h-10">
                    <Users size={16} className="text-slate-600 sm:w-5 sm:h-5" />
                  </Avatar>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </div>

        {/* Programs Table + Search/Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                <TextInput
                  placeholder="Search by name or description"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  size="sm"
                  className="w-full sm:w-64"
                />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm text-slate-700 w-full sm:w-auto sm:ml-0 md:ml-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader color="blue" size="lg" />
                <Text className="text-slate-600 mt-4">Loading programs...</Text>
              </div>
            </div>
          ) : (
            <ScrollArea>
              <div className="min-w-[800px]">
                <Table highlightOnHover verticalSpacing="lg" horizontalSpacing="xl" className="min-w-full">
                  <Table.Thead>
                    <Table.Tr className="border-b border-slate-200">
                      <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider py-4 min-w-[200px]">Program</Table.Th>
                      <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider min-w-[250px]">Description</Table.Th>
                      <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider min-w-[150px]">Timeline</Table.Th>
                      <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider min-w-[100px]">Status</Table.Th>
                      <Table.Th className="text-slate-700 font-semibold text-sm uppercase tracking-wider min-w-[100px]">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredPrograms.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={role === 'admin' ? 6 : 5} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                              <FileText size={32} className="text-slate-400" />
                            </div>
                            <div>
                              <Text size="lg" className="text-slate-600 font-medium mb-2">No programs found</Text>
                              <Text size="sm" className="text-slate-500">Create your first program to get started</Text>
                            </div>
                            <Button
                              leftSection={<Plus size={16} />}
                              onClick={() => setOpened(true)}
                              variant="light"
                              size="sm"
                              radius="lg"
                              className="mt-2"
                            >
                              Add Program
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      filteredPrograms.map((program) => {
                        const progress = getProgressDays(program.startDate, program.endDate);
                        return (
                          <Table.Tr key={program._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                            <Table.Td className="py-4">
                              <div>
                                <Text className="text-slate-800 font-semibold text-base mb-1">
                                  {program.name || 'Unnamed Program'}
                                </Text>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${progress.percentage}%` }}
                                  ></div>
                                </div>
                                <Text size="xs" className="text-slate-500 mt-1">
                                  {progress.elapsed} / {progress.total} days
                                </Text>
                              </div>
                            </Table.Td>
                            <Table.Td className="py-4">
                              <Text className="text-slate-600 leading-relaxed max-w-xs" title={program.description}>
                                {program.description?.length > 100 
                                  ? `${program.description.substring(0, 100)}...` 
                                  : program.description || 'No description available'}
                              </Text>
                            </Table.Td>
                            <Table.Td className="py-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-slate-400" />
                                  <Text size="sm" className="text-slate-600">
                                    {formatDate(program.startDate)}
                                  </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3.5 h-3.5"></div>
                                  <Text size="sm" className="text-slate-500">
                                    {formatDate(program.endDate)}
                                  </Text>
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td className="py-4">
                              {getStatusBadge(program.startDate, program.endDate)}
                            </Table.Td>
                            <Table.Td className="py-4">
                              <Group gap="xs">
                                <Tooltip label="Edit Program" position="top">
                                  <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    radius="lg"
                                    className="text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                                    onClick={() => handleEdit(program)}
                                  >
                                    <Edit size={16} />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete Program" position="top">
                                  <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    radius="lg"
                                    className="text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    onClick={() => handleDelete(program._id)}
                                  >
                                    <Trash2 size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </Card>

        {/* Enhanced Modal */}
        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title={
            <Group gap="md" className="py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                {editing ? 
                  <Edit size={18} className="text-blue-600" /> : 
                  <Plus size={18} className="text-blue-600" />
                }
              </div>
              <div>
                <Text className="text-xl font-bold text-slate-800">
                  {editing ? 'Edit Program' : 'Create New Program'}
                </Text>
                <Text size="sm" className="text-slate-600">
                  {editing ? 'Update program information' : 'Add a new assistance program'}
                </Text>
              </div>
            </Group>
          }
          radius="xl"
          size="lg"
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          className="backdrop-blur-sm"
          fullScreen={window.innerWidth < 768}
        >
          <Divider className="mb-6 -mt-2" />
          
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <TextInput
                label="Program Name"
                description="Enter a descriptive name for your program"
                placeholder="e.g., Food Assistance Program"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                radius="lg"
                size="md"
                leftSection={<FileText size={18} className="text-slate-400" />}
                classNames={{
                  input: 'border-slate-200 focus:border-blue-500 transition-colors duration-200',
                  label: 'text-slate-700 font-medium mb-2'
                }}
              />

              <Textarea
                label="Program Description"
                description="Provide details about the program's purpose and scope"
                placeholder="Describe the program objectives, target audience, and key activities..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                radius="lg"
                size="md"
                minRows={4}
                autosize
                classNames={{
                  input: 'border-slate-200 focus:border-blue-500 transition-colors duration-200',
                  label: 'text-slate-700 font-medium mb-2'
                }}
              />

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Start Date"
                    description="When the program begins"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    error={errors.startDate}
                    radius="lg"
                    size="md"
                    leftSection={<Calendar size={18} className="text-slate-400" />}
                    classNames={{
                      input: 'border-slate-200 focus:border-blue-500 transition-colors duration-200',
                      label: 'text-slate-700 font-medium mb-2'
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="End Date"
                    description="When the program concludes"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    error={errors.endDate}
                    radius="lg"
                    size="md"
                    leftSection={<Calendar size={18} className="text-slate-400" />}
                    classNames={{
                      input: 'border-slate-200 focus:border-blue-500 transition-colors duration-200',
                      label: 'text-slate-700 font-medium mb-2'
                    }}
                  />
                </Grid.Col>
              </Grid>

              <Divider className="mt-2" />

              <Group justify="flex-end" className="pt-2 flex-col sm:flex-row gap-2">
                <Button
                  variant="subtle"
                  onClick={handleCloseModal}
                  size="md"
                  radius="lg"
                  className="text-slate-600 hover:bg-slate-100 w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  size="md"
                  radius="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto order-1 sm:order-2"
                  leftSection={editing ? <Edit size={16} /> : <Plus size={16} />}
                >
                  {editing ? 'Update Program' : 'Create Program'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
};

export default Programs;