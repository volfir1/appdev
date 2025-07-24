import React from "react";
import { Card, Title, Text } from "@mantine/core";
import { BarChart, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, Pie, Cell, Legend } from "recharts";

// COLORS for charts
const COLORS = ["#EF4444", "#F87171", "#FECACA", "#60A5FA", "#34D399", "#FBBF24", "#6366F1"];

export function DashboardCharts({ households }) {
  // Risk level summary for PieChart
  const riskSummary = [
    { name: "High", value: households.filter(h => h.riskLevel === "High").length },
    { name: "Moderate", value: households.filter(h => h.riskLevel === "Moderate").length },
    { name: "Low", value: households.filter(h => h.riskLevel === "Low").length },
  ];

  // Poverty score distribution for BarChart
  const povertyBuckets = [
    { label: "0-19", min: 0, max: 19 },
    { label: "20-39", min: 20, max: 39 },
    { label: "40-59", min: 40, max: 59 },
    { label: "60-79", min: 60, max: 79 },
    { label: "80-100", min: 80, max: 100 },
  ];
  const povertyData = povertyBuckets.map(bucket => ({
    range: bucket.label,
    count: households.filter(h => (h.povertyScore ?? 0) >= bucket.min && (h.povertyScore ?? 0) <= bucket.max).length,
  }));

  // Barangay summary for BarChart
  const barangayCounts = {};
  households.forEach(h => {
    const barangay = h.barangay?.name || h.barangay || "Unknown";
    barangayCounts[barangay] = (barangayCounts[barangay] || 0) + 1;
  });
  const barangayData = Object.entries(barangayCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Risk Level Pie Chart */}
      <Card shadow="sm" radius="lg" className="bg-white">
        <Title order={5} className="mb-2 text-gray-800">Households by Risk Level</Title>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={riskSummary} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {riskSummary.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <RechartsTooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Poverty Score Bar Chart */}
      <Card shadow="sm" radius="lg" className="bg-white">
        <Title order={5} className="mb-2 text-gray-800">Poverty Score Distribution</Title>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={povertyData}>
            <XAxis dataKey="range" />
            <YAxis allowDecimals={false} />
            <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <RechartsTooltip />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Barangay Bar Chart */}
      <Card shadow="sm" radius="lg" className="bg-white">
        <Title order={5} className="mb-2 text-gray-800">Households by Barangay</Title>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barangayData} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="name" type="category" width={100} />
            <Bar dataKey="count" fill="#60A5FA" radius={[0, 4, 4, 0]} />
            <RechartsTooltip />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
