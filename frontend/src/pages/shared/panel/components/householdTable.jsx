import React, { useState, useMemo } from "react";
import {
  Card,
  Text,
  Title,
  Table,
  Badge,
  ActionIcon,
  Group,
  Box,
  Flex,
  ThemeIcon,
  Avatar,
  Progress,
  Loader,
  Pagination,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconUsers,
  IconStar,
  IconDroplet,
  IconBolt,
  IconHome,
} from "@tabler/icons-react";

const HouseholdTable = ({ households, onEdit, onDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(households.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHouseholds = useMemo(
    () => households.slice(startIndex, endIndex),
    [households, startIndex, endIndex]
  );

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when households data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [households.length]);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return "red";
      case "Moderate":
        return "yellow";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Card className="shadow-2xl border-0">
      <Card.Section className="p-6" style={{ backgroundColor: "#DC2626" }}>
        <Flex align="center" gap="md">
          <ThemeIcon size={48} pl={20}>
            <IconUsers size={24} color="white" />
          </ThemeIcon>
          <Box h={80}>
            <Title order={2} c={"white"} mt={10}>
              Registered Households
            </Title>
            <Text size="sm" c="#fee2e2  ">
              Total: {households.length} | Showing {startIndex + 1}-
              {Math.min(endIndex, households.length)} of {households.length}
            </Text>
          </Box>
        </Flex>
      </Card.Section>

      <Card.Section className="p-0">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader color="red" size="xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="font-bold text-gray-800 p-4">Barangay</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Household Head</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Address</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Income</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Poverty Score</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Risk Level</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Services</Table.Th>
                  <Table.Th className="font-bold text-gray-800 p-4">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentHouseholds.map((household) => (
                  <Table.Tr
                    key={household._id}
                    className="hover:bg-red-50 transition-all duration-200"
                  >
                    <Table.Td className="p-4">
                      <Flex align="center" gap="md">
                        <Avatar size="md" color="red">
                          {household.barangay?.name?.charAt(0) || 'N/A'}
                        </Avatar>
                        <Text size="sm" className="font-semibold text-gray-900">
                          {household.barangay?.name || 'N/A'}
                        </Text>
                      </Flex>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Text size="sm" className="font-semibold text-gray-700">
                        {household.householdHead || 'N/A'}
                      </Text>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Text size="sm" className="font-semibold text-gray-700">
                        {household.address || 'N/A'}
                      </Text>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Text size="sm" className="font-semibold text-gray-700">
                        ₱{household.familyIncome.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Box>
                        <Text
                          size="sm"
                          className="font-semibold text-gray-700 mb-1"
                        >
                          {household.povertyScore}%
                        </Text>
                        <Progress
                          value={household.povertyScore}
                          size="xs"
                          color="red"
                        />
                      </Box>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Badge
                        color={getRiskLevelColor(household.riskLevel)}
                        size="lg"
                        leftSection={<IconStar size={12} />}
                      >
                        {household.riskLevel}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Group gap="xs">
                        {household.accessToServices.water && (
                          <Badge
                            size="sm"
                            color="cyan"
                            variant="light"
                            leftSection={<IconDroplet size={12} />}
                          >
                            Water
                          </Badge>
                        )}
                        {household.accessToServices.electricity && (
                          <Badge
                            size="sm"
                            color="orange"
                            variant="light"
                            leftSection={<IconBolt size={12} />}
                          >
                            Electric
                          </Badge>
                        )}
                        {household.accessToServices.sanitation && (
                          <Badge
                            size="sm"
                            color="teal"
                            variant="light"
                            leftSection={<IconHome size={12} />}
                          >
                            Sanitation
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td className="p-4">
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          size="lg"
                          onClick={() => onEdit(household)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          size="lg"
                          onClick={() => onDelete(household._id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Card.Section>

      {/* Pagination Footer */}
      {households.length > 0 && totalPages > 1 && (
        <Card.Section
          className="p-4"
          style={{ backgroundColor: "#F9FAFB", borderTop: "1px solid #FFE4E6" }}
        >
          <Flex justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, households.length)} of {households.length}{" "}
              entries
            </Text>

            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={handlePageChange}
              size="sm"
              color="red"
            />
          </Flex>
        </Card.Section>
      )}
    </Card>
  );
};

export default HouseholdTable;
