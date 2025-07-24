
import { Card, Title, Text, Group, Badge, Loader, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import StatisticsCards from "../../shared/panel/components/statCard";
import HouseholdTable from "../../shared/panel/components/householdTable";

export default function UserDashboard() {
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@email.com";
  const userBarangayId = localStorage.getItem("barangay"); // should be the ObjectId
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [refRes, hhRes] = await Promise.all([
          axios.get("http://localhost:5000/api/referrals", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/households", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setReferrals(refRes.data);
        setHouseholds(hhRes.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by user's barangay
  const myHouseholds = households.filter(h => h.barangay?._id === userBarangayId || h.barangay === userBarangayId);
  const myReferrals = referrals.filter(r => {
    // Only referrals for households in user's barangay
    return r.household && (r.household.barangay?._id === userBarangayId || r.household.barangay === userBarangayId);
  });

  // Referral stats
  const totalReferrals = myReferrals.length;
  const approvedReferrals = myReferrals.filter(r => r.status === "approved").length;
  const pendingReferrals = myReferrals.filter(r => r.status === "pending").length;
  const completedReferrals = myReferrals.filter(r => r.status === "completed").length;

  // Beneficiary risk stats
  // const riskStats = myHouseholds.reduce(
  //   (acc, h) => {
  //     if (h.riskLevel === "High") acc.high++;
  //     else if (h.riskLevel === "Moderate") acc.moderate++;
  //     else if (h.riskLevel === "Low") acc.low++;
  //     return acc;
  //   },
  //   { high: 0, moderate: 0, low: 0 }
  // );

  return (
    <div className="flex flex-col items-center min-h-screen bg-rose-50 py-8">
      <Card shadow="md" radius="lg" className="w-full max-w-4xl bg-white mb-8">
        <Title order={2} className="text-gray-900 mb-2">
          Welcome, {userName}!
        </Title>
        <Text size="md" className="text-gray-600 mb-4">
          Email: {userEmail}
        </Text>
        {loading ? (
          <Loader color="red" />
        ) : (
          <>
            <StatisticsCards households={myHouseholds} />
            <Card withBorder shadow="sm" className="bg-rose-50 mb-6">
              <Title order={4} className="mb-2 text-rose-700">Referrals</Title>
              <Group gap="xs">
                <Badge color="gray" variant="light">Total: {totalReferrals}</Badge>
                <Badge color="yellow" variant="light">Pending: {pendingReferrals}</Badge>
                <Badge color="green" variant="light">Approved: {approvedReferrals}</Badge>
                <Badge color="blue" variant="light">Completed: {completedReferrals}</Badge>
              </Group>
            </Card>
            <HouseholdTable
              households={myHouseholds}
              onEdit={() => {}}
              onDelete={() => {}}
              loading={false}
            />
          </>
        )}
        <Text size="sm" className="mt-8 text-gray-400">
          This is your dashboard. Here you can manage your account and view updates.
        </Text>
      </Card>
    </div>
  );
}