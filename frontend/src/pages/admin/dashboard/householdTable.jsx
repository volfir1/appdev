import React, { useState, useMemo } from "react";
import { Pagination } from "@mantine/core";

const HouseholdTable = ({ households = [] }) => {
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
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#EF4444",
          color: "#FFFFFF",
          padding: "16px 24px",
          borderBottom: "1px solid #FFE4E6",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0",
          }}
        >
          Household Data Management
        </h3>
        <p
          style={{
            fontSize: "14px",
            margin: "4px 0 0 0",
            opacity: "0.9",
          }}
        >
          Total Households: {households.length} | Showing {startIndex + 1}-
          {Math.min(endIndex, households.length)} of {households.length}
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#F87171", color: "#FFFFFF" }}>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Barangay
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Family Income
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Poverty Score
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody>
            {households.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#374151",
                  }}
                >
                  No household data available
                </td>
              </tr>
            ) : (
              currentHouseholds.map((household) => (
                <tr
                  key={household._id}
                  style={{
                    borderBottom: "1px solid #FFE4E6",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    {household.barangay?.name || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    ₱{household.familyIncome?.toLocaleString() || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    {household.povertyScore || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    <span
                      style={{
                        color:
                          household.riskLevel === "High"
                            ? "#EF4444"
                            : household.riskLevel === "Moderate"
                            ? "#DC2626"
                            : "#374151",
                        backgroundColor:
                          household.riskLevel === "High"
                            ? "#FEE2E2"
                            : household.riskLevel === "Moderate"
                            ? "#FECACA"
                            : "#F3F4F6",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {household.riskLevel || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {households.length > 0 && totalPages > 1 && (
        <div
          style={{
            backgroundColor: "#F9FAFB",
            padding: "16px 24px",
            borderTop: "1px solid #FFE4E6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#374151",
            }}
          >
            Showing {startIndex + 1} to {Math.min(endIndex, households.length)}{" "}
            of {households.length} entries
          </div>

         <Pagination
  total={totalPages}
  value={currentPage}
  onChange={handlePageChange}
  size="sm"
  color="red"
/>
        </div>
      )}
    </div>
  );
};

export default HouseholdTable;
