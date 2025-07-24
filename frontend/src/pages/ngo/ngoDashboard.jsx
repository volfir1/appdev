import React, { useEffect, useState } from "react";
import { Modal, Textarea } from "@mantine/core";
import {
  Table,
  Button,
  Badge,
  Loader,
  Title,
  Card,
  Container,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Stack,
  Divider,
  Box,
  Select,
  ScrollArea,
} from "@mantine/core";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Calendar,
  User,
} from "lucide-react";

import {
  fetchReferrals,
  updateReferral,
} from "../shared/referrals/referralService";
import { notificationService } from "@/utils/notifications";

import useHouseholdData from "../shared/panel/hooks/useHouseholdData";
import HouseholdForm from "../shared/panel/components/householdForm";

export default function NgoDashboard() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  // Cancel modal state
  const [cancelModal, setCancelModal] = useState({ open: false, id: null });
  const [cancelNotes, setCancelNotes] = useState("");
  // View Details modal state
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    household: null,
  });
  // Barangay filter
  const [barangayFilter, setBarangayFilter] = useState("");
  const { barangayList } = useHouseholdData();

  useEffect(() => {
    fetchReferrals()
      .then((data) => {
        setReferrals(data);
        setLoading(false);
      })
      .catch(() => {
        notificationService.error(
          "Error",
          "Failed to load referrals. Please try refreshing the page."
        );
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id, status, notes = "") => {
    setActionLoading((prev) => ({ ...prev, [id]: status }));
    try {
      await updateReferral(id, { status, notes });
      setReferrals(
        referrals.map((r) =>
          r._id === id
            ? { ...r, status, notes: status === "rejected" ? notes : r.notes }
            : r
        )
      );
      notificationService.success(
        `Referral ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        status === "approved"
          ? "Referral has been approved successfully"
          : "Referral has been cancelled."
      );
    } catch {
      notificationService.error(
        "Update Failed",
        "Could not update referral status. Please try again."
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "completed":
        return "blue";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "approved":
        return <CheckCircle size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  // Filter referrals by barangay if filter is set
  const filteredReferrals = barangayFilter
    ? referrals.filter((r) => r.household?.barangay?._id === barangayFilter)
    : referrals;
  const pendingCount = filteredReferrals.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedCount = filteredReferrals.filter(
    (r) => r.status === "approved"
  ).length;
  const completedCount = filteredReferrals.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-25 " >
      <Container size="xl" className="py-4 md:py-8 px-4" pt={80}>
        {/* Header Card - Mobile Responsive */}
        <Card
          shadow="sm"
          radius="xl"
          className="bg-white/70 backdrop-blur-sm border border-rose-100 mb-4 md:mb-6"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Title Section */}
            <div>
              <Title order={2} className="text-gray-900 font-bold mb-2 text-xl md:text-2xl">
                Referrals Management
              </Title>
              <Text size="sm" className="text-gray-600">
                Approve or cancel referral requests. NGOs cannot create new
                referrals.
              </Text>
            </div>
            
            {/* Stats Section - Responsive Grid */}
            <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6">
              <div className="flex flex-col items-center text-center">
                <Text size="xs" className="text-gray-500 font-medium mb-1">
                  TOTAL
                </Text>
                <Group gap={6} align="center" justify="center">
                  <FileText size={16} className="text-gray-700" />
                  <Text size="lg" className="font-bold text-gray-900">
                    {referrals.length}
                  </Text>
                </Group>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <Text size="xs" className="text-yellow-600 font-medium mb-1">
                  PENDING
                </Text>
                <Group gap={6} align="center" justify="center">
                  <Clock size={16} className="text-yellow-600" />
                  <Text size="lg" className="font-bold text-yellow-700">
                    {pendingCount}
                  </Text>
                </Group>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <Text size="xs" className="text-green-600 font-medium mb-1">
                  APPROVED
                </Text>
                <Group gap={6} align="center" justify="center">
                  <CheckCircle size={16} className="text-green-600" />
                  <Text size="lg" className="font-bold text-green-700">
                    {approvedCount}
                  </Text>
                </Group>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <Text size="xs" className="text-blue-600 font-medium mb-1">
                  COMPLETED
                </Text>
                <Group gap={6} align="center" justify="center">
                  <CheckCircle size={16} className="text-blue-600" />
                  <Text size="lg" className="font-bold text-blue-700">
                    {completedCount}
                  </Text>
                </Group>
              </div>
            </div>
          </div>
        </Card>

        {/* Barangay Filter - Mobile Responsive */}
        <Box className="mb-4 md:mb-6">
          <Select
            label="Filter by Barangay"
            placeholder="All Barangays"
            data={[{ label: "All", value: "" }, ...barangayList]}
            value={barangayFilter}
            onChange={setBarangayFilter}
            clearable
            className="w-full md:w-64"
          />
        </Box>

        {/* Table Card with Horizontal Scroll */}
        <Card
          shadow="md"
          radius="xl"
          className="bg-white/90 backdrop-blur-sm border border-rose-200 hover:shadow-lg transition-all duration-200"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader color="red" size="lg" />
              <Text className="text-gray-500">Loading referrals...</Text>
            </div>
          ) : (
            <>
              {/* Mobile: Show scroll hint */}
              <div className="block md:hidden mb-4 p-3 bg-blue-50 rounded-lg">
                <Text size="sm" className="text-blue-700 text-center">
                  ← Swipe left to see more columns →
                </Text>
              </div>
              
              {/* Horizontal Scrollable Table */}
              <ScrollArea>
                <Table
                  highlightOnHover
                  verticalSpacing="lg"
                  horizontalSpacing="md"
                  className="rounded-lg overflow-hidden"
                  style={{ minWidth: 1200 }} // Ensures table maintains width for scrolling
                >
                  <Table.Thead className="bg-gradient-to-r from-rose-100 to-rose-50">
                    <Table.Tr>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 180 }}>
                        <Group gap={6}>
                          <Users size={16} />
                          <span>Household</span>
                        </Group>
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 120 }}>
                        Program
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 120 }}>
                        Barangay
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 150 }}>
                        <Group gap={6}>
                          <User size={16} />
                          <span>Submitted By</span>
                        </Group>
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 120 }}>
                        Status
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 200 }}>
                        Notes
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 120 }}>
                        <Group gap={6}>
                          <Calendar size={16} />
                          <span>Date</span>
                        </Group>
                      </Table.Th>
                      <Table.Th className="text-gray-700 font-semibold whitespace-nowrap" style={{ minWidth: 200 }}>
                        Actions
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredReferrals.map((ref) => (
                      <Table.Tr
                        key={ref._id}
                        className="hover:bg-rose-25 transition-colors duration-150 group"
                      >
                        <Table.Td className="text-gray-900 font-medium">
                          <div className="flex flex-col gap-1">
                            <Text className="font-semibold whitespace-nowrap">
                              {ref.household?.householdHead ||
                                ref.household?.name ||
                                "N/A"}
                            </Text>
                            {ref.household?.householdHead &&
                              ref.household?.name && (
                                <Text size="xs" className="text-gray-500 whitespace-nowrap">
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
                            className="font-medium whitespace-nowrap"
                          >
                            {ref.program?.name || "N/A"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color="teal"
                            radius="md"
                            className="font-medium whitespace-nowrap"
                          >
                            {ref.household?.barangay?.name ||
                              ref.household?.barangay ||
                              "N/A"}
                          </Badge>
                        </Table.Td>
                        <Table.Td className="text-gray-700">
                          <div className="flex flex-col gap-1">
                            <Text className="font-medium whitespace-nowrap">
                              {ref.user?.name || "N/A"}
                            </Text>
                            <Text size="xs" className="text-gray-500 whitespace-nowrap">
                              {ref.user?.email || "N/A"}
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
                              className="capitalize font-medium whitespace-nowrap"
                            >
                              {ref.status}
                            </Badge>
                            {(ref.status === "approved" ||
                              ref.status === "completed") &&
                              ref.approvedBy && (
                                <Text
                                  size="xs"
                                  className="text-green-700 font-medium whitespace-nowrap"
                                >
                                  ✓ Approved by:{" "}
                                  {ref.approvedBy?.name ||
                                    ref.approvedBy?.email ||
                                    "Admin"}
                                </Text>
                              )}
                            {(ref.status === "rejected" ||
                              ref.status === "cancelled") &&
                              ref.approvedBy && (
                                <Text
                                  size="xs"
                                  className="text-red-700 font-medium whitespace-nowrap"
                                >
                                  ✗ Rejected by:{" "}
                                  {ref.approvedBy?.name ||
                                    ref.approvedBy?.email ||
                                    "Admin"}
                                </Text>
                              )}
                          </div>
                        </Table.Td>
                        <Table.Td style={{ maxWidth: 200 }}>
                          <Tooltip
                            label={ref.notes || "No notes provided"}
                            position="top"
                            multiline
                            maw={350}
                          >
                            <Text
                              className="text-gray-600 cursor-help"
                              size="sm"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 200,
                              }}
                            >
                              {ref.notes || "No notes"}
                            </Text>
                          </Tooltip>
                        </Table.Td>
                        <Table.Td className="text-gray-500 text-sm">
                          <div className="flex flex-col gap-1">
                            <Text size="sm" className="font-medium whitespace-nowrap">
                              {new Date(ref.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Text>
                            <Text size="xs" className="text-gray-400 whitespace-nowrap">
                              {new Date(ref.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" className="whitespace-nowrap">
                            <Tooltip label="View beneficiary details">
                              <Button
                                size="xs"
                                radius="md"
                                variant="outline"
                                color="blue"
                                onClick={() =>
                                  setDetailsModal({
                                    open: true,
                                    household: ref.household,
                                  })
                                }
                              >
                                View
                              </Button>
                            </Tooltip>
                            {ref.status === "pending" && (
                              <>
                                <Tooltip label="Approve referral">
                                  <Button
                                    leftSection={
                                      actionLoading[ref._id] === "approved" ? (
                                        <Loader size={14} />
                                      ) : (
                                        <CheckCircle size={14} />
                                      )
                                    }
                                    size="xs"
                                    radius="md"
                                    onClick={() =>
                                      handleStatusChange(ref._id, "approved")
                                    }
                                    disabled={actionLoading[ref._id]}
                                    className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:shadow-md"
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip label="Cancel referral">
                                  <Button
                                    leftSection={
                                      actionLoading[ref._id] === "rejected" ? (
                                        <Loader size={14} />
                                      ) : (
                                        <XCircle size={14} />
                                      )
                                    }
                                    size="xs"
                                    radius="md"
                                    onClick={() => {
                                      setCancelModal({ open: true, id: ref._id });
                                      setCancelNotes("");
                                    }}
                                    disabled={actionLoading[ref._id]}
                                    className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:shadow-md"
                                  >
                                    Cancel
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                            {ref.status !== "pending" && (
                              <Badge variant="light" color="gray" size="sm">
                                No actions
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </>
          )}

          {!loading && referrals.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <Title order={4} className="text-gray-500 mb-2">
                  No referrals found
                </Title>
                <Text size="sm" className="text-gray-400 max-w-md mx-auto">
                  No referrals available for review.
                </Text>
              </div>
            </div>
          )}
        </Card>
      </Container>

      {/* Cancel Reason Modal */}
      <Modal
        opened={cancelModal.open}
        onClose={() => setCancelModal({ open: false, id: null })}
        title="Cancel Referral"
        centered
        size="md"
      >
        <Textarea
          label="Reason for cancellation"
          placeholder="Enter reason for cancelling this referral"
          value={cancelNotes}
          onChange={(e) => setCancelNotes(e.target.value)}
          minRows={3}
          autosize
          required
        />
        <Group mt="md" justify="flex-end">
          <Button
            variant="default"
            onClick={() =>
              setCancelModal({ open: false, id: null })
            }
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={async () => {
              await handleStatusChange(
                cancelModal.id,
                "rejected",
                cancelNotes
              );
              setCancelModal({ open: false, id: null });
            }}
            disabled={!cancelNotes.trim()}
          >
            Confirm Cancel
          </Button>
        </Group>
      </Modal>

      {/* View Details Modal */}
      <Modal
        opened={detailsModal.open}
        onClose={() =>
          setDetailsModal({ open: false, household: null })
        }
        title="Beneficiary Details"
        size="xl"
        centered
      >
        {detailsModal.household ? (
          <Box>
            <HouseholdForm
              formData={{
                ...detailsModal.household,
                barangay:
                  detailsModal.household.barangay?.name ||
                  detailsModal.household.barangay ||
                  "",
                governmentAssistance: Array.isArray(
                  detailsModal.household.governmentAssistance
                )
                  ? detailsModal.household.governmentAssistance.join(
                      ", "
                    )
                  : detailsModal.household.governmentAssistance ||
                    "",
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
    </div>
  );
}