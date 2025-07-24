import React, { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "@/components/Cards/StatCard";
import HouseholdTable from "./householdTable";
import { DashboardCharts } from "./DashboardCharts";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ role }) => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate statistics from household data
  const getDisplayData = () => {
    if (!households || households.length === 0) {
      return {
        totalHouseholds: 0,
        avgPovertyScore: 0,
        riskLevels: { Low: 0, Moderate: 0, High: 0 },
      };
    }

    // Calculate statistics from actual household array
    const totalHouseholds = households.length;
    const avgPovertyScore =
      households.length > 0
        ? (
            households.reduce((sum, h) => sum + (h.povertyScore || 0), 0) /
            households.length
          ).toFixed(2)
        : 0;

    const riskLevels = households.reduce(
      (acc, household) => {
        const risk = household.riskLevel || "Low";
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      },
      { Low: 0, Moderate: 0, High: 0 }
    );

    return { totalHouseholds, avgPovertyScore, riskLevels };
  };

  // Function to refresh household data
  const refreshHouseholds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/households", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        if (role === "admin" && Array.isArray(response.data)) {
          setHouseholds(response.data);
        } else {
          setHouseholds(Array.isArray(response.data) ? response.data : []);
        }
      } else {
        setHouseholds([]);
      }

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Refresh error:", err.response);
      setError(err.response?.data?.message || "Failed to refresh data");
      setLoading(false);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    refreshHouseholds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, navigate]);

  if (loading)
    return <p style={{ textAlign: "center", color: "#374151" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "#EF4444" }}>{error}</p>;

  const displayData = getDisplayData();

  return (
    <div
      style={{
        minHeight: "100vh",
        
      }}
    >
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Header with refresh button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            
            <button
              onClick={refreshHouseholds}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#9CA3AF" : "#EF4444",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? "↻ Refreshing..." : "↻ Refresh Data"}
            </button>
          </div>

        {/* Dashboard Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <StatCard
            title="Total Households"
            value={displayData.totalHouseholds}
            backgroundColor="#FFFFFF"
          />
          <StatCard
            title="Average Poverty Score"
            value={displayData.avgPovertyScore}
            backgroundColor="#FFFFFF"
          />
          <StatCard
            title="High Risk Households"
            value={displayData.riskLevels.High}
            backgroundColor="#EF4444"
          />
          <StatCard
            title="Moderate Risk Households"
            value={displayData.riskLevels.Moderate}
            backgroundColor="#F87171"
          />
          <StatCard
            title="Low Risk Households"
            value={displayData.riskLevels.Low}
            backgroundColor="#FECACA"
          />
        </div>


        {/* Dashboard Charts and Summary */}
        <DashboardCharts households={households} />

        <HouseholdTable households={households} setHouseholds={setHouseholds} />

        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginTop: "24px",
          }}
        >
          <p style={{ color: "#374151" }}>
            {role === "admin"
              ? `Managing ${displayData.totalHouseholds} household${
                  displayData.totalHouseholds !== 1 ? "s" : ""
                }. Use the table above to manage household data.`
              : `Dashboard shows statistics for ${
                  displayData.totalHouseholds
                } household${displayData.totalHouseholds !== 1 ? "s" : ""}. ${
                  displayData.totalHouseholds === 0
                    ? "No households found - data will appear here when households are added."
                    : "Chart visualization coming soon."
                }`}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
