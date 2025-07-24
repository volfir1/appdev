import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Select,
  Text,
  ScrollArea,
} from "@mantine/core";
import {
  Container,
  Title,
  Box,
  Grid,
  Flex,
  ThemeIcon,
  Stack,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

// Import components

import StatisticsCards from "./components/statCard";

import ReportDownload from "../../../components/download/ReportDownload";

// Import hook and constants
import useHouseholdData from "./hooks/useHouseholdData";
import useDeletedHouseholds from "./hooks/useDeletedHouseholds";

import HouseholdForm from "./components/householdForm";
import HouseholdTable from "./components/householdTable";
import CSVUpload from "./components/csvUpload";

const BeneficiaryPanel = () => {
  const {
    // State
    households,
    formData,
    csvFile,
    editingId,
    error,
    loading,
    barangayList,
    // Setters
    setCsvFile,
    // Handlers
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    handleCsvUpload,
    fetchHouseholds,
  } = useHouseholdData();

  // Admin-only Add Barangay state/hooks (must be inside component)
  const [addBarangayOpen, setAddBarangayOpen] = useState(false);
  const [newBarangay, setNewBarangay] = useState("");
  const [addBarangayError, setAddBarangayError] = useState("");
  const role = localStorage.getItem("role");

  // Search and filter state
  const [search, setSearch] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("");

  // Recover deleted beneficiaries modal state
  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const {
    deletedHouseholds,
    loading: deletedLoading,
    error: deletedError,
    fetchDeletedHouseholds,
    recoverHousehold,
  } = useDeletedHouseholds();

  // Handler to add barangay
  const handleAddBarangay = async () => {
    setAddBarangayError("");
    if (!newBarangay.trim()) {
      setAddBarangayError("Barangay name is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/barangays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newBarangay.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add barangay");
      }
      setNewBarangay("");
      setAddBarangayOpen(false);
      // Refetch barangay list if needed
      window.location.reload();
    } catch (err) {
      setAddBarangayError(err.message);
    }
  };

  // Open recover modal and fetch deleted households
  const openRecoverModal = () => {
    setRecoverModalOpen(true);
    fetchDeletedHouseholds();
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden" pt={80}>
      {/* Background decoration */}

      <Container
        size="auto"
        className="p-4 sm:p-8 lg:p-16 -mt-8 sm:-mt-10 lg:-mt-10"
      >
        {/* Header */}
        <Box className="text-center mb-8 sm:mb-12">
          <Flex
            gap="md"
            mb="md"
            className="pb-6 sm:pb-10 mt-4 sm:mt-5 flex-col sm:flex-row items-center sm:items-start text-center sm:text-left"
          >
            <Box className="w-full sm:w-auto">
              <Title order={1} className="text-xl sm:text-2xl">
                Household Management
              </Title>
              <Title
                order={2}
                c="#9CA3AF"
                className="text-sm sm:text-base lg:mr-16"
              >
                Taguig City Poverty Assessment Dashboard
              </Title>
            </Box>
          </Flex>
        </Box>

        {/* Admin-only Add Barangay Button */}
        <Group mb={16} className="flex-col sm:flex-row gap-2 sm:gap-4">
          {role === "admin" && (
            <Button
              color="blue"
              onClick={() => setAddBarangayOpen(true)}
              className="w-full sm:w-auto"
            >
              Add Barangay
            </Button>
          )}
          <Button
            color="gray"
            variant="outline"
            onClick={openRecoverModal}
            className="w-full sm:w-auto"
          >
            Recover Beneficiaries
          </Button>
          <Box className="w-full sm:w-auto">
            <ReportDownload />
          </Box>
        </Group>
        {/* Recover Beneficiaries Modal */}
        <Modal
          opened={recoverModalOpen}
          onClose={() => setRecoverModalOpen(false)}
          title="Recover Deleted Beneficiaries"
          size="xl"
          centered
          fullScreen={window.innerWidth < 768}
        >
          {deletedLoading ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <span>Loading...</span>
            </div>
          ) : deletedError ? (
            <div style={{ color: "red", padding: 16 }}>{deletedError}</div>
          ) : (
            <Box>
              {deletedHouseholds.length === 0 ? (
                <Text>No deleted beneficiaries found.</Text>
              ) : (
                <ScrollArea>
                  <div className="min-w-[600px]">
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                          <th
                            style={{
                              padding: 8,
                              border: "1px solid #eee",
                              minWidth: "150px",
                            }}
                          >
                            Household Head
                          </th>
                          <th
                            style={{
                              padding: 8,
                              border: "1px solid #eee",
                              minWidth: "120px",
                            }}
                          >
                            Barangay
                          </th>
                          <th
                            style={{
                              padding: 8,
                              border: "1px solid #eee",
                              minWidth: "200px",
                            }}
                          >
                            Address
                          </th>
                          <th
                            style={{
                              padding: 8,
                              border: "1px solid #eee",
                              minWidth: "100px",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {deletedHouseholds.map((h) => (
                          <tr key={h._id}>
                            <td
                              style={{ padding: 8, border: "1px solid #eee" }}
                            >
                              {h.householdHead}
                            </td>
                            <td
                              style={{ padding: 8, border: "1px solid #eee" }}
                            >
                              {h.barangay?.name || ""}
                            </td>
                            <td
                              style={{ padding: 8, border: "1px solid #eee" }}
                            >
                              {h.address}
                            </td>
                            <td
                              style={{ padding: 8, border: "1px solid #eee" }}
                            >
                              <Button
                                size="xs"
                                color="green"
                                onClick={async () => {
                                  await recoverHousehold(h._id);
                                  fetchHouseholds();
                                }}
                              >
                                Recover
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              )}
            </Box>
          )}
        </Modal>

        {/* Add Barangay Modal */}
        <Modal
          opened={addBarangayOpen}
          onClose={() => setAddBarangayOpen(false)}
          title="Add New Barangay"
          centered
          fullScreen={window.innerWidth < 768}
        >
          <TextInput
            label="Barangay Name"
            placeholder="Enter barangay name"
            value={newBarangay}
            onChange={(e) => setNewBarangay(e.target.value)}
            error={addBarangayError}
            required
          />
          <Group
            mt="md"
            justify="flex-end"
            className="flex-col sm:flex-row gap-2"
          >
            <Button
              variant="default"
              onClick={() => setAddBarangayOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleAddBarangay}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Add
            </Button>
          </Group>
        </Modal>

        {/* Statistics Cards */}
        <Box className="mb-6 sm:mb-8">
          <StatisticsCards households={households} />
        </Box>

        <Grid gutter="xl">
          {/* Form Section */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* Scrollable Household Form */}
              <Box className="household-form-container bg-white rounded-lg shadow-sm border border-gray-100">
                <Box className="p-4 sm:p-6">
                  <HouseholdForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelEdit}
                    editingId={editingId}
                    error={error}
                    taguigBarangays={barangayList}
                  />
                </Box>
              </Box>

              {/* CSV Upload - Fixed */}
              <Box className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <CSVUpload
                  csvFile={csvFile}
                  onFileChange={setCsvFile}
                  onUpload={handleCsvUpload}
                />
              </Box>
            </Stack>
          </Grid.Col>

          {/* Table Section */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Box className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 sm:p-4">
              <Group
                mb={16}
                gap={12}
                align="flex-end"
                className="flex-col sm:flex-row items-stretch sm:items-end"
              >
                <TextInput
                  placeholder="Search beneficiaries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:min-w-[200px] sm:w-auto"
                />
                {role === "admin" && (
                  <>
                    <div className="flex flex-col w-full sm:min-w-[180px] sm:w-auto">
                      <small className="mb-1 text-gray-500 text-xs">
                        Filter by Barangay
                      </small>
                      <Select
                        placeholder="All Barangays"
                        data={[{ label: "All", value: "" }, ...barangayList]}
                        value={barangayFilter}
                        onChange={setBarangayFilter}
                        clearable
                      />
                    </div>
                    <div className="flex flex-col w-full sm:min-w-[140px] sm:w-auto">
                      <small className="mb-1 text-gray-500 text-xs">
                        Filter by Risk Level
                      </small>
                      <Select
                        placeholder="All"
                        data={["", "Low", "Moderate", "High"].map((l) => ({
                          label: l || "All",
                          value: l,
                        }))}
                        value={riskFilter}
                        onChange={setRiskFilter}
                        clearable
                      />
                    </div>
                    <div className="flex flex-col w-full sm:min-w-[160px] sm:w-auto">
                      <small className="mb-1 text-gray-500 text-xs">
                        Filter by Employment Status
                      </small>
                      <Select
                        placeholder="All"
                        data={[
                          "",
                          "Employed",
                          "Unemployed",
                          "Self-Employed",
                        ].map((l) => ({ label: l || "All", value: l }))}
                        value={employmentFilter}
                        onChange={setEmploymentFilter}
                        clearable
                      />
                    </div>
                  </>
                )}
                {role === "worker" && (
                  <>
                    <div className="flex flex-col w-full sm:min-w-[140px] sm:w-auto">
                      <small className="mb-1 text-gray-500 text-xs">
                        Filter by Risk Level
                      </small>
                      <Select
                        placeholder="All"
                        data={["", "Low", "Moderate", "High"].map((l) => ({
                          label: l || "All",
                          value: l,
                        }))}
                        value={riskFilter}
                        onChange={setRiskFilter}
                        clearable
                      />
                    </div>
                    <div className="flex flex-col w-full sm:min-w-[160px] sm:w-auto">
                      <small className="mb-1 text-gray-500 text-xs">
                        Filter by Employment Status
                      </small>
                      <Select
                        placeholder="All"
                        data={[
                          "",
                          "Employed",
                          "Unemployed",
                          "Self-Employed",
                        ].map((l) => ({ label: l || "All", value: l }))}
                        value={employmentFilter}
                        onChange={setEmploymentFilter}
                        clearable
                      />
                    </div>
                  </>
                )}
              </Group>

              {/* Scrollable Table Container */}
              <ScrollArea>
                <Box style={{ minWidth: "800px" }}>
                  <HouseholdTable
                    households={households.filter((h) => {
                      const matchesSearch =
                        h.householdHead
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        h.address
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        h.barangay?.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase());
                      const matchesBarangay =
                        !barangayFilter ||
                        h.barangay?._id === barangayFilter ||
                        h.barangay === barangayFilter;
                      const matchesRisk =
                        !riskFilter || h.riskLevel === riskFilter;
                      const matchesEmployment =
                        !employmentFilter ||
                        h.employmentStatus === employmentFilter;
                      return (
                        matchesSearch &&
                        matchesBarangay &&
                        matchesRisk &&
                        matchesEmployment
                      );
                    })}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                  />
                </Box>
              </ScrollArea>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Bottom spacing */}
        <Box className="h-8"></Box>
      </Container>

      {/* Custom scrollbar styles */}
    </Box>
  );
};

export default BeneficiaryPanel;
