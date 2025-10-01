import { Group, Center, Stack, Input, Button, ActionIcon } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

export default function Home() {
  return (
    <Center h="100vh">
      <Stack>
        <Group>
          <Input size="md" placeholder="text here" />
          <ActionIcon>
            <IconSend />
          </ActionIcon>
        </Group>
      </Stack>
    </Center>
  );
}
