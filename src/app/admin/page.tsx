"use client";
import AddUserModal from "@/components/AddUserModal/AddUserModal";
import AuthorizedPage from "@/components/AuthorizedPage/AuthorizedPage";
import {
  Button,
  Title,
  Text,
  Dialog,
  Space,
  Table,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Admin = () => {
  const { data: session } = useSession();
  const [gifCount, setGifCount] = useState();
  const [scanning, setScanning] = useState(false);
  const [gifsAdded, setGifsAdded] = useState(0);
  const [users, setUsers] = useState<Array<User>>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [dialogOpened, { close: dialogClose }] = useDisclosure(false);

  const getCount = async () => {
    const countRequest = await fetch("/api/admin/count");
    setGifCount((await countRequest.json()).gifCount);
  };

  const getUserList = async () => {
    const usersRequest = await fetch("/api/admin/users");
    setUsers((await usersRequest.json()).users);
  };

  const scanForGifs = async () => {
    setScanning(true);
    const countRequest = await fetch("/api/admin/scan");
    setGifsAdded((await countRequest.json()).newGifs);
    setScanning(false);
  };

  const rebuildSearch = async () => {
    setRebuilding(true);
    await fetch("/api/search/updateIndex", { method: "POST" });
    setRebuilding(false);
  };

  useEffect(() => {
    getCount();
    getUserList();
  }, [gifsAdded]);

  const userRows = () => {
    const rows = users.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{`${user.createdAt}`}</Table.Td>
        <Table.Td>{user.role.name}</Table.Td>
      </Table.Tr>
    ));
    return rows;
  };

  return (
    <AuthorizedPage>
      <Space h="xl" />
      <Title>Hi {session?.user.name}</Title>
      <Text>There are {gifCount} gifs here.</Text>

      <Space h="xl" />
      <Title order={2}>Scan directory</Title>

      <Text>
        This will rescan the directory you’ve configured to hold your gifs and
        update the database with any new files.
      </Text>
      <Space h="md" />
      <Button onClick={scanForGifs} loading={scanning}>
        Scan
      </Button>

      <Space h="xl" />

      <Title order={2}>Rebuild search index</Title>

      <Space h="md" />
      <Button onClick={rebuildSearch} loading={rebuilding}>
        Rebuild search index
      </Button>

      <Space h="xl" />

      <Title order={2}>Users</Title>
      <Group justify="flex-end">
        <Button onClick={open}>Add User</Button>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User Name</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Gifs</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{userRows()}</Table.Tbody>
      </Table>

      <AddUserModal opened={opened} close={close} />
      <Dialog
        opened={dialogOpened}
        onClose={dialogClose}
        withCloseButton
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={500}>
          Database updated
        </Text>
        <Text size="sm">Added {gifsAdded} gifs.</Text>
      </Dialog>
    </AuthorizedPage>
  );
};

export default Admin;
