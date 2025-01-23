import {
  Modal,
  Button,
  TextInput,
  Switch,
  Stack,
  PasswordInput,
} from "@mantine/core";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  currentUser: User;
  opened: boolean;
  close: () => void;
};

function UpdateUserModal({ currentUser, opened, close }: Props) {
  //const [opened, { open, close }] = useDisclosure(false);

  const [username, setUsername] = useState(currentUser?.name);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(currentUser?.role.name === "admin");

  useEffect(() => {
    setUsername(currentUser?.name);
    setIsAdmin(currentUser?.role.name === "admin");
  }, [currentUser]);

  const updateUser = async () => {
    const addRequest = await fetch("/api/admin/updateUser", {
      method: "PATCH",
      body: JSON.stringify({
        userId: currentUser.id,
        username,
        password,
        isAdmin,
      }),
    });
    const response = await addRequest.json();
    if (addRequest.status === 200) {
      close();
    }
  };

  if (currentUser === null) {
    return null;
  }
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

          <PasswordInput
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

          <Button onClick={updateUser} disabled={!username || !password}>
            Update User
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default UpdateUserModal;
