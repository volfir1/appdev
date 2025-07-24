import { Modal, Text, Group, Button } from "@mantine/core";

export default function ConfirmModal({ opened, onClose, title, message, confirmLabel, confirmColor, onConfirm }) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text>{message}</Text>
      <Group mt="md" justify="flex-end">
        <Button variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button color={confirmColor} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}