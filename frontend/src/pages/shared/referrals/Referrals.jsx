import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Loader, Title, Card, Container, Group, Text, ActionIcon, Tooltip, Stack, Divider, Modal, Box } from "@mantine/core";
import { CheckCircle, XCircle, Clock, Users, FileText, Calendar, User } from "lucide-react";
import { fetchReferrals, updateReferral } from "./referralService";
import ReferralForm from '../panel/components/referralForm';
import useHouseholdData from '../panel/hooks/useHouseholdData';
import HouseholdForm from '../panel/components/householdForm';
import useProgramsData from '../panel/hooks/useProgramsData';
import { notificationService } from "@/utils/notifications";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [referralError, setReferralError] = useState('');
  const [referralLoading, setReferralLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const {
    households,
    fetchHouseholds,
    barangayList
  } = useHouseholdData();
  const { programs } = useProgramsData();
  const role = localStorage.getItem('role');
  const [detailsModal, setDetailsModal] = useState({ open: false, household: null });

  useEffect(() => {
    fetchReferrals().then(data => {
      setReferrals(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch referrals:', err);
      notificationService.error('Error', 'Failed to load referrals. Please try refreshing the page.');
      setLoading(false);
    });
    fetchHouseholds();
  }, []); // Only run once on mount

  const handleStatusChange = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: status }));
    
    try {
      await updateReferral(id, { status });
      setReferrals(referrals.map(r => r._id === id ? { ...r, status } : r));
      
      // Show success notification
      const statusMessages = {
        approved: 'Referral has been approved successfully',
        completed: 'Referral has been marked as completed',
        rejected: 'Referral has been rejected'
      };
      
      notificationService.success(
        `Referral ${status.charAt(0).toUpperCase() + status.slice(1)}`, 
        statusMessages[status]
      );
      
    } catch (err) {
      console.error('Failed to update referral:', err);
      notificationService.error('Update Failed', 'Could not update referral status. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReferralSubmit = async (beneficiaryId, programId, reason) => {
    setReferralLoading(true);
    setReferralError('');
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) throw new Error('Missing token or userId');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await fetch(`${API_BASE}/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ household: beneficiaryId, program: programId, user: userId, notes: reason })
      });
      setReferralError('');
      notificationService.success('Referral Submitted', 'The referral has been successfully created and is now pending review.');
      // Refresh referrals list
      const updatedReferrals = await fetchReferrals();
      setReferrals(updatedReferrals);
    } catch {
      const errorMsg = 'Failed to submit referral. Please check your connection and try again.';
      setReferralError(errorMsg);
      notificationService.error('Submission Failed', errorMsg);
    } finally {
      setReferralLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "yellow";
      case "approved": return "green"; 
      case "completed": return "blue";
      case "rejected": return "red";
      default: return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return <Clock size={14} />;
      case "approved": return <CheckCircle size={14} />;
      case "completed": return <CheckCircle size={14} />;
      case "rejected": return <XCircle size={14} />;
      default: return null;
    }
  };

  const pendingCount = referrals.filter(r => r.status === 'pending').length;
  const approvedCount = referrals.filter(r => r.status === 'approved').length;
  const completedCount = referrals.filter(r => r.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-25">
      <Container size="xl" className="py-8">
        {/* Enhanced Header with Statistics */}
        <Card shadow="sm" radius="xl" className="bg-white/70 backdrop-blur-sm border border-rose-100 mb-6">
          <Group justify="space-between" className="mb-4">
            <div>
              <Title order={2} className="text-gray-900 font-bold mb-2">
                Referrals Management
              </Title>
              <Text size="sm" className="text-gray-600">
                Manage and track all referral requests across programs
              </Text>
            </div>
            
            <Group gap="lg">
              <Stack gap={4} align="center">
                <Text size="xs" className="text-gray-500 font-medium">TOTAL</Text>
                <Group gap={6} align="center">
                  <FileText size={16} className="text-gray-700" />
                  <Text size="lg" className="font-bold text-gray-900">{referrals.length}</Text>
                </Group>
              </Stack>
              
              <Divider orientation="vertical" />
              
              <Stack gap={4} align="center">
                <Text size="xs" className="text-yellow-600 font-medium">PENDING</Text>
                <Group gap={6} align="center">
                  <Clock size={16} className="text-yellow-600" />
                  <Text size="lg" className="font-bold text-yellow-700">{pendingCount}</Text>
                </Group>
              </Stack>
              
              <Stack gap={4} align="center">
                <Text size="xs" className="text-green-600 font-medium">APPROVED</Text>
                <Group gap={6} align="center">
                  <CheckCircle size={16} className="text-green-600" />
                  <Text size="lg" className="font-bold text-green-700">{approvedCount}</Text>
                </Group>
              </Stack>
              
              <Stack gap={4} align="center">
                <Text size="xs" className="text-blue-600 font-medium">COMPLETED</Text>
                <Group gap={6} align="center">
                  <CheckCircle size={16} className="text-blue-600" />
                  <Text size="lg" className="font-bold text-blue-700">{completedCount}</Text>
                </Group>
              </Stack>
            </Group>
          </Group>
        </Card>

        {/* Enhanced Referral Form */}
        <Card shadow="md" radius="xl" className="bg-white/90 backdrop-blur-sm border border-rose-200 mb-8 hover:shadow-lg transition-all duration-200">
          <div className="mb-4">
            <Title order={4} className="text-gray-800 mb-2">Create New Referral</Title>
            <Text size="sm" className="text-gray-600">Submit a new referral request for review</Text>
          </div>
          <Divider className="mb-6" />
          <ReferralForm
            beneficiaries={households}
            programs={programs}
            onSubmit={handleReferralSubmit}
            error={referralError}
            loading={referralLoading}
            // Ensure all roles, including worker, can select programs
            // If you have any role-based filtering, remove it here
          />
        </Card>

        {/* Enhanced Table */}
        <Card shadow="md" radius="xl" className="bg-white/90 backdrop-blur-sm border border-rose-200 hover:shadow-lg transition-all duration-200">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader color="red" size="lg" />
              <Text className="text-gray-500">Loading referrals...</Text>
            </div>
          ) : (
            <Table 
              highlightOnHover 
              verticalSpacing="lg"
              horizontalSpacing="xl"
              className="rounded-lg overflow-hidden"
            >
              <Table.Thead className="bg-gradient-to-r from-rose-100 to-rose-50">
                <Table.Tr>
                  <Table.Th className="text-gray-700 font-semibold">
                    <Group gap={6}>
                      <Users size={16} />
                      <span>Household</span>
                    </Group>
                  </Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">Program</Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">Barangay</Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">
                    <Group gap={6}>
                      <User size={16} />
                      <span>Submitted By</span>
                    </Group>
                  </Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">Status</Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">Notes</Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">
                    <Group gap={6}>
                      <Calendar size={16} />
                      <span>Date</span>
                    </Group>
                  </Table.Th>
                  <Table.Th className="text-gray-700 font-semibold">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {referrals.map(ref => (
                  <Table.Tr 
                    key={ref._id} 
                    className="hover:bg-rose-25 transition-colors duration-150 group"
                  >
                    <Table.Td className="text-gray-900 font-medium">
                      <div className="flex flex-col gap-1">
                        <Text className="font-semibold">
                          {ref.household?.householdHead || ref.household?.name || 'N/A'}
                        </Text>
                        {ref.household?.householdHead && ref.household?.name && (
                          <Text size="xs" className="text-gray-500">
                            ID: {ref.household.name}
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        variant="light" 
                        color="blue" 
                        radius="md"
                        className="font-medium"
                      >
                        {ref.program?.name || 'N/A'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color="teal"
                        radius="md"
                        className="font-medium"
                      >
                        {ref.household?.barangay?.name || ref.household?.barangay || 'N/A'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-gray-700">
                      <div className="flex flex-col gap-1">
                        <Text className="font-medium">
                          {ref.user?.name || 'N/A'}
                        </Text>
                        <Text size="xs" className="text-gray-500">
                          {ref.user?.email || 'N/A'}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex flex-col gap-2">
                        <Badge
                          color={getStatusColor(ref.status)}
                          variant="filled"
                          radius="md"
                          leftSection={getStatusIcon(ref.status)}
                          className="capitalize font-medium"
                        >
                          {ref.status}
                        </Badge>
                        {/* Show approver if approved or completed */}
                        {(ref.status === "approved" || ref.status === "completed") && ref.approvedBy && (
                          <Text size="xs" className="text-green-700 font-medium">
                            ✓ {ref.approvedBy?.name || ref.approvedBy?.email || 'Admin'}
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip 
                        label={ref.notes || 'No notes provided'} 
                        position="top"
                        multiline
                        maw={300}
                      >
                        <Text 
                          className="text-gray-600 truncate max-w-[200px] cursor-help"
                          size="sm"
                        >
                          {ref.notes || 'No notes'}
                        </Text>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td className="text-gray-500 text-sm">
                      <div className="flex flex-col gap-1">
                        <Text size="sm" className="font-medium">
                          {new Date(ref.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Text>
                        <Text size="xs" className="text-gray-400">
                          {new Date(ref.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View beneficiary details">
                          <Button
                            size="xs"
                            radius="md"
                            variant="outline"
                            color="blue"
                            onClick={() => setDetailsModal({ open: true, household: ref.household })}
                          >
                            View Details
                          </Button>
                        </Tooltip>
                        {(role === "admin" || role === "ngo_staff") && ref.status === "pending" && (
                          <>
                            <Tooltip label="Approve referral">
                              <Button
                                leftSection={actionLoading[ref._id] === 'approved' ? <Loader size={14} /> : <CheckCircle size={14} />}
                                size="xs"
                                radius="md"
                                onClick={() => handleStatusChange(ref._id, "approved")}
                                disabled={actionLoading[ref._id]}
                                className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:shadow-md"
                              >
                                Approve
                              </Button>
                            </Tooltip>
                            <Tooltip label="Mark as completed">
                              <Button
                                leftSection={actionLoading[ref._id] === 'completed' ? <Loader size={14} /> : <CheckCircle size={14} />}
                                size="xs"
                                radius="md"
                                onClick={() => handleStatusChange(ref._id, "completed")}
                                disabled={actionLoading[ref._id]}
                                className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md"
                              >
                                Complete
                              </Button>
                            </Tooltip>
                          </>
                        )}
                        {(role === "admin" || role === "ngo_staff") && ref.status !== "pending" && (
                          <Badge variant="light" color="gray" size="sm">
                            No actions available
                          </Badge>
                        )}
                        {(role === "worker") && (
                          <Badge variant="light" color="gray" size="sm">
                            View only
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
        {/* View Details Modal */}
        <Modal
          opened={detailsModal.open}
          onClose={() => setDetailsModal({ open: false, household: null })}
          title="Beneficiary Details"
          size="xl"
          centered
        >
          {detailsModal.household ? (
            <Box>
              <HouseholdForm
                formData={{
                  ...detailsModal.household,
                  barangay: detailsModal.household.barangay?.name || detailsModal.household.barangay || "",
                  governmentAssistance: Array.isArray(detailsModal.household.governmentAssistance)
                    ? detailsModal.household.governmentAssistance.join(", ")
                    : detailsModal.household.governmentAssistance || "",
                }}
                onInputChange={() => {}}
                onSubmit={null}
                onCancel={null}
                editingId={null}
                error={null}
                taguigBarangays={barangayList}
                viewOnly={true}
              />
            </Box>
          ) : (
            <Loader />
          )}
        </Modal>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {!loading && referrals.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <Title order={4} className="text-gray-500 mb-2">No referrals found</Title>
                <Text size="sm" className="text-gray-400 max-w-md mx-auto">
                  Get started by creating your first referral using the form above. 
                  All referrals will appear here for tracking and management.
                </Text>
              </div>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}