import {
  Card,
  Title,
  Button,
  FileInput,
  Stack,
  Flex,
  ThemeIcon
} from '@mantine/core';
import {
  IconUpload,
  IconDatabase
} from '@tabler/icons-react';

const CSVUpload = ({ csvFile, onFileChange, onUpload }) => {
  const handleUpload = () => {
    if (csvFile) {
      onUpload(csvFile);
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <Card.Section className="p-4" style={{ backgroundColor: '#DC2626' }}>
        <Flex align="center" gap="md">
          <ThemeIcon size={40} className="bg-white/20">
            <IconUpload size={20} className="text-white" />
          </ThemeIcon>
          <Title order={3} c={'white'}>
            Bulk Upload
          </Title>
        </Flex>
      </Card.Section>

      <Card.Section className="p-6">
        <Stack gap="lg">
          <FileInput
            label="Upload CSV File"
            placeholder="Choose CSV file"
            accept=".csv"
            value={csvFile}
            onChange={onFileChange}
            size="md"
            leftSection={<IconDatabase size={16} />}
          />
          <Button 
            onClick={handleUpload}
            color="red"
            leftSection={<IconUpload size={16} />}
            disabled={!csvFile}
            fullWidth
            size="md"
          >
            Upload CSV
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default CSVUpload;