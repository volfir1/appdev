import React from "react";
import {
  Card,
  Text,
  Title,
  Button,
  Select,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  Stack,
  Alert,
  Box,
  Grid,
  Flex,
  ThemeIcon,
} from "@mantine/core";
import {
  IconPlus,
  IconX,
  IconCheck,
  IconBuildingCommunity,
  IconDroplet,
  IconBolt,
  IconHome,
} from "@tabler/icons-react";

const HouseholdForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  editingId,
  error,
  taguigBarangays,
  viewOnly = false,
}) => {
  const role = localStorage.getItem('role');

  // Helper: get worker's barangay value (id)
  const workerBarangayValue = React.useMemo(() => {
    if (role === 'worker' && taguigBarangays && taguigBarangays.length > 0) {
      // Try to find the barangay assigned to the worker in formData
      if (formData.barangay) return formData.barangay;
      // Fallback: use the first barangay in the list
      return taguigBarangays[0].value;
    }
    return undefined;
  }, [role, taguigBarangays, formData.barangay]);

  // When formData.barangay is empty and user is worker, set it automatically
  React.useEffect(() => {
    if (role === 'worker' && !formData.barangay && workerBarangayValue) {
      onInputChange('barangay', workerBarangayValue);
    }
  }, [role, formData.barangay, workerBarangayValue, onInputChange]);

  return (
    <Box className="max-w-4xl mx-auto p-4">
      <Card >
        {/* Header Section */}
        {!viewOnly && (
          <Card.Section  p='md' bg={"#DC2626"}>
            <Flex align="center" gap="md" className="relative z-10">
              <ThemeIcon size={48} className="bg-white/20 shadow-lg">
                <IconPlus size={24} className="text-white" />
              </ThemeIcon>
              <Title order={2} c={'white'} >
                {editingId ? "Edit Household" : "Add New Household"}
              </Title>
            </Flex>
          </Card.Section>
        )}

        {/* Form Content */}
        <Card.Section >
          {error && (
            <Alert color="red" className="mb-6" variant="light">
              {error}
            </Alert>
          )}

          <Stack gap="lg" p={15} >
            {/* Basic Information Section */}
            <Box>
              <Text size="lg" weight={600} className="text-gray-800 mb-4 font" fw={700} >
                Basic Information
              </Text>
              <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    {viewOnly || role === 'worker' ? (
                      <TextInput
                        label="Barangay"
                        value={
                          taguigBarangays && taguigBarangays.length > 0
                            ? (
                                taguigBarangays.find(b => b.value === formData.barangay)?.label
                                  || formData.barangay
                                  || 'N/A'
                              )
                            : (formData.barangay || 'N/A')
                        }
                        readOnly
                        size="md"
                        className="form-input-animated"
                      />
                    ) : (
                      <Select
                        label="Barangay"
                        placeholder="Select barangay"
                        data={taguigBarangays}
                        value={formData.barangay}
                        onChange={(value) => onInputChange("barangay", value)}
                        required
                        size="md"
                        className="form-input-animated"
                      />
                    )}
                  </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Household Head"
                    placeholder="Enter household head"
                    value={formData.householdHead}
                    onChange={(e) => onInputChange("householdHead", e.target.value)}
                    required
                    size="md"
                    className="form-input-animated"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => onInputChange("address", e.target.value)}
                    required
                    size="md"
                    className="form-input-animated"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }} >
                  <NumberInput
                    label="Family Income"
                    placeholder="Enter family income"
                    value={formData.familyIncome}
                    onChange={(value) => onInputChange("familyIncome", value)}
                    required
                    size="md"
                    min={0}
                    prefix="₱"
                    className="form-input-animated"
                  />
                </Grid.Col>
              </Grid>
            </Box>

            {/* Employment and Education Section */}
            <Box>
              <Text size="lg" weight={600} className="text-gray-800 mb-4" fw={700}>
                Employment & Education
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Employment Status"
                    placeholder="Select employment status"
                    data={["Employed", "Unemployed", "Self-Employed"]}
                    value={formData.employmentStatus}
                    onChange={(value) =>
                      onInputChange("employmentStatus", value)
                    }
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Education Level"
                    placeholder="Select education level"
                    data={["None", "Elementary", "High School", "College"]}
                    value={formData.educationLevel}
                    onChange={(value) => onInputChange("educationLevel", value)}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Box>

            {/* Housing Information Section */}
            <Box>
              <Text size="lg" weight={600} className="text-gray-800 mb-4" fw={700}>
                Housing Information
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Housing Type"
                    placeholder="Select housing type"
                    data={["Owned", "Rented", "Informal Settler"]}
                    value={formData.housingType}
                    onChange={(value) => onInputChange("housingType", value)}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Government Assistance"
                    placeholder="e.g., 4Ps, DSWD, etc."
                    value={formData.governmentAssistance}
                    onChange={(e) =>
                      onInputChange("governmentAssistance", e.target.value)
                    }
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Box>

            {/* Access to Services Section */}
            <Box
              className="p-6 rounded-xl border"
              style={{ backgroundColor: "#FFF1F2", borderColor: "#FECACA" }}
            >
              <Text
                size="lg"
                weight={600}
                className="text-gray-800 mb-4 flex items-center gap-2"fw={700}
              >
                <IconBuildingCommunity size={20} style={{ color: "#DC2626" }}  />
                Access to Services
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Checkbox
                    label="Water Access"
                    checked={formData.accessToServices?.water || false}
                    onChange={(e) =>
                      onInputChange(
                        "accessToServices.water",
                        e.currentTarget.checked
                      )
                    }
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Checkbox
                    label="Electricity Access"
                    checked={formData.accessToServices?.electricity || false}
                    onChange={(e) =>
                      onInputChange(
                        "accessToServices.electricity",
                        e.currentTarget.checked
                      )
                    }
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Checkbox
                    label="Sanitation Access"
                    checked={formData.accessToServices?.sanitation || false}
                    onChange={(e) =>
                      onInputChange(
                        "accessToServices.sanitation",
                        e.currentTarget.checked
                      )
                    }
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Box>
          </Stack>
        </Card.Section>

        {/* Action Buttons */}
        {!viewOnly && (
          <Card.Section className="p-6  border-t">
            <Group justify="flex-end" gap="md">
              {editingId && (
                <Button
                  variant="outline"
                  color="gray"
                  onClick={onCancel}
                  leftSection={<IconX size={16} />}
                  size="md"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={onSubmit}
                color="red"
                leftSection={
                  editingId ? <IconCheck size={16} /> : <IconPlus size={16} />
                }
                size="md"
              >
                {editingId ? "Update" : "Add"} Household
              </Button>
            </Group>
          </Card.Section>
        )}
      </Card>
    </Box>
  );
};

export default HouseholdForm;
