import React, { useState } from "react";
import { Card, Text, Title, Button, Select, TextInput, Alert, Box, Flex, ThemeIcon } from "@mantine/core";
import { IconSend, IconUserPlus } from "@tabler/icons-react";

import { useEffect, useRef } from "react";

const ReferralForm = ({ beneficiaries, programs, onSubmit, error, loading }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [reason, setReason] = useState("");
  const prevLoading = useRef(false);

  // Reset form after successful submit (loading goes from true to false and no error)
  useEffect(() => {
    if (prevLoading.current && !loading && !error) {
      setSelectedBeneficiary("");
      setSelectedProgram("");
      setReason("");
    }
    prevLoading.current = loading;
  }, [loading, error]);

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Card>
        <Card.Section p="md" bg="#DC2626">
          <Flex align="center" gap="md">
            <ThemeIcon size={48} className="bg-white/20 shadow-lg">
              <IconUserPlus size={24} className="text-white" />
            </ThemeIcon>
            <Title order={2} c="white">
              Refer Beneficiary
            </Title>
          </Flex>
        </Card.Section>
        <Card.Section>
          {error && (
            <Alert color="red" className="mb-6" variant="light">
              {error}
            </Alert>
          )}
          <Select
            label="Select Beneficiary"
            placeholder="Choose beneficiary to refer"
            data={beneficiaries.map(b => ({ value: b._id, label: b.householdHead + ' - ' + b.address }))}
            value={selectedBeneficiary}
            onChange={setSelectedBeneficiary}
            required
            size="md"
            className="form-input-animated"
          />
          <Select
            label="Recommended Program"
            placeholder="Choose program"
            data={programs.map(p => ({ value: String(p._id), label: p.name }))}
            value={selectedProgram}
            onChange={value => setSelectedProgram(value || "")}
            required
            size="md"
            className="form-input-animated"
            mt={16}
          />
          <TextInput
            label="Reason for Referral"
            placeholder="Enter reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            size="md"
            className="form-input-animated"
            mt={16}
          />
          <Button
            leftSection={<IconSend size={18} />}
            color="red"
            mt={24}
            loading={loading}
            disabled={!selectedBeneficiary || !selectedProgram || !reason}
            onClick={() => onSubmit(selectedBeneficiary, selectedProgram, reason)}
            fullWidth
          >
            Submit Referral
          </Button>
        </Card.Section>
      </Card>
    </Box>
  );
};

export default ReferralForm;
