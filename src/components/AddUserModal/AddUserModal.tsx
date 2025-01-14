import { Modal, Button, TextInput, Switch, Stack } from "@mantine/core";
import { useState } from "react";

type Props = {
  opened: boolean;
  close: () => void;
};

function AddUserModal({ opened, close }: Props) {
  //const [opened, { open, close }] = useDisclosure(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const addUser = async () => {
    const addRequest = await fetch("/api/admin/addUser", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        isAdmin,
      }),
    });
    const response = await addRequest.json();
    console.log(response);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        <Stack>
          <TextInput
            label="Username"
            withAsterisk
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextInput
            label="Password"
            withAsterisk
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            description="Make a good one"
          />

          <Switch
            checked={isAdmin}
            onChange={(event) => setIsAdmin(event.currentTarget.checked)}
            defaultChecked
            color="grape"
            label="is admin?"
          />

          <Button onClick={addUser} disabled={!username || !password}>
            Add User
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default AddUserModal;
